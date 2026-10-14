"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Percent
} from "lucide-react";

import { useLeaderboard } from "../hooks/useLeaderboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getOfflineAvatarDataUri } from "@/components/ui/PlayerAvatars";

export function LeaderboardTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data: leaderboardData, isLoading, isError, error, refetch } = useLeaderboard(page, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="h-6 w-48 rounded-xl bg-stone-200 border-2 border-black animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-stone-200 border-2 border-black animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] gap-4">
              <div className="flex items-center gap-3.5 flex-1">
                <div className="h-9 w-9 rounded-xl bg-stone-200 border-2 border-black animate-pulse shrink-0" />
                <div className="h-10 w-10 rounded-xl bg-stone-200 border-2 border-black animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-1/3 rounded bg-stone-200 animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-stone-200 animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-24 rounded-xl bg-stone-200 border-2 border-black animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-black rounded-[24px] bg-white text-center gap-4 shadow-[4px_4px_0px_#000]">
        <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
          <AlertCircle className="h-6 w-6 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-lg font-black text-black mb-1">Failed to Load Leaderboard</h3>
          <p className="text-xs font-bold text-stone-600">{error?.message || "An unexpected network error occurred."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
        >
          Try Again
        </button>
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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE600] border-2 border-black text-black font-black text-sm shadow-[2px_2px_0px_#000]">
            👑
          </span>
        );
      case 2:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-200 border-2 border-black text-black font-black text-sm shadow-[2px_2px_0px_#000]">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200 border-2 border-black text-black font-black text-sm shadow-[2px_2px_0px_#000]">
            🥉
          </span>
        );
      default:
        return (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF7EE] text-black border-2 border-black font-mono font-black text-xs shadow-[1px_1px_0px_#000]">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Current User Rank Banner (if authenticated) */}
      {currentUserRank && (
        <div className="rounded-[24px] border-[2.5px] border-black bg-[#FEF08A] p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#FFE600] font-mono font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-black text-base">Your Arena Standing</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full border border-black">
                  You
                </span>
              </div>
              <p className="text-xs text-stone-800 font-bold mt-0.5">
                {currentUserRank.wins} Wins • {currentUserRank.battlesPlayed} Battles • {currentUserRank.accuracy}% Accuracy
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/profile/${currentUserRank.username}`)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            View Your Profile
          </button>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-lg font-black tracking-tight text-black flex items-center gap-2">
            Arena Rankings
          </h2>
          <p className="text-xs font-bold text-stone-600">
            Showing {players.length} of {totalPlayers} competitive contenders
          </p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
          <span className="text-xs font-black text-stone-700 shrink-0">Rows:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 w-20 rounded-xl border-2 border-black bg-white px-2.5 py-1 text-xs font-mono font-black text-black shadow-[2px_2px_0px_#000] focus:outline-none cursor-pointer"
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
        <div className="flex flex-col items-center justify-center text-center py-14 px-4 border-[2.5px] border-black rounded-[24px] bg-white shadow-[4px_4px_0px_#000]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF08A] border-2 border-black text-black mb-3 shadow-[2px_2px_0px_#000]">
            <HelpCircle className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-black text-black mb-1">No players ranked yet</h3>
          <p className="text-xs font-bold text-stone-600 max-w-sm mb-5">
            Be the first contender to play a quiz and claim rank #1 on the leaderboard!
          </p>
          <Link
            href="/categories"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black px-5 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            Start a Quiz
          </Link>
        </div>
      ) : (
        /* Table / List */
        <div className="flex flex-col gap-3">
          {/* Table Header Bar */}
          <div className="hidden md:flex items-center justify-between px-5 py-2.5 bg-[#FAF7EE] border-2 border-black rounded-xl font-black text-xs text-stone-800 uppercase tracking-wider shadow-[2px_2px_0px_#000]">
            <div className="w-16">Rank</div>
            <div className="flex-1">Player</div>
            <div className="w-24 text-center">Wins</div>
            <div className="w-28 text-center">Battles</div>
            <div className="w-28 text-center">Accuracy</div>
            <div className="w-24 text-right">Profile</div>
          </div>

          <div className="space-y-2.5">
            {players.map((player) => (
              <div
                key={player.userId}
                onClick={() => router.push(`/profile/${player.username}`)}
                className={cn(
                  "flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-all duration-150 cursor-pointer relative gap-3.5",
                  player.isCurrentUser && "bg-[#FEF08A]/30 border-black ring-2 ring-black"
                )}
              >
                {/* Left Side: Rank & Player Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="shrink-0 flex items-center justify-center w-10">
                    {getRankBadge(player.rank)}
                  </div>

                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={player.avatar || getOfflineAvatarDataUri(player.username || "player")}
                      alt={player.username}
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-10 rounded-xl border-2 border-black bg-white object-cover shadow-[1px_1px_0px_#000] shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-black text-sm sm:text-base hover:underline truncate">
                          {player.displayName || player.username}
                        </span>
                        {player.isCurrentUser && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono font-bold text-stone-500 truncate">
                        @{player.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Stats Columns */}
                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 self-stretch md:self-auto border-t md:border-t-0 border-stone-200 pt-2.5 md:pt-0 text-xs">
                  {/* Wins */}
                  <div className="md:w-24 text-center">
                    <span className="text-stone-500 md:hidden block text-[10px] uppercase font-black">Wins</span>
                    <span className="font-black text-[#0D9488] text-sm">{player.wins}</span>
                  </div>

                  {/* Battles Played */}
                  <div className="md:w-28 text-center">
                    <span className="text-stone-500 md:hidden block text-[10px] uppercase font-black">Battles</span>
                    <span className="font-black text-black text-sm">{player.battlesPlayed}</span>
                  </div>

                  {/* Accuracy */}
                  <div className="md:w-28 text-center">
                    <span className="text-stone-500 md:hidden block text-[10px] uppercase font-black">Accuracy</span>
                    <span className="inline-flex items-center gap-0.5 font-black text-stone-800 text-sm">
                      <Percent className="h-3 w-3 stroke-[3]" />
                      {player.accuracy}%
                    </span>
                  </div>

                  {/* Profile Action */}
                  <div className="md:w-24 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/profile/${player.username}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-3 pt-2">
              <span className="text-xs font-black text-stone-700">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5 stroke-[3]" /> Prev
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LeaderboardTable;
