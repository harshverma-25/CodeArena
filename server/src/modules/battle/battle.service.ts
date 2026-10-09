import { battleRepository, BattleRepository } from './battle.repository.js';
import { BattleModel } from './battle.model.js';
import { questionRepository, QuestionRepository } from '../question/question.repository.js';
import { questionService } from '../question/question.service.js';
import { roomRepository } from '../room/room.repository.js';
import { RoomStatus } from '../room/room.types.js';
import {
  IBattleDocument,
  BattleStatus,
  IBattleInitPayload,
  IBattleNextQuestionPayload,
  IBattleOpponentProgressPayload,
  IBattleResultsPayload,
  IBattleRevealPayload,
  IBattleRankedPlayer,
  IBattleRoundSubmission,
} from './battle.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { logger } from '../../config/logger.js';
import { Server } from 'socket.io';
import { getIo } from '../../sockets/socket.js';
import { formatRoomSocketPayload } from '../../sockets/room.socket.js';
import { userRepository } from '../user/user.repository.js';
import { getCategoryTimeLimit } from '../../shared/config/quiz-config.js';

export class BattleService {
  private sweeperTimer: NodeJS.Timeout | null = null;

  constructor(
    private repository: BattleRepository = battleRepository,
    private qRepository: QuestionRepository = questionRepository
  ) {}

  /**
   * Start the background sweeper to process expired question deadlines and reveals.
   */
  public startSweeper(io?: Server) {
    if (this.sweeperTimer) return;
    this.sweeperTimer = setInterval(async () => {
      try {
        await this.sweepActiveBattles(io);
      } catch (err) {
        logger.error(err, 'Error running battle sweeper');
      }
    }, 1000);

    if (this.sweeperTimer.unref) {
      this.sweeperTimer.unref();
    }
  }

  /**
   * Stop the background sweeper on graceful shutdown.
   */
  public stopSweeper() {
    if (this.sweeperTimer) {
      clearInterval(this.sweeperTimer);
      this.sweeperTimer = null;
    }
  }

  /**
   * Periodically check for expired rounds and advance them.
   */
  public async sweepActiveBattles(ioParam?: Server) {
    let io = ioParam;
    if (!io) {
      try {
        io = getIo();
      } catch {
        // Socket.IO not initialized
      }
    }

    const now = new Date();
    const expiredBattles = await this.repository.findExpiredRounds(now);
    for (const battle of expiredBattles) {
      try {
        if (!battle.currentRound) continue;
        if (battle.currentRound.status === 'QUESTION' && battle.currentRound.deadline <= now) {
          await this.executeRoundReveal(battle._id.toString(), battle.roomCode, io);
        } else if (
          battle.currentRound.status === 'REVEAL' &&
          battle.currentRound.revealExpiresAt &&
          battle.currentRound.revealExpiresAt <= now
        ) {
          await this.advanceToNextRound(battle._id.toString(), battle.roomCode, io);
        }
      } catch (err) {
        logger.error(err, `Error processing expired battle ${battle._id} in sweeper`);
      }
    }
  }

  /**
   * Check if a reconnecting battle has expired and catch it up if needed.
   */
  public async checkAndCatchUpBattle(battleId: string, roomCode: string, io?: Server) {
    const battle = await this.repository.findById(battleId);
    if (!battle || battle.status !== BattleStatus.IN_PROGRESS || !battle.currentRound) {
      return;
    }

    const now = new Date();
    if (battle.currentRound.status === 'QUESTION' && now.getTime() >= battle.currentRound.deadline.getTime()) {
      await this.executeRoundReveal(battleId, roomCode, io);
      const rechecked = await this.repository.findById(battleId);
      if (
        rechecked &&
        rechecked.currentRound?.status === 'REVEAL' &&
        rechecked.currentRound.revealExpiresAt &&
        now.getTime() >= rechecked.currentRound.revealExpiresAt.getTime()
      ) {
        await this.advanceToNextRound(battleId, roomCode, io);
      }
    } else if (
      battle.currentRound.status === 'REVEAL' &&
      battle.currentRound.revealExpiresAt &&
      now.getTime() >= battle.currentRound.revealExpiresAt.getTime()
    ) {
      await this.advanceToNextRound(battleId, roomCode, io);
    }
  }

