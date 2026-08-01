"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Frown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { useMatchHistory } from "../hooks/useMatchHistory";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MatchHistoryTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data: user } = useCurrentUser();
  const { data: historyData, isLoading, isError, error, refetch } = useMatchHistory(page, limit);

  const formatDuration = (seconds?: number) => {
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
      hour: "2-digit",
      minute: "2-digit"
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
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-6 w-48 rounded bg-secondary animate-pulse" />
          <div className="h-9 w-28 rounded bg-secondary animate-pulse" />
        </div>
        <div className="rounded-2xl border border-border bg-card/50 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 border-b border-border/40 gap-4 last:border-0">
              <div className="flex-1 space-y-2 w-full">
                <div className="h-5 w-1/3 rounded bg-secondary animate-pulse" />
                <div className="h-4 w-1/4 rounded bg-secondary animate-pulse" />
              </div>
              <div className="h-9 w-24 rounded bg-secondary animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-border rounded-2xl bg-card text-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Failed to load history</h3>
          <p className="text-sm text-muted-foreground">{error?.message || "An unexpected error occurred."}</p>
        </div>
        <Button onClick={() => refetch()} variant="secondary" className="text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  const matches = historyData?.matches || [];
  const totalMatches = historyData?.total || 0;
  const totalPages = Math.ceil(totalMatches / limit) || 1;

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const myId = user?._id || user?.id;

  return (
    <div className="flex flex-col gap-6">
      {/* Table Header Filter controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Match Log</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing {matches.length} of {totalMatches} battles played
          </p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
          <span className="text-xs text-muted-foreground shrink-0">Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 w-20 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {matches.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-card/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary border border-border text-muted-foreground mb-4">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No matches found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            You haven't participated in any coding challenges yet. Host a battle or join one to test your speed!
          </p>
          <Link href="/dashboard" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors">
            Start a Battle
          </Link>
        </div>
      ) : (
        /* Table Grid Card list */
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card/40 overflow-hidden divide-y divide-border/60">
            {matches.map((match) => {
              const isWinner = match.winner?._id === myId || (match.winner && myId && match.winner._id === myId);
              const opponent = match.players.find(
                (p) => p.user && p.user._id !== myId
              )?.user || null;

              return (
                <div
                  key={match._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 hover:bg-secondary/15 transition-all duration-200"
                >
                  {/* Info Section */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-foreground text-sm sm:text-base tracking-tight truncate max-w-[280px] sm:max-w-md">
                        {match.problem?.title || "Unknown Problem"}
                      </span>
                      {match.problem?.difficulty && (
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0", getDifficultyColor(match.problem.difficulty))}>
                          {match.problem.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {opponent?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={opponent.avatar}
                            alt={opponent.username}
                            className="h-4.5 w-4.5 rounded border border-border bg-zinc-950 object-cover shrink-0"
                          />
                        ) : (
                          <span className="h-4.5 w-4.5 rounded border border-border bg-zinc-950 flex items-center justify-center text-[9px] font-bold text-zinc-500 uppercase shrink-0 font-mono">
                            {(opponent?.displayName || opponent?.username || "?").slice(0, 2)}
                          </span>
                        )}
                        <span className="font-medium text-foreground/80">
                          vs {opponent?.displayName || opponent?.username || "Guest Challenger"}
                        </span>
                      </div>
                      <span className="hidden sm:inline text-zinc-600">|</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-zinc-500" /> {formatDuration(match.duration)}
                      </span>
                      <span className="hidden sm:inline text-zinc-600">|</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" /> {formatDate(match.startedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Verdict & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 self-stretch md:self-auto border-t md:border-t-0 border-border/40 pt-3 md:pt-0">
                    <div className="md:text-right shrink-0">
                      {match.status === "completed" ? (
                        isWinner ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 border border-success/30 px-3 py-1 text-xs font-bold text-success">
                            <Trophy className="h-3.5 w-3.5" /> Victory
                          </span>
                        ) : match.winner ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400">
                            <Frown className="h-3.5 w-3.5" /> Defeat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
                            Draw
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-500">
                          Aborted
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/results/${match._id}`}
                      className="inline-flex h-9 items-center gap-1 border border-border/80 rounded-md bg-zinc-900/60 px-3.5 text-xs font-semibold text-foreground hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Results <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-2">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="gap-1 cursor-pointer font-mono text-xs disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className="gap-1 cursor-pointer font-mono text-xs disabled:opacity-50"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default MatchHistoryTable;
