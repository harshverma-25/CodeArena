import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { User } from "@/types";

export function useCurrentUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  return useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: User }>("/users/me");
      
      // The API response is parsed as { success: boolean, data: User, message?: string }
      // We extract data and type-cast it safely
      const responseData = response as unknown as { success: boolean; data: User };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to retrieve user profile from competitive backend.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn,
    retry: 1, // Only retry once to avoid blocking the UI with long loads on network errors
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale duration
  });
}
export default useCurrentUser;
