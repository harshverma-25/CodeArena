"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, Trophy, Award, Users, ShieldQuestion, ExternalLink } from "lucide-react";

import { useMatchHistory } from "@/features/history/hooks/useMatchHistory";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function RecentBattles() {
  const { data: historyData, isLoading } = useMatchHistory(1, 5);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
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

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 rounded bg-secondary animate-pulse" />
          <div className="h-4 w-20 rounded bg-secondary animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/3 rounded bg-secondary animate-pulse" />
                <div className="h-3.5 w-1/4 rounded bg-secondary animate-pulse" />
              </div>
              <div className="h-8 w-24 rounded bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const matches = historyData?.matches || [];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Recent Quizzes
        </h2>
        {matches.length > 0 && (
          <Link
            href="/history"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-mono"
          >
            View History <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      {matches.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed border-border rounded-xl bg-background/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground border border-border mb-4">
            <ShieldQuestion className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No quizzes played yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            You haven&apos;t participated in any quizzes yet. Join or host a quiz room to test your speed!
          </p>

          <div className="flex gap-3">
            <Link
              href="/"
              className={buttonVariants({ variant: "primary", className: "cursor-pointer text-xs font-mono" })}
            >
              Start a Quiz
            </Link>
          </div>
        </div>
      ) : (
        /* Matches Table/List */
        <div className="space-y-4 flex-1">
          {matches.map((match) => {
            const totalPlayers = match.totalPlayers || match.players?.length || (match.opponent ? 2 : 1);
            const isSolo = totalPlayers === 1 || match.result === "COMPLETED";
            const userRank = match.userRank || (match.result === "VICTORY" ? 1 : match.result === "DEFEAT" ? 2 : 1);

            return (
              <div
                key={match._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-background/40 hover:bg-background/80 transition-all duration-200"
              >
                {/* Left Side: Topic & Players */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm sm:text-base capitalize">
                      {match.topic || "Technical Quiz"}
                    </span>
                    {match.difficulty && (
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getDifficultyColor(match.difficulty))}>
                        {match.difficulty}
                      </span>
                    )}
                    {match.questionCount && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/60">
                        {match.questionCount} Questions
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <Users className="h-3 w-3 text-zinc-400" />
                      {isSolo ? "Solo Quiz" : `${totalPlayers} Players`}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="flex items-center gap-1 font-mono">
                      Score: <strong className="text-foreground">{match.userScore ?? 0}</strong>
                    </span>
                    {match.userAccuracy !== undefined && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-border" />
                        <span className="font-mono">{match.userAccuracy}% Acc</span>
                      </>
                    )}
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDuration(match.duration)}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(match.startedAt)}
                    </span>
                  </div>
                </div>

                {/* Right Side: Verdict Outcome & Action */}
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    {match.status === "COMPLETED" || match.status === "completed" ? (
                      isSolo ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                          <Award className="h-3 w-3" /> Completed
                        </div>
                      ) : userRank === 1 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 font-mono">
                          <Trophy className="h-3 w-3" /> Rank #1
                        </div>
                      ) : userRank === 2 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-400/10 border border-slate-400/20 px-2.5 py-0.5 text-xs font-bold text-slate-300 font-mono">
                          🥈 Rank #2
                        </div>
                      ) : userRank === 3 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-700/10 border border-amber-700/20 px-2.5 py-0.5 text-xs font-bold text-amber-500 font-mono">
                          🥉 Rank #3
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-bold text-zinc-400 font-mono">
                          Rank #{userRank}
                        </div>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-500 animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/results/${match._id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "border border-border text-xs hover:bg-secondary/40 font-mono",
                    })}
                  >
                    Results
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default RecentBattles;
