"use client";

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { AuthLoadingState } from "@/components/shared/AuthLoadingState";
import { AuthErrorState } from "@/components/shared/AuthErrorState";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isError, error, refetch } = useCurrentUser();
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isNativeAuthActive() || isGuestSessionActive();
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthed(isNativeAuthActive() || isGuestSessionActive());
    };
    window.addEventListener("codearena:native-auth-change", handleAuthChange);
    window.addEventListener("codearena:guest-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("codearena:native-auth-change", handleAuthChange);
      window.removeEventListener("codearena:guest-auth-change", handleAuthChange);
    };
  }, []);

  if (authed) {
    if (isLoading) {
      return <AuthLoadingState />;
    }
    if (isError) {
      return <AuthErrorState error={error} onRetry={() => refetch()} />;
    }
  }

  return <>{children}</>;
}
export default AuthSyncProvider;
