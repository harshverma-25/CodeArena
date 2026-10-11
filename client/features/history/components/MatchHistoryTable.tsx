"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  Award,
  Users
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
        return "text-black bg-[#A7F3D0] border-2 border-black shadow-[1px_1px_0px_#000]";
      case "medium":
        return "text-black bg-[#FEF08A] border-2 border-black shadow-[1px_1px_0px_#000]";
      case "hard":
        return "text-black bg-[#FECDD3] border-2 border-black shadow-[1px_1px_0px_#000]";
      default:
        return "text-black bg-[#FAF7EE] border-2 border-black shadow-[1px_1px_0px_#000]";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="h-6 w-48 rounded-xl bg-stone-200 border-2 border-black animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-stone-200 border-2 border-black animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] gap-4">
              <div className="flex-1 space-y-2 w-full">
                <div className="h-5 w-1/3 rounded bg-stone-200 animate-pulse" />
                <div className="h-4 w-1/4 rounded bg-stone-200 animate-pulse" />
              </div>
              <div className="h-9 w-24 rounded-xl bg-stone-200 border-2 border-black animate-pulse shrink-0" />
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
          <h3 className="text-lg font-black text-black mb-1">Failed to Load History</h3>
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
    <div className="flex flex-col gap-5">
      {/* Table Header Filter controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-lg font-black tracking-tight text-black">Completed Sessions</h2>
          <p className="text-xs font-bold text-stone-600">
            Showing {matches.length} of {totalMatches} quizzes completed
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

      {matches.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-14 px-4 border-[2.5px] border-black rounded-[24px] bg-white shadow-[4px_4px_0px_#000]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CFFAFE] border-2 border-black text-black mb-3 shadow-[2px_2px_0px_#000]">
            <HelpCircle className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-black text-black mb-1">No completed quizzes yet</h3>
          <p className="text-xs font-bold text-stone-600 max-w-sm mb-5">
            You haven&apos;t completed any quizzes yet. Join or host a quiz room to test your knowledge!
          </p>
          <Link
            href="/categories"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black px-5 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            Start a Quiz
          </Link>
        </div>
      ) : (
        /* Match Cards list */
        <div className="flex flex-col gap-3">
          <div className="space-y-3">
            {matches.map((match) => {
              const totalPlayers = match.totalPlayers || match.players?.length || (match.opponent ? 2 : 1);
              const isSolo = totalPlayers === 1 || match.result === "COMPLETED";

              // Determine rank
              let userRank = match.userRank;
              if (!userRank) {
                if (match.result === "VICTORY" || match.winner?._id === myId || match.winnerId === myId) {
                  userRank = 1;
                } else if (match.result === "DEFEAT") {
                  userRank = 2;
                } else {
                  userRank = 1;
                }
              }

              const topicName = match.topic || "Quiz Challenge";
              const difficultyName = match.difficulty || "Medium";

              return (
                <div
                  key={match._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-all duration-150 gap-4"
                >
                  {/* Info Section */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-black text-base sm:text-lg tracking-tight truncate max-w-[280px] sm:max-w-md">
                        {topicName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DDD6FE] border-2 border-black text-[11px] font-black text-black shadow-[1px_1px_0px_#000]">
                        {match.questionCount || 5} Questions
                      </span>
                      {difficultyName && (
                        <span className={cn("text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 font-mono", getDifficultyColor(difficultyName))}>
                          {difficultyName}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono font-bold text-stone-700">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#CFFAFE] border border-black text-black">
                        <Users className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>{isSolo ? "Solo Quiz" : `${totalPlayers} Players`}</span>
                      </div>
                      <span className="text-black font-black">
                        Score: {match.userScore ?? 0} pts
                      </span>
                      {match.userAccuracy !== undefined && (
                        <span className="text-black">
                          {match.userAccuracy}% Accuracy
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-stone-600">
                        <Clock className="h-3.5 w-3.5 stroke-[2.5]" /> {formatDuration(match.duration)}
                      </span>
                      <span className="flex items-center gap-1 text-stone-600">
                        <Calendar className="h-3.5 w-3.5 stroke-[2.5]" /> {formatDate(match.startedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Verdict & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 self-stretch md:self-auto border-t md:border-t-0 border-stone-200 pt-3 md:pt-0">
                    <div className="md:text-right shrink-0">
                      {match.status === "COMPLETED" || match.status === "completed" ? (
                        isSolo ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#A7F3D0] border-2 border-black px-3 py-1 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" /> Completed
                          </span>
                        ) : userRank === 1 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE600] border-2 border-black px-3 py-1 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                            👑 Rank #1
                          </span>
                        ) : userRank === 2 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 border-2 border-black px-3 py-1 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                            🥈 Rank #2
                          </span>
                        ) : userRank === 3 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 border-2 border-black px-3 py-1 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                            🥉 Rank #3
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF7EE] border-2 border-black px-3 py-1 text-xs font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                            Rank #{userRank}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF08A] border-2 border-black px-3 py-1 text-xs font-black text-black">
                          {match.status}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/results/${match._id}`}
                      className="inline-flex h-9 items-center gap-1.5 border-2 border-black rounded-xl bg-white hover:bg-stone-50 px-3.5 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                    >
                      <span>Breakdown</span>
                      <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
export default MatchHistoryTable;
