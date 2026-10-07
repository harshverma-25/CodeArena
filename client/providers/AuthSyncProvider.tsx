"use client";

import React, { useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { refetch } = useCurrentUser();

  useEffect(() => {
    const handleAuthChange = () => {
      refetch();
    };
    window.addEventListener("codearena:native-auth-change", handleAuthChange);
    window.addEventListener("codearena:guest-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("codearena:native-auth-change", handleAuthChange);
      window.removeEventListener("codearena:guest-auth-change", handleAuthChange);
    };
  }, [refetch]);

  return <>{children}</>;
}
export default AuthSyncProvider;
