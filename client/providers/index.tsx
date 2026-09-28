"use client";

import React from "react";
import { QueryProvider } from "./QueryProvider";
import { SocketProvider } from "./SocketProvider";
import { AuthSyncProvider } from "./AuthSyncProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
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
