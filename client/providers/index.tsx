"use client";

import React, { useEffect } from "react";
import { QueryProvider } from "./QueryProvider";
import { SocketProvider } from "./SocketProvider";
import { configureMonacoLoader } from "@/lib/monaco";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Pre-emptively configure Monaco Editor themes and paths on client mount
    configureMonacoLoader();
  }, []);

  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}

export * from "./QueryProvider";
export * from "./SocketProvider";
