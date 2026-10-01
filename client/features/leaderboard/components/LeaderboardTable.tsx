"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trophy, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Percent,
  Swords,
  UserCheck
} from "lucide-react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LeaderboardTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data: leaderboardData, isLoading, isError, error, refetch } = useLeaderboard(page, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-6 w-48 rounded bg-secondary animate-pulse" />
          <div className="h-9 w-28 rounded bg-secondary animate-pulse" />
        </div>
        <div className="rounded-2xl border border-border bg-card/50 overflow-hidden divide-y divide-border/60">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-5 gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-8 w-8 rounded-xl bg-secondary animate-pulse shrink-0" />
                <div className="h-10 w-10 rounded-xl bg-secondary animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 rounded bg-secondary animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-secondary animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-24 rounded bg-secondary animate-pulse shrink-0" />
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
          <h3 className="text-lg font-bold text-foreground mb-1">Failed to load leaderboard</h3>
          <p className="text-sm text-muted-foreground">{error?.message || "An unexpected error occurred."}</p>
        </div>
        <Button onClick={() => refetch()} variant="secondary" className="text-xs font-mono">
          Try Again
        </Button>
      </div>
    );
  }

  const players = leaderboardData?.leaderboard || [];
  const totalPlayers = leaderboardData?.total || 0;
  const totalPages = Math.ceil(totalPlayers / limit) || 1;
  const currentUserRank = leaderboardData?.currentUserRank;

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono font-black text-sm shadow-md shadow-amber-500/10">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-300/20 border-2 border-slate-300 text-slate-200 font-mono font-black text-sm shadow-md">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700/20 border-2 border-amber-600 text-amber-500 font-mono font-black text-sm shadow-md">
            🥉
          </span>
        );
      default:
        return (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground border border-border font-mono font-bold text-xs">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Current User Rank Card Banner (if authenticated) */}
      {currentUserRank && (
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-mono font-black text-lg shadow-md">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-foreground text-base">Your Standing</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                  You
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {currentUserRank.wins} Wins • {currentUserRank.battlesPlayed} Battles • {currentUserRank.accuracy}% Accuracy
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push(`/profile/${currentUserRank.username}`)}
            className="bg-zinc-900 border border-border/80 text-foreground hover:bg-zinc-800 font-mono text-xs cursor-pointer shrink-0"
          >
            View Profile
          </Button>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Global Rankings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing {players.length} of {totalPlayers} competitive arena players
          </p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
          <span className="text-xs text-muted-foreground shrink-0 font-mono">Rows per page:</span>
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

      {players.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-card/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary border border-border text-muted-foreground mb-4">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No players found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Be the first contender to play and claim rank 1 on the global leaderboard!
          </p>
          <Link href="/battle/new" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors font-mono">
            Start a Battle
          </Link>
        </div>
      ) : (
        /* Table Grid */
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card/40 overflow-hidden divide-y divide-border/60 shadow-xl">
            {/* Table Header Row */}
            <div className="hidden md:flex items-center justify-between px-6 py-3 bg-secondary/30 font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <div className="w-16">Rank</div>
              <div className="flex-1">Player</div>
              <div className="w-24 text-center">Wins</div>
              <div className="w-28 text-center">Battles</div>
              <div className="w-28 text-center">Accuracy</div>
              <div className="w-24 text-right">Profile</div>
            </div>

            {players.map((player) => (
              <div
                key={player.userId}
                onClick={() => router.push(`/profile/${player.username}`)}
                className={cn(
                  "flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 gap-4 hover:bg-secondary/20 transition-all duration-200 cursor-pointer relative",
                  player.isCurrentUser && "bg-primary/10 border-l-4 border-l-primary"
                )}
              >
                {/* Left Side: Rank & Player Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="shrink-0 flex items-center justify-center w-10">
                    {getRankBadge(player.rank)}
                  </div>

                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {player.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="h-10 w-10 rounded-xl border border-border bg-zinc-950 object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl border border-border bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-400 text-xs shrink-0">
                        {(player.displayName || player.username || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm sm:text-base hover:underline truncate">
                          {player.displayName || player.username}
                        </span>
                        {player.isCurrentUser && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        @{player.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Stats Columns */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 self-stretch md:self-auto border-t md:border-t-0 border-border/40 pt-3 md:pt-0 font-mono text-xs">
                  {/* Wins */}
                  <div className="md:w-24 text-center">
                    <span className="text-muted-foreground md:hidden block text-[10px] uppercase font-bold">Wins</span>
                    <span className="font-black text-emerald-400 text-sm">{player.wins}</span>
                  </div>

                  {/* Battles Played */}
                  <div className="md:w-28 text-center">
                    <span className="text-muted-foreground md:hidden block text-[10px] uppercase font-bold">Battles</span>
                    <span className="font-bold text-foreground">{player.battlesPlayed}</span>
                  </div>

                  {/* Accuracy */}
                  <div className="md:w-28 text-center">
                    <span className="text-muted-foreground md:hidden block text-[10px] uppercase font-bold">Accuracy</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                      <Percent className="h-3 w-3" />
                      {player.accuracy}%
                    </span>
                  </div>

                  {/* Profile Action */}
                  <div className="md:w-24 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/profile/${player.username}`);
                      }}
                      className="border border-border text-xs hover:bg-secondary/60 cursor-pointer font-mono"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-2">
              <span className="text-xs text-muted-foreground font-mono">
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

export default LeaderboardTable;
