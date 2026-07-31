"use client";

import React, { useEffect } from "react";
import { QueryProvider } from "./QueryProvider";
import { SocketProvider } from "./SocketProvider";
import { AuthSyncProvider } from "./AuthSyncProvider";
import { configureMonacoLoader } from "@/lib/monaco";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Pre-emptively configure Monaco Editor themes and paths on client mount
    configureMonacoLoader();
  }, []);

  return (
    <QueryProvider>
      <SocketProvider>
        <AuthSyncProvider>{children}</AuthSyncProvider>
      </SocketProvider>
    </QueryProvider>
  );
}

export * from "./QueryProvider";
export * from "./SocketProvider";
export * from "./AuthSyncProvider";
