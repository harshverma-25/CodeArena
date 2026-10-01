import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { LeaderboardResponse } from "@/types";

export function useLeaderboard(page = 1, limit = 10) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<LeaderboardResponse, Error>({
    queryKey: ["leaderboard", page, limit],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: LeaderboardResponse }>(
        `/leaderboard?page=${page}&limit=${limit}`
      );
      
      const responseData = response as unknown as { success: boolean; data: LeaderboardResponse };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to load leaderboard data.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 30 * 1000, // 30 seconds
  });
}
export default useLeaderboard;
