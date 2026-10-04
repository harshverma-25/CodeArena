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
} from './battle.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { logger } from '../../config/logger.js';
import { Server } from 'socket.io';
import { UserModel } from '../user/user.model.js';
import { BattleModel } from './battle.model.js';
import { userRepository } from '../user/user.repository.js';

export class BattleService {
  private activeTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private repository: BattleRepository = battleRepository,
    private qRepository: QuestionRepository = questionRepository
  ) {}

  /**
   * Set server deadline timer for a player's current question.
   */
  public setQuestionTimeout(
    battleId: string,
    userId: string,
    expectedIndex: number,
    delayMs: number,
    io: Server,
    roomCode: string
  ) {
    const timerKey = `${battleId}:${userId}`;
    this.clearQuestionTimeout(battleId, userId);

    const timer = setTimeout(async () => {
      this.activeTimers.delete(timerKey);
      try {
        await this.handleQuestionTimeout(battleId, userId, expectedIndex, io, roomCode);
      } catch (err) {
        logger.error(err, `Error handling question timeout for player ${userId} in battle ${battleId}`);
      }
    }, Math.max(delayMs, 100));

    this.activeTimers.set(timerKey, timer);
  }

  /**
   * Clear active server timer for a player.
   */
  public clearQuestionTimeout(battleId: string, userId: string) {
    const timerKey = `${battleId}:${userId}`;
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
    for (const uId of playerUserIds) {
      this.clearQuestionTimeout(battleId, uId);
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

    // 3. Player quantity validation (exactly 2 players for 1v1 battle)
    if (room.players.length !== 2) {
      throw new ApiError(400, 'Room must contain exactly two players for 1v1 battle');
    }

    // 4. Ready state validation
    const allReady = room.players.every((p) => p.isReady);
    if (!allReady) {
      throw new ApiError(400, 'All players must be ready to start the battle');
    }

    // 5. Select separate questions for each player
    let targetTopic = room.settings.topic;
    if (targetTopic === 'random') {
      const availableTopics = await this.qRepository.getAvailablePublishedTopics();
      if (availableTopics.length > 0) {
        targetTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
      } else {
        targetTopic = 'JavaScript';
      }
    }

    let targetDifficulty = room.settings.difficulty.toLowerCase();
    if (targetDifficulty === 'random') {
      targetDifficulty = 'easy';
    }

    const defaultQuestionCount = (room.settings as any).questionCount || 10;
    const totalNeeded = defaultQuestionCount * 2;

    // Sample distinct random published questions
    let sampledQuestions = await this.qRepository.sampleRandomPublished(targetTopic, targetDifficulty, totalNeeded);

    // Fallback 1: match topic with any difficulty if not enough questions
    if (sampledQuestions.length < totalNeeded) {
      const existingIds = sampledQuestions.map((q) => q.questionId);
      const remaining = totalNeeded - sampledQuestions.length;
      const extra = await this.qRepository.sampleRandomPublished(targetTopic, undefined, remaining, existingIds);
      sampledQuestions = [...sampledQuestions, ...extra];
    }

    // Fallback 2: match any topic/difficulty if still not enough questions
    if (sampledQuestions.length < totalNeeded) {
      const existingIds = sampledQuestions.map((q) => q.questionId);
      const remaining = totalNeeded - sampledQuestions.length;
      const fallback = await this.qRepository.sampleRandomPublished(undefined, undefined, remaining, existingIds);
      sampledQuestions = [...sampledQuestions, ...fallback];
    }

    if (sampledQuestions.length < 2) {
      throw new ApiError(400, 'Not enough questions available to initiate battle');
    }

    // Equal question count per player
    const actualQuestionCount = Math.min(
      defaultQuestionCount,
      Math.floor(sampledQuestions.length / 2)
    );
    const p1Questions = sampledQuestions.slice(0, actualQuestionCount).map((q) => q.questionId);
    const p2Questions = sampledQuestions.slice(actualQuestionCount, actualQuestionCount * 2).map((q) => q.questionId);

    const timePerQuestion = 30; // 30 seconds per question
    const initialDeadline = new Date(Date.now() + timePerQuestion * 1000);

    const p1UserId = room.players[0].userId && (room.players[0].userId as any)._id
      ? (room.players[0].userId as any)._id
      : room.players[0].userId;

    const p2UserId = room.players[1].userId && (room.players[1].userId as any)._id
      ? (room.players[1].userId as any)._id
      : room.players[1].userId;

    // 6. Create Battle document
    const battle = await this.repository.create({
      roomId: room._id as any,
      roomCode: code,
      topic: targetTopic,
      difficulty: targetDifficulty,
      questionCount: actualQuestionCount,
      timePerQuestion,
      players: [
        {
          userId: p1UserId,
          assignedQuestionIds: p1Questions,
          currentQuestionIndex: 0,
          questionDeadline: initialDeadline,
          answers: [],
          score: 0,
          status: 'IN_PROGRESS',
        },
        {
          userId: p2UserId,
          assignedQuestionIds: p2Questions,
          currentQuestionIndex: 0,
          questionDeadline: initialDeadline,
          answers: [],
          score: 0,
          status: 'IN_PROGRESS',
        },
      ],
      status: BattleStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    // 7. Update Room Status to IN_PROGRESS
    await roomRepository.update(code, {
      status: RoomStatus.IN_PROGRESS,
      matchId: battle._id as any,
    });

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
    const player = battle.players.find((p) => (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId);
    if (!player) return null;

    const currentQId = player.assignedQuestionIds[player.currentQuestionIndex];
    if (!currentQId) return null;

    const questionDoc = await questionService.getQuestionByQuestionId(currentQId);

    const mappedPlayers = battle.players.map((p: any) => ({
      userId: p.userId._id ? p.userId._id.toString() : p.userId.toString(),
      username: p.userId.username || '',
      displayName: p.userId.displayName || '',
      avatar: p.userId.avatar || '',
      currentQuestionIndex: p.currentQuestionIndex,
      score: p.score,
      isCompleted: p.status === 'COMPLETED',
    }));

    return {
      battleId: battle._id.toString(),
      roomCode: battle.roomCode,
      topic: battle.topic,
      difficulty: battle.difficulty,
      questionCount: battle.questionCount,
      timePerQuestion: battle.timePerQuestion,
      currentQuestionIndex: player.currentQuestionIndex,
      questionDeadline: player.questionDeadline,
      currentQuestion: questionDoc,
      players: mappedPlayers,
    };
  }

  /**
   * Submit an answer for a question with server-authoritative validation & timing checks.
   */
  async submitAnswer(
    userId: string,
    roomCode: string,
    questionId: string,
    selectedOption: number
  ): Promise<{
    battle: IBattleDocument;
    playerIndex: number;
    isCompleted: boolean;
    nextQuestionPayload: IBattleNextQuestionPayload;
    opponentProgressPayload: IBattleOpponentProgressPayload;
    resultsPayload: IBattleResultsPayload | null;
  }> {
    const battle = await this.repository.findActiveByRoomCode(roomCode);
    if (!battle) {
      throw new ApiError(404, 'Active battle not found for this room');
    }

    const playerIndex = battle.players.findIndex(
      (p) => (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );

    if (playerIndex === -1) {
      throw new ApiError(403, 'Player is not part of this battle');
    }

    const player = battle.players[playerIndex];

    if (player.status === 'COMPLETED') {
      throw new ApiError(400, 'Player has already completed all questions');
    }

    if (player.currentQuestionIndex >= battle.questionCount) {
      throw new ApiError(400, 'No more questions left in battle');
    }

    const expectedQId = player.assignedQuestionIds[player.currentQuestionIndex];
    if (questionId !== expectedQId) {
      throw new ApiError(400, 'Invalid question submission: Question ID does not match current turn');
    }

    if (player.answers.length > player.currentQuestionIndex) {
      throw new ApiError(400, 'Question has already been answered');
    }

    // Timing check using server time
    const now = new Date();
    const GRACE_PERIOD_MS = 2000;
    const isTimedOut = player.questionDeadline
      ? now.getTime() > player.questionDeadline.getTime() + GRACE_PERIOD_MS
      : false;

    // Validate correct answer on server
    const questionDoc = await this.qRepository.findByQuestionId(questionId);
    if (!questionDoc) {
      throw new ApiError(404, 'Submitted question not found in database');
    }

    let isCorrect = false;
    if (!isTimedOut && selectedOption >= 0 && selectedOption <= 3) {
      isCorrect = questionDoc.correctAnswer === selectedOption;
    }

    // Scoring: +1 for correct, 0 for wrong / timeout
    if (isCorrect) {
      player.score += 1;
    }

    const prevAnswerTime = player.answers.length > 0 ? player.answers[player.answers.length - 1].submittedAt : battle.startedAt;
    const timeTakenMs = Math.max(0, now.getTime() - new Date(prevAnswerTime).getTime());

    player.answers.push({
      questionId,
      selectedOption: isTimedOut ? -1 : selectedOption,
      isCorrect,
      submittedAt: now,
      timeTakenMs,
    });

    // Clear active server timer for this question
    this.clearQuestionTimeout(battle._id.toString(), userId);

    // Advance question index
    player.currentQuestionIndex += 1;

    let nextQuestionDoc = null;
    let isCompleted = false;

    if (player.currentQuestionIndex >= battle.questionCount) {
      player.status = 'COMPLETED';
      player.questionDeadline = null;
      isCompleted = true;
    } else {
      const nextQId = player.assignedQuestionIds[player.currentQuestionIndex];
      player.questionDeadline = new Date(Date.now() + battle.timePerQuestion * 1000);
      const doc = await questionService.getQuestionByQuestionId(nextQId);
      nextQuestionDoc = doc;
    }

    await this.repository.save(battle);

    const nextQuestionPayload: IBattleNextQuestionPayload = {
      currentQuestionIndex: player.currentQuestionIndex,
      totalQuestions: battle.questionCount,
      questionDeadline: player.questionDeadline,
      timePerQuestion: battle.timePerQuestion,
      question: nextQuestionDoc,
      completed: isCompleted,
    };

    const opponentProgressPayload: IBattleOpponentProgressPayload = {
      userId,
      currentQuestionIndex: player.currentQuestionIndex,
      totalQuestions: battle.questionCount,
      isCompleted,
      score: player.score,
    };

    let resultsPayload: IBattleResultsPayload | null = null;
    const allCompleted = battle.players.every((p) => p.status === 'COMPLETED');
    if (allCompleted) {
      resultsPayload = await this.finalizeBattle(battle);
    }

    return {
      battle,
      playerIndex,
      isCompleted,
      nextQuestionPayload,
      opponentProgressPayload,
      resultsPayload,
    };
  }

  /**
   * Handle server-side question timeout when timer expires.
   */
  async handleQuestionTimeout(
    battleId: string,
    userId: string,
    expectedIndex: number,
    io: Server,
    roomCode: string
  ) {
    const battle = await this.repository.findById(battleId);
    if (!battle || battle.status !== BattleStatus.IN_PROGRESS) return;

    const player = battle.players.find(
      (p) => (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );

    if (!player || player.status === 'COMPLETED') return;
    if (player.currentQuestionIndex !== expectedIndex) return;

    const questionId = player.assignedQuestionIds[player.currentQuestionIndex];
    if (!questionId) return;

    const now = new Date();
    player.answers.push({
      questionId,
      selectedOption: -1,
      isCorrect: false,
      submittedAt: now,
      timeTakenMs: battle.timePerQuestion * 1000,
    });

    player.currentQuestionIndex += 1;

    let nextQuestionDoc = null;
    let isCompleted = false;

    if (player.currentQuestionIndex >= battle.questionCount) {
      player.status = 'COMPLETED';
      player.questionDeadline = null;
      isCompleted = true;
    } else {
      const nextQId = player.assignedQuestionIds[player.currentQuestionIndex];
      player.questionDeadline = new Date(Date.now() + battle.timePerQuestion * 1000);
      nextQuestionDoc = await questionService.getQuestionByQuestionId(nextQId);

      // Register next timeout
      this.setQuestionTimeout(
        battle._id.toString(),
        userId,
        player.currentQuestionIndex,
        battle.timePerQuestion * 1000,
        io,
        roomCode
      );
    }

    await this.repository.save(battle);

    // Emit next question payload to player socket
    const roomChannel = `room:${roomCode}`;
    const sockets = await io.in(roomChannel).fetchSockets();
    const playerSocket = sockets.find((s) => s.data.user?._id?.toString() === userId);

    if (playerSocket) {
      playerSocket.emit('battle:next_question', {
        currentQuestionIndex: player.currentQuestionIndex,
        totalQuestions: battle.questionCount,
        questionDeadline: player.questionDeadline,
        timePerQuestion: battle.timePerQuestion,
        question: nextQuestionDoc,
        completed: isCompleted,
      } as IBattleNextQuestionPayload);
    }

    // Emit opponent progress to room
    io.to(roomChannel).emit('battle:opponent_progress', {
      userId,
      currentQuestionIndex: player.currentQuestionIndex,
      totalQuestions: battle.questionCount,
      isCompleted,
      score: player.score,
    } as IBattleOpponentProgressPayload);

    // Check if battle finished
    const allCompleted = battle.players.every((p) => p.status === 'COMPLETED');
    if (allCompleted) {
      const results = await this.finalizeBattle(battle);
      io.to(roomChannel).emit('battle:completed', results);
    }
  }

  /**
   * Finalize battle, calculate scores, determine winner/draw, and format results.
   * Atomically and idempotently transitions the battle to COMPLETED.
   */
  async finalizeBattle(battle: IBattleDocument): Promise<IBattleResultsPayload> {
    const player1 = battle.players[0];
    const player2 = battle.players[1];

    const p1UserId = (player1.userId as any)._id ? (player1.userId as any)._id.toString() : player1.userId.toString();
    const p2UserId = (player2.userId as any)._id ? (player2.userId as any)._id.toString() : player2.userId.toString();

    let winnerId: any = null;
    let isDraw = false;
    if (player1.score > player2.score) {
      winnerId = player1.userId;
      isDraw = false;
    } else if (player2.score > player1.score) {
      winnerId = player2.userId;
      isDraw = false;
    } else {
      winnerId = null;
      isDraw = true;
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

    // Clear active timeouts
    this.clearAllBattleTimers(battle._id.toString(), [p1UserId, p2UserId]);

    // Update Room status to FINISHED
    await roomRepository.update(battle.roomCode, {
      status: RoomStatus.FINISHED,
    });

    // Update both players' persistent statistics atomically
    try {
      const winnerIdStr = winnerId
        ? ((winnerId as any)._id ? (winnerId as any)._id.toString() : winnerId.toString())
        : null;

      const p1Correct = player1.answers ? player1.answers.filter((a) => a.isCorrect).length : 0;
      const p1Questions = battle.questionCount || player1.assignedQuestionIds?.length || 0;

      const p2Correct = player2.answers ? player2.answers.filter((a) => a.isCorrect).length : 0;
      const p2Questions = battle.questionCount || player2.assignedQuestionIds?.length || 0;

      await Promise.all([
        userRepository.recordBattleStatsById(player1.userId, {
          isWin: !isDraw && winnerIdStr === p1UserId,
          isLoss: !isDraw && winnerIdStr !== null && winnerIdStr !== p1UserId,
          isDraw,
          correctCount: p1Correct,
          questionCount: p1Questions,
        }),
        userRepository.recordBattleStatsById(player2.userId, {
          isWin: !isDraw && winnerIdStr === p2UserId,
          isLoss: !isDraw && winnerIdStr !== null && winnerIdStr !== p2UserId,
          isDraw,
          correctCount: p2Correct,
          questionCount: p2Questions,
        }),
      ]);
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
    };
  }
}

export const battleService = new BattleService();
export default battleService;