  /**
   * Synchronize solo round 0 start time upon client socket connect.
   */
  public async synchronizeSoloRoundStart(battleId: string): Promise<void> {
    const battle = await this.repository.findById(battleId);
    if (
      battle &&
      battle.players.length === 1 &&
      battle.currentRound &&
      battle.currentRound.roundIndex === 0 &&
      battle.currentRound.submissions.length === 0 &&
      battle.currentRound.status === 'QUESTION'
    ) {
      const now = new Date();
      const freshDeadline = new Date(now.getTime() + battle.timePerQuestion * 1000);
      await this.repository.updateSoloRoundStartTime(battleId, now, freshDeadline);
    }
  }

  /**
   * Clean up or recover legacy in-progress battles left behind without currentRound.
   */
  public async recoverLegacyInProgressBattles(): Promise<void> {
    const legacyBattles = await BattleModel.find({
      status: BattleStatus.IN_PROGRESS,
      currentRound: null,
    });

    const now = Date.now();
    for (const battle of legacyBattles) {
      const maxDurationMs = (battle.questionCount * battle.timePerQuestion + 120) * 1000;
      const battleAge = now - new Date(battle.startedAt).getTime();
      if (battleAge > maxDurationMs) {
        logger.info(`Cleaning up abandoned legacy battle ${battle._id} (${battle.roomCode})`);
        battle.status = BattleStatus.CANCELLED;
        battle.endedAt = new Date();
        await battle.save();
        await roomRepository.update(battle.roomCode, { status: RoomStatus.FINISHED });
      } else {
        const initialQId = battle.players[0]?.assignedQuestionIds[0];
        if (initialQId) {
          battle.currentRound = {
            roundIndex: 0,
            questionId: initialQId,
            startedAt: new Date(),
            deadline: new Date(Date.now() + battle.timePerQuestion * 1000),
            status: 'QUESTION',
            revealExpiresAt: null,
            submissions: [],
          };
          await battle.save();
        }
      }
    }
  }

