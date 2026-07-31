import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { Problem } from "@/types";

export function useProblemBySlug(slug: string) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<Problem, Error>({
    queryKey: ["problem", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Problem slug is required.");
      const response = await api.get<{ success: boolean; data: Problem }>(
        `/problems/${slug}`
      );
      
      const responseData = response as unknown as { success: boolean; data: Problem };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to retrieve problem details.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes stale state
  });
}
export default useProblemBySlug;
