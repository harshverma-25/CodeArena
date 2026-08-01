import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";

export interface MatchHistoryResponse {
  matches: Array<{
    _id: string;
    roomId: string;
    roomCode: string;
    players: Array<{
      user: {
        _id: string;
        username: string;
        displayName: string;
        avatar: string;
      } | null;
    }>;
    winner: {
      _id: string;
      username: string;
      displayName: string;
      avatar: string;
    } | null;
    status: string;
    startedAt: string;
    endedAt?: string;
    duration?: number; // in seconds
    problem: {
      _id: string;
      title: string;
      difficulty: string;
      topic: string;
    } | null;
  }>;
  total: number;
  page: number;
  limit: number;
}

export function useMatchHistory(page = 1, limit = 10) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<MatchHistoryResponse, Error>({
    queryKey: ["matchHistory", page, limit],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: MatchHistoryResponse }>(
        `/matches/history?page=${page}&limit=${limit}`
      );
      
      const responseData = response as unknown as { success: boolean; data: MatchHistoryResponse };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to retrieve match history.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 15 * 1000, // 15 seconds cache freshness
  });
}
export default useMatchHistory;
