import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";

export interface MatchHistoryItem {
  _id: string;
  roomId?: string;
  roomCode?: string;
  topic?: string;
  difficulty?: string;
  questionCount?: number;
  status: string;
  winnerId?: string | null;
  isDraw?: boolean;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  categoryId?: string;
  subjectId?: string | null;
  isMixedCategory?: boolean;
  totalPlayers?: number;
  userRank?: number;
  userScore?: number;
  userAccuracy?: number;
  userCorrectCount?: number;
  rankings?: Array<{
    userId: string;
    username: string;
    displayName: string;
    avatar: string;
    totalScore: number;
    rank: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    unanswered?: number;
    accuracy?: number;
  }>;
  players?: Array<{
    user: {
      _id: string;
      username: string;
      displayName: string;
      avatar: string;
    } | null;
    score?: number;
    rank?: number;
  }>;
  winner?: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  opponent?: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  opponentScore?: number;
  result?: "VICTORY" | "DEFEAT" | "DRAW" | "IN_PROGRESS" | "CANCELLED" | "COMPLETED";
}

export interface MatchHistoryResponse {
  matches: MatchHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export function useMatchHistory(page = 1, limit = 10) {
  const api = useApiClient();
  const hasAuth = isNativeAuthActive() || isGuestSessionActive();

  return useQuery<MatchHistoryResponse, Error>({
    queryKey: ["matchHistory", page, limit],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: MatchHistoryResponse }>(
        `/history?page=${page}&limit=${limit}`
      );

      const responseData = response as unknown as { success: boolean; data: MatchHistoryResponse };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to retrieve match history.");
      }
      return responseData.data;
    },
    enabled: hasAuth,
    staleTime: 15 * 1000,
  });
}
export default useMatchHistory;
