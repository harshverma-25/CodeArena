import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";
import { BattleResultDetails } from "@/types";

export function useBattleResult(battleId: string) {
  const api = useApiClient();
  const hasAuth = isNativeAuthActive() || isGuestSessionActive();

  return useQuery<BattleResultDetails, Error>({
    queryKey: ["battleResult", battleId],
    queryFn: async () => {
      if (!battleId) throw new Error("Battle ID is required.");
      const response = await api.get<{ success: boolean; data: BattleResultDetails }>(
        `/history/battles/${battleId}`
      );

      const responseData = response as unknown as { success: boolean; data: BattleResultDetails };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to load battle results.");
      }
      return responseData.data;
    },
    enabled: hasAuth && !!battleId,
    staleTime: 60 * 1000,
  });
}
export default useBattleResult;
