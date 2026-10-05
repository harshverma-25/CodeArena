import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { User } from "@/types";
import { isGuestSessionActive, getGuestUser } from "@/features/auth/guestAuth";
import { isNativeAuthActive, getNativeUser } from "@/features/auth/nativeAuth";

export function useCurrentUser() {
  const api = useApiClient();
  const [authState, setAuthState] = useState(() => ({
    isNative: isNativeAuthActive(),
    isGuest: isGuestSessionActive(),
  }));

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState({
        isNative: isNativeAuthActive(),
        isGuest: isGuestSessionActive(),
      });
    };

    window.addEventListener("codearena:native-auth-change", handleAuthChange);
    window.addEventListener("codearena:guest-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("codearena:native-auth-change", handleAuthChange);
      window.removeEventListener("codearena:guest-auth-change", handleAuthChange);
    };
  }, []);

  const isEnabled = authState.isNative || authState.isGuest;

  return useQuery<User, Error>({
    queryKey: ["currentUser", authState.isNative ? "native" : "guest"],
    queryFn: async () => {
      try {
        const response = await api.get<{ success: boolean; data: User }>("/auth/me");
        const responseData = response as unknown as { success: boolean; data: User };
        if (responseData && responseData.data) {
          return responseData.data;
        }
      } catch (err) {
        // Fallback to local user state if available
        const native = getNativeUser();
        if (native) return native;
        const guest = getGuestUser();
        if (guest) return guest;
        throw err;
      }
      const native = getNativeUser();
      if (native) return native;
      const guest = getGuestUser();
      if (guest) return guest;
      throw new Error("Failed to retrieve user profile.");
    },
    enabled: isEnabled,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
export default useCurrentUser;
