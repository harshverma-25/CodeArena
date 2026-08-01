"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { Submission } from "@/types";

export function useMatchSubmissions(matchId: string) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<Submission[], Error>({
    queryKey: ["matchSubmissions", matchId],
    queryFn: async () => {
      if (!matchId) return [];
      const response = await api.get<{ success: boolean; data: Submission[] }>(
        `/matches/${matchId}/submissions`
      );
      
      const responseData = response as unknown as { success: boolean; data: Submission[] };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to load match submissions.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn && !!matchId,
    staleTime: 10000,
  });
}
export default useMatchSubmissions;
