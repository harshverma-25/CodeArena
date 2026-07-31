"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import { AlertOctagon, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export function AuthErrorState({ error, onRetry }: AuthErrorStateProps) {
  const { signOut } = useClerk();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 text-foreground">
      {/* Background orange warning glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-destructive/5 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 max-w-md w-full rounded-2xl border border-border bg-card/60 backdrop-blur-md p-8 shadow-2xl text-center">
        {/* Error icon wrapper */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertOctagon className="h-8 w-8 animate-pulse" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Arena Sync Failed
          </h2>
          <p className="text-sm text-muted-foreground">
            We couldn't synchronize your profile with the CodeArena backend. The servers might be down or undergoing maintenance.
          </p>
          {error && (
            <div className="mt-4 rounded-md bg-secondary/50 p-3 text-left border border-border">
              <span className="font-mono text-xs text-destructive block break-words">
                Error: {error.message || "Unknown Connection Failure"}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <Button
            onClick={onRetry}
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
          <Button
            variant="secondary"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex-1 gap-2 border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
export default AuthErrorState;
