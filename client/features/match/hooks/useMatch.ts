"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { Match } from "@/types";

export function useMatch(matchId: string) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<Match, Error>({
    queryKey: ["match", matchId],
    queryFn: async () => {
      if (!matchId) throw new Error("Match ID is required.");
      const response = await api.get<{ success: boolean; data: Match }>(
        `/matches/${matchId}`
      );
      
      const responseData = response as unknown as { success: boolean; data: Match };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to load match details.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn && !!matchId,
    staleTime: 5000,
  });
}
export default useMatch;
