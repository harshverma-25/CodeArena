import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";
import { LeaderboardResponse } from "@/types";

export function useLeaderboard(page = 1, limit = 10) {
  const api = useApiClient();
  const hasAuth = isNativeAuthActive() || isGuestSessionActive();

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
    enabled: hasAuth,
    staleTime: 30 * 1000,
  });
}
export default useLeaderboard;
