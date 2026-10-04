"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { AuthLoadingState } from "@/components/shared/AuthLoadingState";
import { AuthErrorState } from "@/components/shared/AuthErrorState";
import { isGuestSessionActive } from "@/features/auth/guestAuth";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading, isError, error, refetch } = useCurrentUser();
  const [guestActive, setGuestActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isGuestSessionActive();
  });

  useEffect(() => {
    const handleGuestAuthChange = () => {
      setGuestActive(isGuestSessionActive());
    };
    window.addEventListener("codearena:guest-auth-change", handleGuestAuthChange);
    return () => {
      window.removeEventListener("codearena:guest-auth-change", handleGuestAuthChange);
    };
  }, []);

  // 1. Wait for Clerk JS SDK to finish loading
  if (!isLoaded) {
    return <AuthLoadingState />;
  }

  // 2. If signed in or guest session active, sync user profile with MongoDB via useCurrentUser query
  if (isSignedIn || guestActive) {
    if (isLoading) {
      return <AuthLoadingState />;
    }
    if (isError) {
      return <AuthErrorState error={error} onRetry={() => refetch()} />;
    }
  }

  // 3. User is unauthenticated on public routes
  return <>{children}</>;
}
export default AuthSyncProvider;
