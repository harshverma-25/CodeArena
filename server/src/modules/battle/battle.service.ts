import { battleRepository, BattleRepository } from './battle.repository.js';
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
} from './battle.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { logger } from '../../config/logger.js';
import { Server } from 'socket.io';
import { UserModel } from '../user/user.model.js';
import { BattleModel } from './battle.model.js';
import { userRepository } from '../user/user.repository.js';
import { getCategoryTimeLimit } from '../../shared/config/quiz-config.js';

export interface IActiveRoundSubmission {
  selectedOption: number;
  potentialScore: number;
  timeTakenMs: number;
  isCorrect: boolean;
  submittedAt: Date;
}

export interface IActiveRoundState {
  battleId: string;
  roomCode: string;
  roundIndex: number;
  questionId: string;
  startedAt: Date;
  deadline: Date;
  isRevealed: boolean;
  submissions: Map<string, IActiveRoundSubmission>;
}

export class BattleService {
  private activeTimers = new Map<string, NodeJS.Timeout>();
  private activeRounds = new Map<string, IActiveRoundState>();

  constructor(
    private repository: BattleRepository = battleRepository,
    private qRepository: QuestionRepository = questionRepository
  ) {}

  /**
   * Initialize in-memory round state for synchronized gameplay.
   */
  public initRoundState(
    battleId: string,
    roomCode: string,
    roundIndex: number,
    questionId: string,
    timePerQuestion: number,
    deadline: Date
  ) {
    this.activeRounds.set(battleId, {
      battleId,
      roomCode,
      roundIndex,
      questionId,
      startedAt: new Date(),
      deadline,
      isRevealed: false,
      submissions: new Map(),
    });
  }

  /**
   * Get active round state for a battle.
   */
  public getActiveRound(battleId: string): IActiveRoundState | undefined {
    return this.activeRounds.get(battleId);
  }

  /**
   * Set server deadline timer for the current synchronized round.
   */
  public setRoundTimeout(
    battleId: string,
    roundIndex: number,
    delayMs: number,
    io: Server,
    roomCode: string
  ) {
    const timerKey = `${battleId}:ROUND`;
    this.clearQuestionTimeout(battleId, 'ROUND');

    const timer = setTimeout(async () => {
      this.activeTimers.delete(timerKey);
      try {
        await this.executeRoundReveal(battleId, roomCode, io);
      } catch (err) {
        logger.error(err, `Error executing round reveal on timeout for battle ${battleId}`);
      }
    }, Math.max(delayMs, 100));

    this.activeTimers.set(timerKey, timer);
  }

  /**
   * Legacy compatibility: Set server deadline timer for a player's current question.
   */
  public setQuestionTimeout(
    battleId: string,
    _userId: string,
    expectedIndex: number,
    delayMs: number,
    io: Server,
    roomCode: string
  ) {
    // Synchronized round timer
    this.setRoundTimeout(battleId, expectedIndex, delayMs, io, roomCode);
  }

  /**
   * Clear active server timer for a player or round.
   */
  public clearQuestionTimeout(battleId: string, userIdOrKey: string) {
    const timerKey = `${battleId}:${userIdOrKey}`;
    const existing = this.activeTimers.get(timerKey);
    if (existing) {
      clearTimeout(existing);
      this.activeTimers.delete(timerKey);
    }
  }

