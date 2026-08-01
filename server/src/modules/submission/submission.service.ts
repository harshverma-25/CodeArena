import { submissionRepository } from './submission.repository.js';
import { matchRepository } from '../match/match.repository.js';
import { problemRepository } from '../problem/problem.repository.js';
import { roomRepository } from '../room/room.repository.js';
import { judge0Service, getJudge0LanguageId } from '../../shared/services/judge0.service.js';
import { SubmissionVerdict, ISubmissionDocument } from './submission.types.js';
import { MatchStatus } from '../match/match.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { getIo } from '../../sockets/socket.js';
import { logger } from '../../config/logger.js';

// Convert Judge0 status IDs to our SubmissionVerdict
function getVerdictFromJudge0Status(statusId: number): SubmissionVerdict {
  switch (statusId) {
    case 3:
      return SubmissionVerdict.ACCEPTED;
    case 4:
      return SubmissionVerdict.WRONG_ANSWER;
    case 5:
      return SubmissionVerdict.TIME_LIMIT_EXCEEDED;
    case 6:
      return SubmissionVerdict.COMPILATION_ERROR;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return SubmissionVerdict.RUNTIME_ERROR;
    default:
      return SubmissionVerdict.RUNTIME_ERROR;
  }
}

export class SubmissionService {
  /**
   * Submit code for execution, poll for results, and update database.
   */
  async submitCode(
    userId: string,
    matchId: string,
    language: string,
    sourceCode: string
  ): Promise<ISubmissionDocument> {
    // 1. Fetch match and validate existence
    const match = await matchRepository.findById(matchId);
    if (!match) {
      throw new ApiError(404, 'Match not found');
    }

    // 2. Validate match is in progress
    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new ApiError(400, 'Cannot submit code: Match is not in progress');
    }

    // 3. Verify user belongs to the match
    const userObjectIdStr = userId.toString();
    const isParticipant = match.players.some(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userObjectIdStr : p.userId.toString() === userObjectIdStr
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Forbidden: You are not a participant in this match');
    }

    // 4. Validate that the match timer hasn't expired
    const now = new Date();
    const elapsedSeconds = (now.getTime() - match.startedAt.getTime()) / 1000;
    if (match.duration && elapsedSeconds > match.duration) {
      throw new ApiError(400, 'Cannot submit code: Match time has expired');
    }

    // 5. Determine the next submission number
    const latestNum = await submissionRepository.getLatestSubmissionNumber(matchId, userId);
    const submissionNumber = latestNum + 1;

    // 6. Create initial Pending/Queued submission record
    const submission = await submissionRepository.create({
      matchId: match._id as any,
      userId: userId as any,
      submissionNumber,
      language,
      sourceCode,
      verdict: SubmissionVerdict.QUEUED,
      executionTime: 0,
      memoryUsed: 0,
      passedTestCases: 0,
      totalTestCases: 0,
      submittedAt: now,
    });

    const roomCode = (match.roomId as any)?.roomCode;
    const roomChannel = `room:${roomCode}`;

    // 7. Emit submission:queued immediately
    try {
      const io = getIo();
      io.to(roomChannel).emit('submission:queued', {
        submissionId: submission._id.toString(),
        userId,
        submissionNumber,
      });
      logger.info(`Socket emitted submission:queued for submission ${submission._id}`);
    } catch (socketError) {
      logger.error(socketError, 'Failed to emit submission:queued');
    }

    // 8. Retrieve problem details with hidden test cases
    const problemSlug = (match.problemId as any)?.slug;
    if (!problemSlug) {
      throw new ApiError(500, 'Problem metadata missing from match details');
    }
    const problem = await problemRepository.findBySlug(problemSlug, true);
    if (!problem) {
      throw new ApiError(404, 'Problem details not found');
    }

    const testCases = problem.hiddenTestCases || [];
    const totalTestCases = testCases.length || 1; // Fallback to 1 if no test cases configured

    // 9. Emit submission:running as execution begins
    try {
      const io = getIo();
      io.to(roomChannel).emit('submission:running', {
        submissionId: submission._id.toString(),
        userId,
        submissionNumber,
      });
    } catch (socketError) {
      logger.error(socketError, 'Failed to emit submission:running');
    }

    // 10. Run code against test cases in Judge0
    let verdict = SubmissionVerdict.QUEUED;
    let maxTime = 0; // in ms
    let maxMemory = 0; // in MB
    let passedTestCases = 0;
    let stdout = '';
    let stderr = '';
    let compileOutput = '';

    try {
      const targetLangId = getJudge0LanguageId(language);

      // Execute all test cases in parallel
      const results = await Promise.all(
        (testCases.length > 0 ? testCases : [{ input: '', output: '' }]).map(async (tc) => {
          const token = await judge0Service.createSubmission({
            sourceCode,
            languageId: targetLangId,
            stdin: tc.input,
            expectedOutput: tc.output,
            cpuTimeLimit: problem.timeLimit, // in seconds
            memoryLimit: problem.memoryLimit * 1024, // problem memory is in MB, convert to KB for Judge0
          });
          return judge0Service.waitForResult(token);
        })
      );

      // Analyze test cases results
      let firstFailedResult: any = null;
      let allPassed = true;

      for (const res of results) {
        // Collect metrics
        const timeMs = (res.time || 0) * 1000;
        const memoryMb = (res.memory || 0) / 1024;
        if (timeMs > maxTime) maxTime = timeMs;
        if (memoryMb > maxMemory) maxMemory = memoryMb;

        if (res.status.id === 3) {
          passedTestCases++;
        } else {
          allPassed = false;
          if (!firstFailedResult) {
            firstFailedResult = res;
          }
        }
      }

      if (allPassed) {
        verdict = SubmissionVerdict.ACCEPTED;
        const representativeResult = results[0];
        stdout = representativeResult?.stdout || '';
        stderr = representativeResult?.stderr || '';
        compileOutput = representativeResult?.compile_output || '';
      } else {
        verdict = getVerdictFromJudge0Status(firstFailedResult.status.id);
        stdout = firstFailedResult.stdout || '';
        stderr = firstFailedResult.stderr || '';
        compileOutput = firstFailedResult.compile_output || '';
      }
    } catch (judgeError: any) {
      logger.error(judgeError, `Judge0 execution failed for submission ${submission._id}`);
      verdict = SubmissionVerdict.RUNTIME_ERROR;
      stderr = judgeError.message || 'Judge0 execution error occurred';
    }