  /**
   * Initiate a new 1v1 MCQ Battle for a room.
   */
  async startBattle(userId: string, roomCode: string): Promise<IBattleDocument> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // 1. Host validation
    const hostIdStr = room.hostId && (room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString();
    if (hostIdStr !== userId) {
      throw new ApiError(403, 'Only the room host can start the battle');
    }

    // 2. Room status validation
    if (room.status === RoomStatus.IN_PROGRESS) {
      throw new ApiError(400, 'Battle has already started');
    }
    if (room.status === RoomStatus.FINISHED || room.status === RoomStatus.CANCELLED) {
      throw new ApiError(400, 'Cannot start battle in a completed or cancelled room');
    }

    // 3. Player quantity validation (1 to 4 players)
    if (room.players.length < 1 || room.players.length > (room.maxPlayers || 4)) {
      throw new ApiError(400, 'Room must contain between 1 and 4 players');
    }

    // 4. Ready state validation: non-host players must be ready, or host starting
    const allReady = room.players.every((p) => {
      const pId = p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
      return p.isReady || pId === userId;
    });
    if (!allReady) {
      throw new ApiError(400, 'All players must be ready to start the battle');
    }

    // 5. Select questions for the battle (all players play the same quiz)
    let targetDifficulty = room.settings.difficulty ? room.settings.difficulty.toLowerCase() : 'easy';
    if (targetDifficulty === 'random') {
      targetDifficulty = 'easy';
    }

    const questionCount = (room.settings as any).questionCount || 10;
    const totalNeeded = questionCount;

    const filterObj = {
      categoryId: room.settings.categoryId,
      subjectId: room.settings.subjectId,
      isMixedCategory: room.settings.isMixedCategory,
      topic: room.settings.topic,
      difficulty: targetDifficulty,
    };

    // Sample distinct random published questions using Category / Subject / Mixed filter
    let sampledQuestions = await this.qRepository.sampleRandomPublished(filterObj, targetDifficulty, totalNeeded);

    // Fallback: match category/subject with any difficulty if not enough questions
    if (sampledQuestions.length < totalNeeded) {
      const existingIds = sampledQuestions.map((q) => q.questionId);
      const remaining = totalNeeded - sampledQuestions.length;
      const extra = await this.qRepository.sampleRandomPublished({ ...filterObj, difficulty: undefined }, undefined, remaining, existingIds);
      sampledQuestions = [...sampledQuestions, ...extra];
    }

    // Ensure distinct questions by questionId
    const uniqueMap = new Map<string, any>();
    for (const q of sampledQuestions) {
      if (!uniqueMap.has(q.questionId)) {
        uniqueMap.set(q.questionId, q);
      }
    }
    sampledQuestions = Array.from(uniqueMap.values());

    if (sampledQuestions.length < totalNeeded) {
      const targetLabel = room.settings.subjectId || room.settings.categoryId || 'This subject';
      throw new ApiError(
        400,
        `Not enough published questions: ${targetLabel} has only ${sampledQuestions.length} question${sampledQuestions.length === 1 ? '' : 's'}. Choose a smaller quiz or another subject.`
      );
    }

    const targetTopic = room.settings.topic || room.settings.subjectId || room.settings.categoryId || 'General';
    const assignedQuestionIds = sampledQuestions.slice(0, totalNeeded).map((q) => q.questionId);

    const timePerQuestion = (room.settings as any).timeLimit || getCategoryTimeLimit(room.settings.categoryId);
    const initialDeadline = new Date(Date.now() + timePerQuestion * 1000);

    const battlePlayers = room.players.map((p) => {
      const pUserId = p.userId && (p.userId as any)._id
        ? (p.userId as any)._id
        : p.userId;
      return {
        userId: pUserId,
        assignedQuestionIds,
        currentQuestionIndex: 0,
        questionDeadline: initialDeadline,
        answers: [],
        score: 0,
        status: 'IN_PROGRESS',
      };
    });

    // 6. Create Battle document
    const battle = await this.repository.create({
      roomId: room._id as any,
      roomCode: code,
      topic: targetTopic,
      difficulty: targetDifficulty,
      questionCount: totalNeeded,
      timePerQuestion,
      players: battlePlayers as any,
      status: BattleStatus.IN_PROGRESS,
      startedAt: new Date(),
      currentRound: {
        roundIndex: 0,
        questionId: assignedQuestionIds[0],
        startedAt: new Date(),
        deadline: initialDeadline,
        status: 'QUESTION',
        revealExpiresAt: null,
        submissions: [],
      },
    });

    // 7. Update Room Status to IN_PROGRESS
    await roomRepository.update(code, {
      status: RoomStatus.IN_PROGRESS,
      matchId: battle._id as any,
    });

    return battle;
  }

  /**
   * Broadcast battle start events across room sockets.
   */
  async broadcastBattleStart(battle: IBattleDocument, ioInstance?: Server): Promise<void> {
    let io = ioInstance;
    if (!io) {
      try {
        io = getIo();
      } catch {
        return;
      }
    }
    const code = battle.roomCode;
    const roomChannel = `room:${code}`;

    // Update room state for sockets
    const updatedRoom = await roomRepository.findByRoomCode(code);
    if (updatedRoom) {
      io.to(roomChannel).emit('room:update', formatRoomSocketPayload(updatedRoom));
    }

    // Emit battle:init to sockets
    const sockets = await io.in(roomChannel).fetchSockets();
    for (const playerSocket of sockets) {
      const pUserId = playerSocket.data.user?._id?.toString();
      if (pUserId) {
        const initPayload = await this.getBattleInitPayload(battle, pUserId);
        if (initPayload) {
          playerSocket.emit('battle:init', initPayload);
        }
      }
    }
  }

  /**
   * Retrieve active battle by roomCode.
   */
  async getActiveBattleByRoomCode(roomCode: string): Promise<IBattleDocument | null> {
    return this.repository.findActiveByRoomCode(roomCode);
  }

  /**
   * Retrieve battle by ID.
   */
  async getBattleById(battleId: string): Promise<IBattleDocument | null> {
    return this.repository.findById(battleId);
  }

