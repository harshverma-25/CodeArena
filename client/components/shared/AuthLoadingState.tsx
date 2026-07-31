"use client";

import React, { useEffect, useState } from "react";
import { Shield } from "lucide-react";

export function AuthLoadingState() {
  const [statusIndex, setStatusIndex] = useState(0);
  const statusMessages = [
    "Establishing secure connection...",
    "Verifying credentials...",
    "Synchronizing Arena profile...",
    "Preparing competitive coding workspace...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 max-w-sm px-6 text-center">
        {/* Animated Brand Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border shadow-2xl animate-pulse">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 to-orange-500/20 blur" />
          <Shield className="h-10 w-10 text-primary animate-bounce duration-1000" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            CodeArena
          </h2>
          <p className="text-sm text-muted-foreground h-5 font-mono">
            {statusMessages[statusIndex]}
          </p>
        </div>

        {/* CSS Loading Bar */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-2/3 rounded-full bg-primary animate-[infinite-scroll_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
export default AuthLoadingState;
