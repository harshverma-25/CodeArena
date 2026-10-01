"use client";

import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { OpponentLiveState } from "../hooks/useLiveBattle";

interface WaitingForOpponentProps {
  myScore: number;
  totalQuestions: number;
  opponent: OpponentLiveState | null;
}

export function WaitingForOpponent({
  myScore,
  totalQuestions,
  opponent,
}: WaitingForOpponentProps) {
  const oppName = opponent?.displayName || opponent?.username || "Opponent";
  const oppCurrentQ = (opponent?.currentQuestionIndex || 0) + 1;

  return (
    <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-2xl text-center space-y-6 max-w-lg mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-primary" />

      {/* Completion Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground tracking-tight">
          You&apos;ve Completed All Questions!
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Great job! Your answers are locked in. Waiting for{" "}
          <span className="text-foreground font-bold font-mono">@{oppName}</span> to complete
          their match.
        </p>
      </div>

      {/* Current Score Summary */}
      <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-around font-mono">
        <div>
          <p className="text-xs text-muted-foreground uppercase">Your Score</p>
          <p className="text-2xl font-black text-primary">{myScore}</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground uppercase">{oppName}&apos;s Progress</p>
          <p className="text-2xl font-black text-foreground">
            {Math.min(oppCurrentQ, totalQuestions)} / {totalQuestions}
          </p>
        </div>
      </div>

      {/* Live Polling Spinner */}
      <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground pt-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Synchronizing final match results...</span>
      </div>
    </div>
  );
}
export default WaitingForOpponent;
