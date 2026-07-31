"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, Trophy, Frown, Sparkles, ExternalLink, HelpCircle, ShieldQuestion } from "lucide-react";
import { useRecentMatches } from "../hooks/useRecentMatches";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function RecentBattles() {
  const { data: user } = useCurrentUser();
  const { data: historyData, isLoading } = useRecentMatches(5);

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
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
          Recent Battles
        </h2>
        {matches.length > 0 && (
          <Link
            href="/history"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
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
          <h3 className="text-lg font-bold text-foreground mb-1">No battles recorded yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            You haven't participated in any coding challenges yet. Host a battle or join one to test your speed!
          </p>
          <div className="flex gap-3">
            <Link
              href="/battle/new"
              className={buttonVariants({ variant: "primary", className: "cursor-pointer text-xs" })}
            >
              Start Battle
            </Link>
          </div>
        </div>
      ) : (
        /* Matches Table/List */
        <div className="space-y-4 flex-1">
          {matches.map((match) => {
            const isWinner = match.winner?._id === user?.id || (match.winner && user && match.winner._id === user.id);
            const opponent = match.players.find(
              (p) => p.user && p.user._id !== user?.id
            )?.user || null;

            return (
              <div
                key={match._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-background/40 hover:bg-background/80 transition-all duration-200"
              >
                {/* Left Side: Problem & Opponent */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      {match.problem?.title || "Unknown Problem"}
                    </span>
                    {match.problem?.difficulty && (
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getDifficultyColor(match.problem.difficulty))}>
                        {match.problem.difficulty}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      Opponent: {opponent?.displayName || opponent?.username || "Guest Challenger"}
                    </span>
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
                    {match.status === "completed" ? (
                      isWinner ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-2.5 py-0.5 text-xs font-bold text-success">
                          <Trophy className="h-3 w-3" /> Victory
                        </div>
                      ) : match.winner ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-xs font-bold text-destructive">
                          <Frown className="h-3 w-3" /> Defeat
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                          Draw
                        </div>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-500 animate-pulse">
                        Aborted
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/match/${match._id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "border border-border text-xs hover:bg-secondary/40",
                    })}
                  >
                    View Room
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
