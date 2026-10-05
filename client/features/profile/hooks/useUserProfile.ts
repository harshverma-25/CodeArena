import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";
import { PublicUserProfile } from "@/types";

export function useUserProfile(username?: string) {
  const api = useApiClient();
  const hasAuth = isNativeAuthActive() || isGuestSessionActive();

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
    enabled: hasAuth,
    staleTime: 30 * 1000,
  });
}
export default useUserProfile;
