"use client";

import React from "react";
import { Timer, Swords, Hash } from "lucide-react";

interface BattleHeaderProps {
  roomCode: string;
  topic: string;
  difficulty: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  timePerQuestion: number;
}

export function BattleHeader({
  roomCode,
  topic,
  difficulty,
  currentQuestionNumber,
  totalQuestions,
  timeRemaining,
}: BattleHeaderProps) {


  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-muted-foreground bg-secondary/40 border-border";
    }
  };

  const progressPercentage =
    totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;

  const isLowTime = timeRemaining <= 5;

  const isMidTime = timeRemaining <= 10 && timeRemaining > 5;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-orange-400 to-primary/40" />

      {/* Main Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Topic and Room Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
            <Swords className="h-3.5 w-3.5" />
            <span>Room: {roomCode}</span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-foreground text-xs font-semibold">
            {topic}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getDifficultyColor(
              difficulty
            )}`}
          >
            {difficulty === "random" ? "Mixed" : difficulty}
          </span>
        </div>

        {/* Visual Countdown Timer */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm tracking-wider transition-colors duration-200 ${
              isLowTime
                ? "bg-rose-500/15 border-rose-500/30 text-rose-500 animate-pulse"
                : isMidTime
                ? "bg-amber-500/15 border-amber-500/30 text-amber-500"
                : "bg-secondary/60 border-border text-foreground"
            }`}
          >
            <Timer className={`h-4 w-4 ${isLowTime ? "animate-spin" : ""}`} />
            <span>{timeRemaining}s</span>
          </div>
        </div>
      </div>

      {/* Question Progress Info & Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground flex items-center gap-1 font-semibold">
            <Hash className="h-3.5 w-3.5 text-primary" />
            Question Progress
          </span>
          <span className="font-bold text-foreground">
            <span className="text-primary text-sm font-extrabold">
              {Math.min(currentQuestionNumber, totalQuestions)}
            </span>{" "}
            / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary/60 rounded-full overflow-hidden border border-border/40">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
export default BattleHeader;