  /**
   * Clear all active timers for a battle.
   */
  public clearAllBattleTimers(battleId: string, playerUserIds: string[]) {
    this.clearQuestionTimeout(battleId, 'ROUND');
    this.clearQuestionTimeout(battleId, 'REVEAL');
    for (const uId of playerUserIds) {
      this.clearQuestionTimeout(battleId, uId);
    }
    this.activeRounds.delete(battleId);
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
    });

    // 7. Update Room Status to IN_PROGRESS
    await roomRepository.update(code, {
      status: RoomStatus.IN_PROGRESS,
      matchId: battle._id as any,
    });

    this.initRoundState(battle._id.toString(), code, 0, assignedQuestionIds[0], timePerQuestion, initialDeadline);

    return battle;
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

    const currentQId = player.assignedQuestionIds[player.currentQuestionIndex];
    if (!currentQId) return null;

    const questionDoc = await questionService.getQuestionByQuestionId(currentQId);

    const activeRound = this.activeRounds.get(battle._id.toString());
    const roundStartedAt = activeRound
      ? activeRound.startedAt.getTime()
      : (battle.startedAt ? new Date(battle.startedAt).getTime() : Date.now());
    const deadline = activeRound
      ? activeRound.deadline
      : (player.questionDeadline || new Date(Date.now() + battle.timePerQuestion * 1000));

    const hostPlayer = battle.players.find((p: any) => p.isHost);
    const hostId = hostPlayer
      ? (hostPlayer.userId._id ? hostPlayer.userId._id.toString() : hostPlayer.userId.toString())
      : undefined;

    const mappedPlayers = battle.players.map((p: any) => {
      const pUserId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
      const hasAnswered = activeRound
        ? activeRound.submissions.has(pUserId)
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
      currentQuestionIndex: player.currentQuestionIndex,
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

    let activeRound = this.activeRounds.get(battle._id.toString());
    if (!activeRound) {
      const currentQId = player.assignedQuestionIds[player.currentQuestionIndex] || questionId;
      const initialDeadline = player.questionDeadline || new Date(Date.now() + battle.timePerQuestion * 1000);
      this.initRoundState(
        battle._id.toString(),
        roomCode,
        player.currentQuestionIndex,
        currentQId,
        battle.timePerQuestion,
        initialDeadline
      );
      activeRound = this.activeRounds.get(battle._id.toString())!;
    }

    if (activeRound.isRevealed) {
      throw new ApiError(400, 'Question round has already ended. Waiting for next round.');
    }

    if (activeRound.submissions.has(userId)) {
      throw new ApiError(400, 'You have already submitted an answer for this question.');
    }

    if (questionId !== activeRound.questionId) {
      throw new ApiError(400, 'Invalid question submission: Question ID does not match current turn');
    }

    // Dynamic Server-Authoritative Scoring Formula:
    // Starts at 1000 points. Decreases by 30 pts/sec.
    // 0s: 1000 pts. 2s: ~940 pts. 5s: ~850 pts. Minimum floor: 100 pts.
    const now = Date.now();
    const elapsedMs = Math.max(0, now - activeRound.startedAt.getTime());
    const elapsedSec = elapsedMs / 1000;
    const potentialScore = Math.max(100, Math.round(1000 - elapsedSec * 30));

    // Validate correct answer on server
    const questionDoc = await this.qRepository.findByQuestionId(questionId);
    if (!questionDoc) {
      throw new ApiError(404, 'Submitted question not found in database');
    }

    const isCorrect = (selectedOption >= 0 && selectedOption <= 3)
      ? questionDoc.correctAnswer === selectedOption
      : false;

    // Record submission in memory
    activeRound.submissions.set(userId, {
      selectedOption,
      potentialScore,
      timeTakenMs: elapsedMs,
      isCorrect,
      submittedAt: new Date(),
    });

    const roomChannel = `room:${roomCode}`;

    if (io) {
      // 1. Notify room that this player has submitted their answer (without revealing correct option)
      io.to(roomChannel).emit('battle:player_submitted', {
        userId,
        roundIndex: activeRound.roundIndex,
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

      const activePlayers = battle.players.filter((p: any) => {
        const pUId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        return connectedUserIds.size === 0 || connectedUserIds.has(pUId);
      });

      const allAnswered = activePlayers.length > 0 && activePlayers.every((p: any) => {
        const pUId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        return activeRound?.submissions.has(pUId);
      });

      if (allAnswered) {
        this.clearQuestionTimeout(battle._id.toString(), 'ROUND');
        // Synchronized reveal immediately
        await this.executeRoundReveal(battle._id.toString(), roomCode, io);
      }
    }

    return {
      battle,
      potentialScore,
      timeTakenMs: elapsedMs,
      isCorrect,
    };
  }

  /**
   * Execute synchronized round reveal across all players in the room.
   */
  async executeRoundReveal(battleId: string, roomCode: string, io: Server) {
    const activeRound = this.activeRounds.get(battleId);
    if (!activeRound || activeRound.isRevealed) return;

    activeRound.isRevealed = true;
    this.clearQuestionTimeout(battleId, 'ROUND');

    const battle = await this.repository.findById(battleId);
    if (!battle || battle.status !== BattleStatus.IN_PROGRESS) return;

    // Apply scores and record answers for all players
    for (const p of battle.players) {
      const pUId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
      const sub = activeRound.submissions.get(pUId);

      if (sub) {
        if (sub.isCorrect) {
          p.score += sub.potentialScore;
        }
        p.answers.push({
          questionId: activeRound.questionId,
          selectedOption: sub.selectedOption,
          isCorrect: sub.isCorrect,
          submittedAt: sub.submittedAt,
          timeTakenMs: sub.timeTakenMs,
        });
      } else {
        // Player did not answer in time (timed out)
        p.answers.push({
          questionId: activeRound.questionId,
          selectedOption: -1,
          isCorrect: false,
          submittedAt: new Date(),
          timeTakenMs: battle.timePerQuestion * 1000,
        });
      }
    }

    await this.repository.save(battle);

    // Fetch original question for correctAnswer and explanation
    const questionDoc = await this.qRepository.findByQuestionId(activeRound.questionId);

    const correctCount = Array.from(activeRound.submissions.values()).filter((s) => s.isCorrect).length;
    const accuracyPct = battle.players.length > 0
      ? Math.round((correctCount / battle.players.length) * 100)
      : 0;

    const isLast = activeRound.roundIndex >= battle.questionCount - 1;
    const roomChannel = `room:${roomCode}`;

    const revealPayload: IBattleRevealPayload = {
      roundIndex: activeRound.roundIndex,
      questionId: activeRound.questionId,
      correctAnswer: questionDoc ? questionDoc.correctAnswer : 0,
      explanation: questionDoc ? questionDoc.explanation : '',
      accuracyPct,
      correctCount,
      totalPlayers: battle.players.length,
      revealDurationSec: 5,
      players: battle.players.map((p: any) => {
        const uId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        const sub = activeRound.submissions.get(uId);
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

    io.to(roomChannel).emit('battle:reveal', revealPayload);

    // Schedule synchronized progression to next round in 5 seconds
    const revealTimer = setTimeout(async () => {
      this.activeTimers.delete(`${battleId}:REVEAL`);
      if (isLast) {
        const results = await this.finalizeBattle(battle);
        io.to(roomChannel).emit('battle:completed', results);
      } else {
        await this.advanceToNextRound(battleId, roomCode, io);
      }
    }, 5000);

    this.activeTimers.set(`${battleId}:REVEAL`, revealTimer);
  }

  /**
   * Advance entire room synchronously to the next question.
   */
  async advanceToNextRound(battleId: string, roomCode: string, io: Server) {
    this.clearQuestionTimeout(battleId, 'REVEAL');

    const battle = await this.repository.findById(battleId);
    if (!battle || battle.status !== BattleStatus.IN_PROGRESS) return;

    const activeRound = this.activeRounds.get(battleId);
    const nextRoundIndex = (activeRound ? activeRound.roundIndex : 0) + 1;

    const roomChannel = `room:${roomCode}`;

    if (nextRoundIndex >= battle.questionCount) {
      const results = await this.finalizeBattle(battle);
      io.to(roomChannel).emit('battle:completed', results);
      return;
    }

    // Update each player's question index and deadline
    const nextDeadline = new Date(Date.now() + battle.timePerQuestion * 1000);
    for (const p of battle.players) {
      p.currentQuestionIndex = nextRoundIndex;
      p.questionDeadline = nextDeadline;
    }
    await this.repository.save(battle);

    const nextQId = battle.players[0].assignedQuestionIds[nextRoundIndex];
    this.initRoundState(
      battleId,
      roomCode,
      nextRoundIndex,
      nextQId,
      battle.timePerQuestion,
      nextDeadline
    );

    // Set server deadline timer
    this.setRoundTimeout(battleId, nextRoundIndex, battle.timePerQuestion * 1000 + 1000, io, roomCode);

    // Fetch next sanitized question
    const nextQDoc = await questionService.getQuestionByQuestionId(nextQId);

    const nextPayload: IBattleNextQuestionPayload = {
      currentQuestionIndex: nextRoundIndex,
      totalQuestions: battle.questionCount,
      roundStartedAt: Date.now(),
      questionDeadline: nextDeadline,
      timePerQuestion: battle.timePerQuestion,
      question: nextQDoc,
      completed: false,
    };

    io.to(roomChannel).emit('battle:next_question', nextPayload);
  }

  /**
   * Handle server-side question timeout fallback.
   */
  async handleQuestionTimeout(
    battleId: string,
    _userId: string,
    _expectedIndex: number,
    io: Server,
    roomCode: string
  ) {
    await this.executeRoundReveal(battleId, roomCode, io);
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
      const sorted = [...battle.players].sort((a, b) => b.score - a.score);
      if (sorted[0].score > sorted[1].score) {
        winnerId = sorted[0].userId;
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
    const transitionedBattle = await BattleModel.findOneAndUpdate(
      {
        _id: battle._id,
        status: { $ne: BattleStatus.COMPLETED },
      },
      {
        $set: {
          status: BattleStatus.COMPLETED,
          winnerId,
          isDraw,
          endedAt,
          players: battle.players,
        },
      },
      { new: true }
    );

    if (!transitionedBattle) {
      // Race condition lost: Another concurrent handler already finalized this battle.
      // Re-fetch existing battle to return consistent formatted results without double-counting stats.
      const existing = await this.repository.findById(battle._id.toString());
      return this.formatResultsPayload(existing || battle);
    }

    const playerUserIds = battle.players.map((p) =>
      (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString()
    );

    // Clear active timeouts
    this.clearAllBattleTimers(battle._id.toString(), playerUserIds);

    // Update Room status to FINISHED
    await roomRepository.update(battle.roomCode, {
      status: RoomStatus.FINISHED,
    });

    // Update all players' persistent statistics atomically
    try {
      const winnerIdStr = winnerId
        ? ((winnerId as any)._id ? (winnerId as any)._id.toString() : winnerId.toString())
        : null;

      await Promise.all(
        battle.players.map((p) => {
          const pUId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
          const pCorrect = p.answers ? p.answers.filter((a) => a.isCorrect).length : 0;
          const pQuestions = battle.questionCount || p.assignedQuestionIds?.length || 0;
          return userRepository.recordBattleStatsById(p.userId, {
            isWin: !isDraw && winnerIdStr === pUId,
            isLoss: !isDraw && winnerIdStr !== null && winnerIdStr !== pUId,
            isDraw,
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
  async getBattleRevealPayloadIfRevealed(battleId: string): Promise<any | null> {
    const activeRound = this.activeRounds.get(battleId);
    if (!activeRound || !activeRound.isRevealed) return null;

    const battle = await this.repository.findById(battleId);
    if (!battle) return null;

    const questionDoc = await this.qRepository.findByQuestionId(activeRound.questionId);
    const correctCount = Array.from(activeRound.submissions.values()).filter((s) => s.isCorrect).length;
    const accuracyPct = battle.players.length > 0
      ? Math.round((correctCount / battle.players.length) * 100)
      : 0;

    const isLast = activeRound.roundIndex >= battle.questionCount - 1;

    return {
      roundIndex: activeRound.roundIndex,
      questionId: activeRound.questionId,
      correctAnswer: questionDoc ? questionDoc.correctAnswer : 0,
      explanation: questionDoc ? questionDoc.explanation : '',
      accuracyPct,
      correctCount,
      totalPlayers: battle.players.length,
      revealDurationSec: 5,
      players: battle.players.map((p: any) => {
        const uId = p.userId._id ? p.userId._id.toString() : p.userId.toString();
        const sub = activeRound.submissions.get(uId);
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
  }
}

export const battleService = new BattleService();
export default battleService;
