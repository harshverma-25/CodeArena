import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { Problem } from "@/types";

export interface GetProblemsResponse {
  problems: Problem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseProblemsFilters {
  page?: number;
  limit?: number;
  search?: string;
  topic?: string;
  difficulty?: string;
}

export function useProblems(filters: UseProblemsFilters) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<GetProblemsResponse, Error>({
    queryKey: ["problems", filters],
    queryFn: async () => {
      // Build query string
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.topic && filters.topic !== "all") params.append("topic", filters.topic);
      if (filters.difficulty && filters.difficulty !== "all") {
        params.append("difficulty", filters.difficulty);
      }

      const response = await api.get<{ success: boolean; data: GetProblemsResponse }>(
        `/problems?${params.toString()}`
      );
      
      const responseData = response as unknown as { success: boolean; data: GetProblemsResponse };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to retrieve problems from the Arena.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 60 * 1000, // 1 minute stale state
  });
}
export default useProblems;
