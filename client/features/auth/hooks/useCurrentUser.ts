import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { User } from "@/types";
import { isGuestSessionActive, getGuestUser } from "@/features/auth/guestAuth";
import { isNativeAuthActive, getNativeUser } from "@/features/auth/nativeAuth";

export function useCurrentUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState({
    isNative: false,
    isGuest: false,
  });

  useEffect(() => {
    const syncState = () => {
      const isNative = isNativeAuthActive();
      const isGuest = isGuestSessionActive();
      setAuthState({
        isNative,
        isGuest,
      });

      if (!isNative && !isGuest) {
        queryClient.removeQueries({ queryKey: ["currentUser"] });
      }
    };

    syncState();

    window.addEventListener("codearena:native-auth-change", syncState);
    window.addEventListener("codearena:guest-auth-change", syncState);
    return () => {
      window.removeEventListener("codearena:native-auth-change", syncState);
      window.removeEventListener("codearena:guest-auth-change", syncState);
    };
  }, [queryClient]);

  const isEnabled = authState.isNative || authState.isGuest;

  const query = useQuery<User, Error>({
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

  if (!isEnabled) {
    return {
      ...query,
      data: undefined,
      isLoading: false,
      isFetching: false,
    };
  }

  return query;
}
export default useCurrentUser;
