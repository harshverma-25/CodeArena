"use client";

import React from "react";
import Link from "next/link";
import { 
  Trophy, 
  Shield, 
  Clock, 
  Award, 
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  ArrowLeft,
  Activity,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PublicUserProfile } from "@/types";

import { getOfflineAvatarDataUri } from "@/components/ui/PlayerAvatars";

interface PublicProfileViewProps {
  profile: PublicUserProfile;
}

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  const {
    username,
    displayName,
    avatar,
    joinedAt,
    rank,
    battlesPlayed,
    quizzesPlayed,
    bestScore,
    bestRank,
    wins,
    losses,
    draws,
    totalCorrect,
    totalQuestions,
    accuracy,
    isCurrentUser,
    recentBattles,
  } = profile;

  const totalQuizzes = quizzesPlayed ?? battlesPlayed ?? 0;
  const highestScore = bestScore ?? 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
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

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Card */}
      <div className="rounded-[24px] border-[2.5px] border-black bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* User Avatar */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar || getOfflineAvatarDataUri(username || "player")}
                alt={username}
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 rounded-2xl border-2 border-black bg-white object-cover shadow-[2px_2px_0px_#000] shrink-0"
              />
              {rank > 0 && rank <= 3 && (
                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-[#FFE600] border-2 border-black shadow-[1px_1px_0px_#000] text-xs">
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                </span>
              )}
            </div>

            {/* User Meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                  {displayName || username}
                </h2>
                {isCurrentUser && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              <p className="text-xs font-mono font-bold text-stone-600">
                @{username}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-xs pt-1">
                <span className="inline-flex items-center gap-1 font-black text-black bg-[#FEF08A] border-2 border-black px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#000]">
                  <Shield className="h-3.5 w-3.5 stroke-[2.5]" /> Rank #{rank > 0 ? rank : "Unranked"}
                </span>
                <span className="font-bold text-stone-600">Joined: {formatDate(joinedAt)}</span>
              </div>
            </div>
          </div>

          {/* Back Action */}
          <div className="shrink-0 flex gap-2">
            <Link
              href="/leaderboard"
              className="inline-flex h-9 items-center gap-1.5 border-2 border-black rounded-xl bg-white hover:bg-stone-50 px-4 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Back to Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global Rank */}
        <div className="rounded-2xl border-2 border-black bg-[#FEF08A] p-4 sm:p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-800 uppercase tracking-wider">
              Global Rank
            </span>
            <div className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[1px_1px_0px_#000]">
              <Trophy className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-black font-mono">
              #{rank > 0 ? rank : "-"}
            </span>
            <p className="text-[11px] font-bold text-stone-700 mt-0.5">
              Current Standing
            </p>
          </div>
        </div>

        {/* Quizzes Played */}
        <div className="rounded-2xl border-2 border-black bg-[#DDD6FE] p-4 sm:p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-800 uppercase tracking-wider">
              Quizzes Played
            </span>
            <div className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[1px_1px_0px_#000]">
              <Award className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-black font-mono">{totalQuizzes}</span>
            <p className="text-[11px] font-bold text-stone-700 mt-0.5">
              Completed Battles
            </p>
          </div>
        </div>

        {/* Best Score */}
        <div className="rounded-2xl border-2 border-black bg-[#CFFAFE] p-4 sm:p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-800 uppercase tracking-wider">
              Best Score
            </span>
            <div className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[1px_1px_0px_#000]">
              <Activity className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-black font-mono">
              {highestScore > 0 ? highestScore : (bestRank && bestRank > 0 ? `#${bestRank}` : "-")}
            </span>
            <p className="text-[11px] font-bold text-stone-700 mt-0.5">
              {highestScore > 0 ? "Highest Score" : "Best Placement"}
            </p>
          </div>
        </div>

        {/* Answer Accuracy */}
        <div className="rounded-2xl border-2 border-black bg-[#A7F3D0] p-4 sm:p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-800 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[1px_1px_0px_#000]">
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-black font-mono">{accuracy}%</span>
            <p className="text-[11px] font-bold text-stone-700 mt-0.5">
              {totalCorrect} / {totalQuestions} Correct
            </p>
          </div>
        </div>
      </div>

      {/* 3. Recent Quiz Activity Section */}
      <div className="rounded-[24px] border-[2.5px] border-black bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <h3 className="text-lg font-black text-black">Recent Quiz Activity</h3>
          <span className="text-xs font-bold text-stone-600">
            Last {recentBattles.length} sessions
          </span>
        </div>

        {recentBattles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF08A] border-2 border-black text-black mb-2 shadow-[1px_1px_0px_#000]">
              <HelpCircle className="h-5 w-5 stroke-[2.5]" />
            </div>
            <p className="text-sm font-black text-black">No completed quizzes recorded</p>
            <p className="text-xs font-bold text-stone-600 max-w-sm mt-0.5">
              This challenger has not completed any quizzes yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBattles.map((battle) => {
              const totalPlayers = battle.totalPlayers || battle.players?.length || (battle.opponent ? 2 : 1);
              const isSolo = totalPlayers === 1 || battle.result === "COMPLETED";
              const userRank = battle.userRank || (battle.result === "VICTORY" ? 1 : battle.result === "DEFEAT" ? 2 : 1);

              return (
                <div
                  key={battle._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-black text-sm sm:text-base">
                        {battle.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#DDD6FE] border border-black text-[10px] font-black text-black">
                        {battle.questionCount} Qs
                      </span>
                      {battle.difficulty && (
                        <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono", getDifficultyColor(battle.difficulty))}>
                          {battle.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs font-mono font-bold text-stone-700">
                      <span>{isSolo ? "Solo Quiz" : `${totalPlayers} Players`}</span>
                      <span>•</span>
                      <span className="text-black font-black">Score: {battle.userScore} pts</span>
                      {battle.userAccuracy !== undefined && (
                        <>
                          <span>•</span>
                          <span>{battle.userAccuracy}% Accuracy</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 stroke-[2.5]" /> {formatDuration(battle.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {isSolo ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#A7F3D0] border-2 border-black px-2.5 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                        <Award className="h-3.5 w-3.5 stroke-[2.5]" /> Completed
                      </span>
                    ) : userRank === 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE600] border-2 border-black px-2.5 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                        👑 Rank #1
                      </span>
                    ) : userRank === 2 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 border-2 border-black px-2.5 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                        🥈 Rank #2
                      </span>
                    ) : userRank === 3 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 border-2 border-black px-2.5 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_#000]">
                        🥉 Rank #3
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF7EE] border-2 border-black px-2.5 py-0.5 text-xs font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                        Rank #{userRank}
                      </span>
                    )}

                    <Link
                      href={`/results/${battle._id}`}
                      className="inline-flex h-8 items-center gap-1 border-2 border-black rounded-xl bg-white hover:bg-stone-50 px-3 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                    >
                      <span>Results</span>
                      <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProfileView;
