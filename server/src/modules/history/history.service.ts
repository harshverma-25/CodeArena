import { historyRepository, HistoryRepository } from './history.repository.js';
import { questionRepository, QuestionRepository } from '../question/question.repository.js';
import { BattleStatus, IBattleDocument } from '../battle/battle.types.js';
import {
  IBattleHistoryItem,
  IBattleHistoryResponse,
  IBattleResultDetails,
  IBattleResultPlayer,
  IBattleResultQuestion,
} from './history.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { IQuestionDocument } from '../question/question.types.js';
import { BattleModel } from '../battle/battle.model.js';
import { roomRepository } from '../room/room.repository.js';
import { Types } from 'mongoose';

export class HistoryService {
  constructor(
    private repository: HistoryRepository = historyRepository,
    private qRepository: QuestionRepository = questionRepository
  ) {}

  /**
   * Get paginated battle history for an authenticated user.
   */
  async getMatchHistory(
    userId: string,
    options: { page?: number; limit?: number }
  ): Promise<IBattleHistoryResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));

    const { battles, total } = await this.repository.getUserBattleHistory(userId, {
      page,
      limit,
    });

    const matches: IBattleHistoryItem[] = battles.map((battle) => {
      const myPlayer = battle.players.find((p: any) => {
        const pUId = p?.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p?.userId?.toString();
        return pUId === userId;
      }) || battle.players[0];

      const oppPlayer = battle.players.find((p: any) => {
        const pUId = p?.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p?.userId?.toString();
        return pUId !== userId;
      }) || null;

      const myUser = myPlayer?.userId && typeof myPlayer.userId === 'object'
        ? {
            _id: (myPlayer.userId as any)._id ? (myPlayer.userId as any)._id.toString() : myPlayer.userId.toString(),
            username: (myPlayer.userId as any).username || '',
            displayName: (myPlayer.userId as any).displayName || '',
            avatar: (myPlayer.userId as any).avatar || '',
          }
        : null;

      const oppUser = oppPlayer?.userId && typeof oppPlayer.userId === 'object'
        ? {
            _id: (oppPlayer.userId as any)._id ? (oppPlayer.userId as any)._id.toString() : oppPlayer.userId.toString(),
            username: (oppPlayer.userId as any).username || '',
            displayName: (oppPlayer.userId as any).displayName || '',
            avatar: (oppPlayer.userId as any).avatar || '',
          }
        : null;

      const winnerIdStr = battle.winnerId
        ? (battle.winnerId as any)._id
          ? (battle.winnerId as any)._id.toString()
          : battle.winnerId.toString()
        : null;

      let result: 'VICTORY' | 'DEFEAT' | 'DRAW' | 'IN_PROGRESS' | 'CANCELLED' = 'IN_PROGRESS';
      if (battle.status === BattleStatus.CANCELLED) {
        result = 'CANCELLED';
      } else if (battle.status === BattleStatus.COMPLETED) {
        if (battle.isDraw) {
          result = 'DRAW';
        } else if (winnerIdStr === userId) {
          result = 'VICTORY';
        } else {
          result = 'DEFEAT';
        }
      }

      const startedMs = battle.startedAt ? new Date(battle.startedAt).getTime() : 0;
      const endedMs = battle.endedAt ? new Date(battle.endedAt).getTime() : Date.now();
      const duration = startedMs > 0 ? Math.max(0, Math.floor((endedMs - startedMs) / 1000)) : 0;

      const formattedWinner = battle.winnerId && typeof battle.winnerId === 'object'
        ? {
            _id: (battle.winnerId as any)._id ? (battle.winnerId as any)._id.toString() : battle.winnerId.toString(),
            username: (battle.winnerId as any).username || '',
            displayName: (battle.winnerId as any).displayName || '',
            avatar: (battle.winnerId as any).avatar || '',
          }
        : null;

      return {
        _id: battle._id.toString(),
        roomId: battle.roomId ? battle.roomId.toString() : '',
        roomCode: battle.roomCode,
        topic: battle.topic,
        difficulty: battle.difficulty,
        questionCount: battle.questionCount,
        status: battle.status,
        winnerId: winnerIdStr,
        isDraw: battle.isDraw,
        startedAt: battle.startedAt,
        endedAt: battle.endedAt,
        duration,
        players: battle.players.map((p) => ({
          user: p.userId && typeof p.userId === 'object'
            ? {
                _id: (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString(),
                username: (p.userId as any).username || '',
                displayName: (p.userId as any).displayName || '',
                avatar: (p.userId as any).avatar || '',
              }
            : null,
          score: p.score,
        })),
        winner: formattedWinner,
        opponent: oppUser,
        userScore: myPlayer?.score || 0,
        opponentScore: oppPlayer?.score || 0,
        result,
      };
    });

    return {
      matches,
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed battle results for an authenticated participant after battle completion.
   */
  async getBattleResults(battleId: string, userId: string): Promise<IBattleResultDetails> {
    let battle: any = null;
    if (Types.ObjectId.isValid(battleId)) {
      battle = await this.repository.getBattleById(battleId);
    }
    if (!battle) {
      battle = await BattleModel.findOne({ roomCode: battleId.toUpperCase() }).populate('players.userId');
    }
    if (!battle) {
      throw new ApiError(404, 'Battle not found');
    }

    // 1. Participant Authorization Check
    const isParticipant = battle.players.some((p: any) => {
      const pId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
      return pId === userId;
    });

    if (!isParticipant) {
      throw new ApiError(403, 'Unauthorized: You are not a participant in this battle');
    }

    // 2. Battle Completion Check
    if (battle.status !== BattleStatus.COMPLETED) {
      throw new ApiError(400, 'Battle results are only available for completed battles');
    }

    // 3. Gather all question IDs assigned in this battle
    const allQuestionIds = new Set<string>();
    for (const player of battle.players) {
      for (const qId of player.assignedQuestionIds) {
        allQuestionIds.add(qId);
      }
    }

    // Fetch question documents from DB
    const questionsDocs = await this.qRepository.findByQuestionIds(Array.from(allQuestionIds));
    const questionMap = new Map<string, IQuestionDocument>();
    for (const doc of questionsDocs) {
      questionMap.set(doc.questionId, doc);
    }

    const winnerIdStr = battle.winnerId
      ? (battle.winnerId as any)._id
        ? (battle.winnerId as any)._id.toString()
        : battle.winnerId.toString()
      : null;

    // 4. Build results for each player
    const formattedPlayers: IBattleResultPlayer[] = battle.players.map((p: any) => {
      const pUserIdStr = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();

      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;

      const questionsBreakdown: IBattleResultQuestion[] = p.assignedQuestionIds.map((qId: string) => {
        const answerObj = p.answers.find((a: any) => a.questionId === qId);
        const qDoc = questionMap.get(qId);

        const selectedOption = answerObj ? answerObj.selectedOption : -1;
        const isCorrect = answerObj ? answerObj.isCorrect : false;
        const timeTakenMs = answerObj ? answerObj.timeTakenMs : 0;
        const isUnanswered = selectedOption === -1;

        if (isCorrect) {
          correctCount++;
        } else if (isUnanswered) {
          unansweredCount++;
        } else {
          incorrectCount++;
        }

        return {
          questionId: qId,
          question: qDoc ? qDoc.question : 'Question text unavailable',
          options: qDoc ? qDoc.options : [],
          correctAnswer: qDoc ? qDoc.correctAnswer : 0, // Server-stored correct answer
          explanation: qDoc ? qDoc.explanation : 'No explanation provided.', // Server-stored explanation
          selectedOption,
          isCorrect,
          timeTakenMs,
          isUnanswered,
        };
      });

      const userObj = p.userId && typeof p.userId === 'object'
        ? {
            username: (p.userId as any).username || '',
            displayName: (p.userId as any).displayName || '',
            avatar: (p.userId as any).avatar || '',
          }
        : { username: '', displayName: '', avatar: '' };

      return {
        userId: pUserIdStr,
        username: userObj.username,
        displayName: userObj.displayName,
        avatar: userObj.avatar,
        score: p.score,
        totalQuestions: battle.questionCount,
        correctCount,
        incorrectCount,
        unansweredCount,
        isWinner: !battle.isDraw && winnerIdStr === pUserIdStr,
        isDraw: battle.isDraw,
        questions: questionsBreakdown,
      };
    });

    const userPlayer = formattedPlayers.find((p) => p.userId === userId) || formattedPlayers[0];
    const opponentPlayer = formattedPlayers.find((p) => p.userId !== userId) || null;

    let result: 'VICTORY' | 'DEFEAT' | 'DRAW' | 'IN_PROGRESS' | 'CANCELLED' = 'DRAW';
    if (battle.isDraw) {
      result = 'DRAW';
    } else if (winnerIdStr === userId) {
      result = 'VICTORY';
    } else {
      result = 'DEFEAT';
    }

    const startedMs = battle.startedAt ? new Date(battle.startedAt).getTime() : 0;
    const endedMs = battle.endedAt ? new Date(battle.endedAt).getTime() : Date.now();
    const duration = startedMs > 0 ? Math.max(0, Math.floor((endedMs - startedMs) / 1000)) : 0;

    // Retrieve associated room settings for category/subject context
    const room = await roomRepository.findByRoomCode(battle.roomCode);

    // Compute dynamic player rankings for 1..4 players
    const sortedPlayers = [...formattedPlayers].sort((a, b) => b.score - a.score);
    let currentRank = 1;
    const rankings = sortedPlayers.map((p, index) => {
      if (index > 0 && p.score < sortedPlayers[index - 1].score) {
        currentRank = index + 1;
      }
      return {
        userId: p.userId,
        username: p.username,
        displayName: p.displayName,
        avatar: p.avatar,
        totalScore: p.score,
        rank: currentRank,
        correctAnswers: p.correctCount,
        incorrectAnswers: p.incorrectCount,
        unanswered: p.unansweredCount,
        accuracy: p.totalQuestions > 0 ? Math.round((p.correctCount / p.totalQuestions) * 100) : 0,
      };
    });

    const hostIdStr = room?.hostId
      ? ((room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString())
      : undefined;

    return {
      battleId: battle._id.toString(),
      roomCode: battle.roomCode,
      hostId: hostIdStr,
      topic: battle.topic,
      difficulty: battle.difficulty,
      questionCount: battle.questionCount,
      timePerQuestion: battle.timePerQuestion,
      status: battle.status,
      winnerId: winnerIdStr,
      isDraw: battle.isDraw,
      startedAt: battle.startedAt,
      endedAt: battle.endedAt,
      duration,
      categoryId: room?.settings?.categoryId,
      subjectId: room?.settings?.subjectId,
      isMixedCategory: room?.settings?.isMixedCategory,
      rankings,
      players: formattedPlayers,
      userPlayer,
      opponentPlayer,
      result,
    };
  }
}

export const historyService = new HistoryService();
export default historyService;
