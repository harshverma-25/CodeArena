"use client";

import React from "react";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Global rankings of players based on completed quizzes, score, and accuracy.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
        <LeaderboardTable />
      </div>
    </div>
  );
}
