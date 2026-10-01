"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useBattleResult } from "@/features/battle/hooks/useBattleResult";
import { BattleResultsView } from "@/features/battle/components/BattleResultsView";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, ShieldAlert, Home } from "lucide-react";

export default function BattleResultsPage() {
  const params = useParams();
  const router = useRouter();
  const battleId = (params.battleId as string) || "";

  const { data: results, isLoading, isError, error, refetch } = useBattleResult(battleId);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[70vh] w-full text-foreground p-6 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center font-mono text-xs text-muted-foreground">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <RefreshCw className="h-6 w-6 text-primary absolute animate-pulse" />
          </div>
          <p className="text-sm font-bold text-foreground">Fetching Battle Results...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !results) {
    const isForbidden = error?.message?.includes("Unauthorized") || error?.message?.includes("403");

    return (
      <div className="min-h-[70vh] w-full text-foreground p-6 flex flex-col items-center justify-center">
        <div className="mx-auto max-w-md w-full text-center p-8 border border-destructive/20 bg-destructive/5 rounded-3xl space-y-5 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            {isForbidden ? <ShieldAlert className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-foreground">
              {isForbidden ? "Access Restricted" : "Battle Results Unavailable"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {error?.message || "Unable to retrieve battle performance report."}
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2 font-mono text-xs">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="border border-border text-foreground hover:bg-secondary/40 h-10 px-4"
            >
              <Home className="h-4 w-4 mr-1.5" />
              Dashboard
            </Button>
            <Button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground h-10 px-4"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <BattleResultsView results={results} />
    </div>
  );
}
