"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { AuthLoadingState } from "@/components/shared/AuthLoadingState";
import { AuthErrorState } from "@/components/shared/AuthErrorState";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading, isError, error, refetch } = useCurrentUser();

  // 1. Wait for Clerk JS SDK to finish loading
  if (!isLoaded) {
    return <AuthLoadingState />;
  }

  // 2. If signed in, sync user profile with MongoDB via useCurrentUser query
  if (isSignedIn) {
    if (isLoading) {
      return <AuthLoadingState />;
    }
    if (isError) {
      return <AuthErrorState error={error} onRetry={() => refetch()} />;
    }
  }

  // 3. User is either synced successfully or is a guest on public routes
  return <>{children}</>;
}
export default AuthSyncProvider;