  /**
   * Construct battle:init payload tailored for a specific player (STRICT ANTI-CHEAT: only player's own current question).
   */
  async getBattleInitPayload(battle: IBattleDocument, userId: string): Promise<IBattleInitPayload | null> {
    const player = battle.players.find((p) =>
      (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );
    if (!player) return null;

    const currentRound = battle.currentRound;
    const currentRoundIndex = currentRound ? currentRound.roundIndex : player.currentQuestionIndex;
    const currentQId = currentRound
      ? currentRound.questionId
      : player.assignedQuestionIds[currentRoundIndex];
    if (!currentQId) return null;

    const questionDoc = await questionService.getQuestionByQuestionId(currentQId);

    const roundStartedAt = currentRound
      ? currentRound.startedAt.getTime()
      : (battle.startedAt ? new Date(battle.startedAt).getTime() : Date.now());
    const deadline = currentRound
      ? currentRound.deadline
      : (player.questionDeadline || new Date(Date.now() + battle.timePerQuestion * 1000));

    const hostPlayer = battle.players.find((p: any) => p.isHost);
    const hostId = hostPlayer
      ? (hostPlayer.userId._id ? hostPlayer.userId._id.toString() : hostPlayer.userId.toString())
      : undefined;

    const submittedUserIds = new Set(currentRound?.submissions?.map((s) => s.userId) || []);

    const mappedPlayers = battle.players.map((p: any) => {
      const pUserId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
      const hasAnswered = currentRound
        ? submittedUserIds.has(pUserId)
        : (p.answers && p.answers.length > p.currentQuestionIndex);

      return {
        userId: pUserId,
        username: p.userId.username || '',
        displayName: p.userId.displayName || '',
        avatar: p.userId.avatar || '',
        isHost: Boolean(p.isHost),
        currentQuestionIndex: p.currentQuestionIndex,
        score: p.score,
        isCompleted: p.status === 'COMPLETED',
        hasAnswered,
      };
    });

    return {
      battleId: battle._id.toString(),
      roomCode: battle.roomCode,
      hostId,
      topic: battle.topic,
      difficulty: battle.difficulty,
      questionCount: battle.questionCount,
      timePerQuestion: battle.timePerQuestion,
      currentQuestionIndex: currentRoundIndex,
      roundStartedAt,
      questionDeadline: deadline,
      currentQuestion: questionDoc,
      players: mappedPlayers,
    };
  }

  /**
   * Submit an answer for the current question with server-authoritative scoring & timing.
   */
  async submitAnswer(
    userId: string,
    roomCode: string,
    questionId: string,
    selectedOption: number,
    io?: Server
  ): Promise<{
    battle: IBattleDocument;
    potentialScore: number;
    timeTakenMs: number;
    isCorrect: boolean;
  }> {
    const battle = await this.repository.findActiveByRoomCode(roomCode);
    if (!battle) {
      throw new ApiError(404, 'Active battle not found for this room');
    }

    const playerIndex = battle.players.findIndex((p) =>
      (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );

    if (playerIndex === -1) {
      throw new ApiError(403, 'Player is not part of this battle');
    }

    const player = battle.players[playerIndex];

    if (player.status === 'COMPLETED') {
      throw new ApiError(400, 'Player has already completed all questions');
    }

    if (!battle.currentRound) {
      throw new ApiError(400, 'No active round found for this battle');
    }

    if (battle.currentRound.status === 'REVEAL') {
      throw new ApiError(400, 'Question round has already ended. Waiting for next round.');
    }

    const now = new Date();
    if (now.getTime() > battle.currentRound.deadline.getTime()) {
      if (io) {
        await this.executeRoundReveal(battle._id.toString(), roomCode, io);
      }
      throw new ApiError(400, 'Question round has expired.');
    }

    const hasSubmitted = battle.currentRound.submissions.some((s) => s.userId === userId);
    if (hasSubmitted) {
      throw new ApiError(400, 'You have already submitted an answer for this question.');
    }

    if (questionId !== battle.currentRound.questionId) {
      throw new ApiError(400, 'Invalid question submission: Question ID does not match current turn');
    }

    // Dynamic Server-Authoritative Scoring Formula:
    // Starts at 1000 points. Decreases by 30 pts/sec.
    // 0s: 1000 pts. 2s: ~940 pts. 5s: ~850 pts. Minimum floor: 100 pts.
    const rawElapsedMs = now.getTime() - battle.currentRound.startedAt.getTime();
    // Guard against clock skew or negative elapsed time, bounded to round duration
    const elapsedMs = Math.max(0, Math.min(rawElapsedMs, battle.timePerQuestion * 1000));
    const elapsedSec = elapsedMs / 1000;
    const potentialScore = Math.max(100, Math.min(1000, Math.round(1000 - elapsedSec * 30)));

    // Validate correct answer on server
    const questionDoc = await this.qRepository.findByQuestionId(questionId);
    if (!questionDoc) {
      throw new ApiError(404, 'Submitted question not found in database');
    }

    const isCorrect = (selectedOption >= 0 && selectedOption <= 3)
      ? questionDoc.correctAnswer === selectedOption
      : false;

    const submission: IBattleRoundSubmission = {
      userId,
      selectedOption,
      potentialScore,
      timeTakenMs: elapsedMs,
      isCorrect,
      submittedAt: now,
    };

    const updatedBattle = await this.repository.recordRoundSubmission(
      battle._id.toString(),
      battle.currentRound.roundIndex,
      submission
    );

    if (!updatedBattle || !updatedBattle.currentRound) {
      throw new ApiError(400, 'Unable to submit answer: round has ended or answer was already recorded.');
    }

    const roomChannel = `room:${roomCode}`;

    if (io) {
      // 1. Notify room that this player has submitted their answer (without revealing correct option)
      io.to(roomChannel).emit('battle:player_submitted', {
        userId,
        roundIndex: updatedBattle.currentRound.roundIndex,
        hasAnswered: true,
        timeTakenMs: elapsedMs,
      });

      // 2. Check if all active/connected players in the battle have answered
      const connectedSockets = await io.in(roomChannel).fetchSockets();
      const connectedUserIds = new Set(
        connectedSockets
          .map((s) => s.data.user?._id?.toString())
          .filter(Boolean)
      );

      const activePlayers = updatedBattle.players.filter((p: any) => {
        const pUId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        return connectedUserIds.size === 0 || connectedUserIds.has(pUId);
      });

      const submittedUserIds = new Set(updatedBattle.currentRound.submissions.map((s) => s.userId));

      const allAnswered = activePlayers.length > 0 && activePlayers.every((p: any) => {
        const pUId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        return submittedUserIds.has(pUId);
      });

      if (allAnswered) {
        // Synchronized reveal immediately
        await this.executeRoundReveal(updatedBattle._id.toString(), roomCode, io);
      }
    }

    return {
      battle: updatedBattle,
      potentialScore,
      timeTakenMs: elapsedMs,
      isCorrect,
    };
  }

  /**
   * Execute synchronized round reveal across all players in the room.
   */
  async executeRoundReveal(battleId: string, roomCode: string, io?: Server) {
    const revealExpiresAt = new Date(Date.now() + 5000);

    const battle = await this.repository.transitionRoundToReveal(battleId, revealExpiresAt);
    if (!battle || !battle.currentRound) return;

    const currentRound = battle.currentRound;
    const submissionsMap = new Map(currentRound.submissions.map((s) => [s.userId, s]));

    // Apply scores and record answers for all players
    for (const p of battle.players) {
      const pUId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
      const sub = submissionsMap.get(pUId);

      if (sub) {
        if (sub.isCorrect) {
          p.score += sub.potentialScore;
        }
        p.answers.push({
          questionId: currentRound.questionId,
          selectedOption: sub.selectedOption,
          isCorrect: sub.isCorrect,
          submittedAt: sub.submittedAt,
          timeTakenMs: sub.timeTakenMs,
        });
      } else {
        // Player did not answer in time (timed out)
        p.answers.push({
          questionId: currentRound.questionId,
          selectedOption: -1,
          isCorrect: false,
          submittedAt: new Date(),
          timeTakenMs: battle.timePerQuestion * 1000,
        });
      }
    }

    await this.repository.save(battle);

    // Fetch original question for correctAnswer and explanation
    const questionDoc = await this.qRepository.findByQuestionId(currentRound.questionId);

    const correctCount = currentRound.submissions.filter((s) => s.isCorrect).length;
    const accuracyPct = battle.players.length > 0
      ? Math.round((correctCount / battle.players.length) * 100)
      : 0;

    const isLast = currentRound.roundIndex >= battle.questionCount - 1;
    const roomChannel = `room:${roomCode}`;

    const revealPayload: IBattleRevealPayload = {
      roundIndex: currentRound.roundIndex,
      questionId: currentRound.questionId,
      correctAnswer: questionDoc ? questionDoc.correctAnswer : 0,
      explanation: questionDoc ? questionDoc.explanation : '',
      accuracyPct,
      correctCount,
      totalPlayers: battle.players.length,
      revealDurationSec: 5,
      players: battle.players.map((p: any) => {
        const uId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        const sub = submissionsMap.get(uId);
        return {
          userId: uId,
          username: p.userId.username || '',
          displayName: p.userId.displayName || '',
          avatar: p.userId.avatar || '',
          selectedOption: sub ? sub.selectedOption : -1,
          isCorrect: sub ? sub.isCorrect : false,
          earnedScore: sub && sub.isCorrect ? sub.potentialScore : 0,
          totalScore: p.score,
          timeTakenMs: sub ? sub.timeTakenMs : battle.timePerQuestion * 1000,
        };
      }),
      isLastQuestion: isLast,
    };

    if (io) {
      io.to(roomChannel).emit('battle:reveal', revealPayload);
    }
  }

  /**
   * Advance entire room synchronously to the next question.
   */
  async advanceToNextRound(battleId: string, roomCode: string, io?: Server) {
    const battle = await this.repository.findById(battleId);
    if (!battle || battle.status !== BattleStatus.IN_PROGRESS || !battle.currentRound) return;

    const currentRoundIndex = battle.currentRound.roundIndex;
    const nextRoundIndex = currentRoundIndex + 1;
    const roomChannel = `room:${roomCode}`;

    if (nextRoundIndex >= battle.questionCount) {
      const locked = await BattleModel.findOneAndUpdate(
        {
          _id: battleId,
          status: BattleStatus.IN_PROGRESS,
          'currentRound.status': 'REVEAL',
          'currentRound.roundIndex': currentRoundIndex,
        },
        {
          $set: {
            'currentRound.status': 'COMPLETED',
          },
        },
        { new: true }
      ).populate('players.userId', 'username displayName avatar');

      if (!locked) return;

      const results = await this.finalizeBattle(locked);
      if (io) {
        io.to(roomChannel).emit('battle:completed', results);
      }
      return;
    }

    const nextQId = battle.players[0].assignedQuestionIds[nextRoundIndex];
    const now = new Date();
    const nextDeadline = new Date(now.getTime() + battle.timePerQuestion * 1000);

    const updatedBattle = await BattleModel.findOneAndUpdate(
      {
        _id: battleId,
        status: BattleStatus.IN_PROGRESS,
        'currentRound.status': 'REVEAL',
        'currentRound.roundIndex': currentRoundIndex,
      },
      {
        $set: {
          'currentRound.roundIndex': nextRoundIndex,
          'currentRound.questionId': nextQId,
          'currentRound.startedAt': now,
          'currentRound.deadline': nextDeadline,
          'currentRound.status': 'QUESTION',
          'currentRound.revealExpiresAt': null,
          'currentRound.submissions': [],
          'players.$[].currentQuestionIndex': nextRoundIndex,
          'players.$[].questionDeadline': nextDeadline,
        },
      },
      { new: true }
    ).populate('players.userId', 'username displayName avatar');

    if (!updatedBattle) return;

    const nextQDoc = await questionService.getQuestionByQuestionId(nextQId);

    const nextPayload: IBattleNextQuestionPayload = {
      currentQuestionIndex: nextRoundIndex,
      totalQuestions: battle.questionCount,
      roundStartedAt: now.getTime(),
      questionDeadline: nextDeadline,
      timePerQuestion: battle.timePerQuestion,
      question: nextQDoc,
      completed: false,
    };

    if (io) {
      io.to(roomChannel).emit('battle:next_question', nextPayload);
    }
  }

  /**
   * Finalize battle, calculate scores, determine winner/draw, and format results.
   * Atomically and idempotently transitions the battle to COMPLETED.
   */
  async finalizeBattle(battle: IBattleDocument): Promise<IBattleResultsPayload> {
    let winnerId: any = null;
    let isDraw = false;

    if (battle.players.length === 1) {
      winnerId = battle.players[0].userId;
      isDraw = false;
    } else {
      const maxScore = Math.max(...battle.players.map((p) => p.score));
      const topPlayers = battle.players.filter((p) => p.score === maxScore);
      if (topPlayers.length === 1) {
        winnerId = topPlayers[0].userId;
        isDraw = false;
      } else {
        winnerId = null;
        isDraw = true;
      }
    }

    const endedAt = new Date();

    // 1. Truly atomic conditional transition:
    // Only the single execution that transitions battle status away from non-COMPLETED
    // acquires the exclusive right to finalize and update persistent user statistics.
    const transitionedBattle = await this.repository.transitionToCompleted(battle._id, {
      winnerId,
      isDraw,
      endedAt,
      players: battle.players,
    });

    if (!transitionedBattle) {
      // Race condition lost: Another concurrent handler already finalized this battle.
      // Re-fetch existing battle to return consistent formatted results without double-counting stats.
      const existing = await this.repository.findById(battle._id.toString());
      return this.formatResultsPayload(existing || battle);
    }

    // Update Room status to FINISHED
    await roomRepository.update(battle.roomCode, {
      status: RoomStatus.FINISHED,
    });

    // Update all players' persistent statistics atomically
    try {
      const winnerIdStr = winnerId
        ? ((winnerId as any)._id ? (winnerId as any)._id.toString() : winnerId.toString())
        : null;

      const maxScore = Math.max(...battle.players.map((p) => p.score));
      const topPlayers = battle.players.filter((p) => p.score === maxScore);
      const isMultiWayTieForFirst = topPlayers.length > 1;

      await Promise.all(
        battle.players.map((p) => {
          const pUId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
          const pCorrect = p.answers ? p.answers.filter((a) => a.isCorrect).length : 0;
          const pQuestions = battle.questionCount || p.assignedQuestionIds?.length || 0;

          // Single winner: only winner gets win; all others get loss.
          // Multi-way tie for 1st place: only players specifically tied for 1st get isDraw; lower-scoring players get isLoss!
          const isPlayerWin = !isMultiWayTieForFirst && winnerIdStr === pUId;
          const isPlayerDraw = isMultiWayTieForFirst && p.score === maxScore;
          const isPlayerLoss = !isPlayerWin && !isPlayerDraw;

          return userRepository.recordBattleStatsById(p.userId, {
            isWin: isPlayerWin,
            isLoss: isPlayerLoss,
            isDraw: isPlayerDraw,
            correctCount: pCorrect,
            questionCount: pQuestions,
          });
        })
      );
    } catch (err) {
      logger.error(err, 'Failed to update user model stats in finalizeBattle');
    }

    // Re-fetch populated battle for results formatting
    const populated = await this.repository.findById(battle._id.toString());
    const target = populated || transitionedBattle;

    return this.formatResultsPayload(target);
  }

  /**
   * Format battle results payload for post-game consumption.
   */
  public formatResultsPayload(battle: IBattleDocument): IBattleResultsPayload {
    const playersFormatted = battle.players.map((p: any) => {
      const uId = p.userId?._id ? p.userId._id.toString() : p.userId.toString();
      return {
        userId: uId,
        username: p.userId?.username || '',
        displayName: p.userId?.displayName || '',
        avatar: p.userId?.avatar || '',
        score: p.score,
        totalQuestions: battle.questionCount,
        answers: p.answers.map((a: any) => ({
          questionId: a.questionId,
          selectedOption: a.selectedOption,
          isCorrect: a.isCorrect,
          timeTakenMs: a.timeTakenMs,
        })),
      };
    });

    // Compute dynamic player rankings for 1..4 players
    const sortedPlayers = [...battle.players].sort((a: any, b: any) => b.score - a.score);

    const rankings: IBattleRankedPlayer[] = [];
    let currentRank = 1;

    for (let i = 0; i < sortedPlayers.length; i++) {
      const p: any = sortedPlayers[i];
      if (i > 0 && p.score < sortedPlayers[i - 1].score) {
        currentRank = i + 1;
      }

      const uId = p.userId?._id ? p.userId._id.toString() : p.userId.toString();
      const answers = p.answers || [];
      const correctAnswers = answers.filter((a: any) => a.isCorrect).length;
      const unanswered = answers.filter((a: any) => a.selectedOption === -1).length;
      const incorrectAnswers = answers.length - correctAnswers - unanswered;
      const totalQuestions = battle.questionCount || answers.length || 0;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      const totalTimeMs = answers.reduce((sum: number, a: any) => sum + (a.timeTakenMs || 0), 0);
      const averageResponseTime = answers.length > 0 ? Math.round(totalTimeMs / answers.length) : 0;

      rankings.push({
        userId: uId,
        username: p.userId?.username || '',
        displayName: p.userId?.displayName || '',
        avatar: p.userId?.avatar || '',
        totalScore: p.score,
        rank: currentRank,
        correctAnswers,
        incorrectAnswers,
        unanswered,
        accuracy,
        averageResponseTime,
      });
    }

    const winnerIdStr = battle.winnerId
      ? (battle.winnerId as any)._id
        ? (battle.winnerId as any)._id.toString()
        : battle.winnerId.toString()
      : null;

    return {
      battleId: battle._id.toString(),
      roomCode: battle.roomCode,
      topic: battle.topic,
      difficulty: battle.difficulty,
      status: battle.status,
      winnerId: winnerIdStr,
      isDraw: battle.isDraw,
      startedAt: battle.startedAt,
      endedAt: battle.endedAt || new Date(),
      players: playersFormatted,
      rankings,
    };
  }

  /**
   * Get reveal payload if battle is currently in reveal phase.
   */
  async getBattleRevealPayloadIfRevealed(battleId: string): Promise<IBattleRevealPayload | null> {
    const battle = await this.repository.findById(battleId);
    if (!battle || !battle.currentRound || battle.currentRound.status !== 'REVEAL') {
      return null;
    }

    const currentRound = battle.currentRound;
    const questionDoc = await this.qRepository.findByQuestionId(currentRound.questionId);
    const correctCount = currentRound.submissions.filter((s) => s.isCorrect).length;
    const accuracyPct = battle.players.length > 0
      ? Math.round((correctCount / battle.players.length) * 100)
      : 0;

    const isLast = currentRound.roundIndex >= battle.questionCount - 1;
    const submissionsMap = new Map(currentRound.submissions.map((s) => [s.userId, s]));

    return {
      roundIndex: currentRound.roundIndex,
      questionId: currentRound.questionId,
      correctAnswer: questionDoc ? questionDoc.correctAnswer : 0,
      explanation: questionDoc ? questionDoc.explanation : '',
      accuracyPct,
      correctCount,
      totalPlayers: battle.players.length,
      revealDurationSec: 5,
      players: battle.players.map((p: any) => {
        const uId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        const sub = submissionsMap.get(uId);
        return {
          userId: uId,
          username: p.userId?.username || '',
          displayName: p.userId?.displayName || '',
          avatar: p.userId?.avatar || '',
          selectedOption: sub ? sub.selectedOption : -1,
          isCorrect: sub ? sub.isCorrect : false,
          earnedScore: sub && sub.isCorrect ? sub.potentialScore : 0,
          totalScore: p.score,
          timeTakenMs: sub ? sub.timeTakenMs : battle.timePerQuestion * 1000,
        };
      }),
      isLastQuestion: isLast,
    };
  }

  /**
   * Garbage collection: Clean abandoned IN_PROGRESS battles older than cutoff date.
   * Default threshold: 2 hours (7,200,000 ms).
   */
  async cleanAbandonedBattles(staleThresholdMs: number = 2 * 60 * 60 * 1000): Promise<{ cancelledBattlesCount: number }> {
    const cutoff = new Date(Date.now() - staleThresholdMs);
    const abandonedBattles = await this.repository.findAbandonedBattles(cutoff);
    let cancelledBattlesCount = 0;

    for (const battle of abandonedBattles) {
      const updated = await this.repository.cancelAbandonedBattle(battle._id);
      if (updated) {
        cancelledBattlesCount++;
        await roomRepository.update(battle.roomCode, { status: RoomStatus.CANCELLED });
      }
    }

    if (cancelledBattlesCount > 0) {
      logger.info(`[GC] Cancelled ${cancelledBattlesCount} abandoned IN_PROGRESS battles older than ${cutoff.toISOString()}`);
    }

    return { cancelledBattlesCount };
  }
}

export const battleService = new BattleService();
export default battleService;
