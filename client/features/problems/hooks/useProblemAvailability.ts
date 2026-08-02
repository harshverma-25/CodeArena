import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";

export type ProblemAvailabilityMatrix = Record<string, Record<string, boolean>>;

export function useProblemAvailability() {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<ProblemAvailabilityMatrix, Error>({
    queryKey: ["problems-availability"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: ProblemAvailabilityMatrix }>(
        "/problems/availability"
      );
      const responseData = response as unknown as { success: boolean; data: ProblemAvailabilityMatrix };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to retrieve problem availability.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 30 * 1000, // 30 seconds stale state
  });
}
export default useProblemAvailability;