    // 11. Update submission record in database via repository
    const updatedSubmission = await submissionRepository.update(submission._id.toString(), {
      verdict,
      executionTime: maxTime,
      memoryUsed: maxMemory,
      passedTestCases,
      totalTestCases,
      stdout,
      stderr,
      compileOutput,
      isFinalAccepted: verdict === SubmissionVerdict.ACCEPTED,
      judgedAt: new Date(),
    });

    if (!updatedSubmission) {
      throw new ApiError(500, 'Failed to update submission records');
    }

    // Update match winner & room status if submission is accepted
    if (verdict === SubmissionVerdict.ACCEPTED) {
      try {
        const endedAt = new Date();
        const duration = Math.round((endedAt.getTime() - match.startedAt.getTime()) / 1000);
        await matchRepository.updateWinner(matchId, userId, MatchStatus.COMPLETED, endedAt, duration);
        if (roomCode) {
          await roomRepository.update(roomCode, { status: 'FINISHED' as any });
        }
        logger.info(`Match ${matchId} completed. Winner: ${userId}`);
      } catch (completionError) {
        logger.error(completionError, `Failed to update match/room completion for match ${matchId}`);
      }
    }

    // 12. Emit submission:result
    try {
      const io = getIo();
      io.to(roomChannel).emit('submission:result', {
        submissionId: updatedSubmission._id.toString(),
        userId,
        verdict,
        executionTime: maxTime,
        memory: maxMemory,
        submissionNumber,
      });
      logger.info(`Socket emitted submission:result for submission ${updatedSubmission._id} - Verdict: ${verdict}`);
    } catch (socketError) {
      logger.error(socketError, 'Failed to emit submission:result');
    }

    return updatedSubmission;
  }

  /**
   * Retrieve details of a specific submission.
   */
  async getSubmission(userId: string, submissionId: string): Promise<ISubmissionDocument> {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    // Authorize: user must belong to the associated match
    const match = await matchRepository.findById(submission.matchId.toString());
    if (!match) {
      throw new ApiError(404, 'Match associated with this submission was not found');
    }

    const isParticipant = match.players.some(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userId.toString() : p.userId.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Forbidden: You are not authorized to view this submission');
    }

    return submission;
  }

  /**
   * Retrieve all submissions for a match, ordered by submission number.
   */
  async getMatchSubmissions(userId: string, matchId: string): Promise<ISubmissionDocument[]> {
    const match = await matchRepository.findById(matchId);
    if (!match) {
      throw new ApiError(404, 'Match not found');
    }

    // Authorize: user must belong to the match
    const isParticipant = match.players.some(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userId.toString() : p.userId.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Forbidden: You are not a participant in this match');
    }

    return submissionRepository.findByMatch(matchId);
  }

  /**
   * Run code with custom input without saving a persistent submission record.
   */
  async runCode(
    userId: string,
    matchId: string,
    language: string,
    sourceCode: string,
    customInput?: string
  ): Promise<{
    stdout: string | null;
    stderr: string | null;
    compileOutput: string | null;
    time: number | null; // in ms
    memory: number | null; // in MB
    status: {
      id: number;
      description: string;
    };
  }> {
    // 1. Fetch match and validate existence
    const match = await matchRepository.findById(matchId);
    if (!match) {
      throw new ApiError(404, 'Match not found');
    }

    // 2. Validate match is in progress
    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new ApiError(400, 'Cannot run code: Match is not in progress');
    }

    // 3. Verify user belongs to the match
    const userObjectIdStr = userId.toString();
    const isParticipant = match.players.some(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userObjectIdStr : p.userId.toString() === userObjectIdStr
    );
    if (!isParticipant) {
      throw new ApiError(403, 'Forbidden: You are not a participant in this match');
    }

    // 4. Retrieve problem details for limits
    const problemSlug = (match.problemId as any)?.slug;
    if (!problemSlug) {
      throw new ApiError(500, 'Problem metadata missing from match details');
    }
    const problem = await problemRepository.findBySlug(problemSlug, false);
    if (!problem) {
      throw new ApiError(404, 'Problem details not found');
    }

    // 5. Submit to Judge0
    const targetLangId = getJudge0LanguageId(language);
    const token = await judge0Service.createSubmission({
      sourceCode,
      languageId: targetLangId,
      stdin: customInput || '',
      cpuTimeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit * 1024,
    });

    const result = await judge0Service.waitForResult(token);

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      time: result.time ? result.time * 1000 : null, // convert to ms
      memory: result.memory ? result.memory / 1024 : null, // convert to MB
      status: result.status,
    };
  }
}

export const submissionService = new SubmissionService();
export default submissionService;
