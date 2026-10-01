import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { PublicUserProfile } from "@/types";

export function useUserProfile(username?: string) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  const isMe = !username || username === "me";
  const endpoint = isMe ? "/users/profile/me" : `/users/profile/${username}`;

  return useQuery<PublicUserProfile, Error>({
    queryKey: ["userProfile", username || "me"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: PublicUserProfile }>(endpoint);
      
      const responseData = response as unknown as { success: boolean; data: PublicUserProfile };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to load user profile statistics.");
      }
      return responseData.data;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 30 * 1000, // 30 seconds
  });
}
export default useUserProfile;
