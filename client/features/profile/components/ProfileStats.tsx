"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { 
  Trophy, 
  Percent, 
  Award,
  Activity,
  Mail,
  User as UserIcon,
  Shield,
  Save,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getOfflineAvatarDataUri } from "@/components/ui/PlayerAvatars";

export function ProfileStats() {
  const { data: dbUser, isLoading: dbUserLoading } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile("me");
  const updateProfileMutation = useUpdateProfile();

  const [userDisplayName, setDisplayName] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const displayName = userDisplayName ?? dbUser?.displayName ?? "";

  if (dbUserLoading || profileLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_#000] animate-pulse">
          <div className="h-20 w-20 rounded-2xl bg-stone-200 border-2 border-black shrink-0" />
          <div className="space-y-2 flex-1 w-full text-center sm:text-left">
            <div className="h-6 w-1/3 rounded-xl bg-stone-200 mx-auto sm:mx-0" />
            <div className="h-4 w-1/4 rounded-xl bg-stone-200 mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] p-4" />
          ))}
        </div>
      </div>
    );
  }

  const quizzesPlayed = profile?.quizzesPlayed ?? profile?.battlesPlayed ?? 0;
  const bestScore = profile?.bestScore ?? 0;
  const bestRank = profile?.bestRank;
  const avgScore = profile?.avgScore ?? 0;
  const battlesPlayed = profile?.battlesPlayed || 0;
  const wins = profile?.wins || 0;
  const losses = profile?.losses || 0;
  const draws = profile?.draws || 0;
  const totalCorrect = profile?.totalCorrect || 0;
  const totalQuestions = profile?.totalQuestions || 0;
  const accuracy = profile?.accuracy || 0;
  const rank = profile?.rank || 0;
  const recentBattles = profile?.recentBattles || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
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

  const handleSave = () => {
    updateProfileMutation.mutate(
      { displayName },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Profile Header Overview Card */}
      <div className="rounded-[24px] border-[2.5px] border-black bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* User Avatar */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dbUser?.avatar || getOfflineAvatarDataUri(dbUser?.username || "user")}
                alt={dbUser?.username || "User"}
                className="h-20 w-20 rounded-2xl border-2 border-black bg-white object-cover shadow-[2px_2px_0px_#000] shrink-0"
              />
              <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-[#FFE600] border-2 border-black shadow-[1px_1px_0px_#000] text-xs">
                🏆
              </span>
            </div>

            {/* User Meta */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                {dbUser?.displayName || dbUser?.username}
              </h2>
              <p className="text-xs font-mono font-bold text-stone-600">
                @{dbUser?.username || "player"}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-xs pt-1">
                <span className="inline-flex items-center gap-1 font-black text-black bg-[#FEF08A] border-2 border-black px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#000]">
                  <Shield className="h-3.5 w-3.5 stroke-[2.5]" /> Rank #{rank > 0 ? rank : "Unranked"}
                </span>
                <span className="font-bold text-stone-600">Joined: {formatDate(dbUser?.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link
              href="/leaderboard"
              className="inline-flex h-9 items-center gap-1.5 border-2 border-black rounded-xl bg-white hover:bg-stone-50 px-4 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <span>View Leaderboard</span>
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
            <span className="text-3xl font-black text-black font-mono">#{rank > 0 ? rank : "-"}</span>
            <p className="text-[11px] font-bold text-stone-700 mt-0.5">
              Current Placement
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
            <span className="text-3xl font-black text-black font-mono">{quizzesPlayed}</span>
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
            <span className="text-3xl font-black text-black font-mono">{bestScore > 0 ? bestScore : (bestRank && bestRank > 0 ? `#${bestRank}` : "-")}</span>
            <p className="text-[11px] font-bold text-stone-700 mt-0.5">
              {bestScore > 0 ? "Highest Score" : "Best Placement"}
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

      {/* 3. Main Split View: Edit Settings & Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Edit Settings (Left 2 cols) */}
        <div className="md:col-span-2 rounded-[24px] border-[2.5px] border-black bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000] space-y-4">
          <div>
            <h3 className="text-lg font-black text-black">Profile Settings</h3>
            <p className="text-xs font-bold text-stone-600 mt-0.5">Customize your public display name.</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="text-xs font-black text-stone-800 uppercase tracking-wider">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your public display name"
                className="flex h-11 w-full rounded-xl border-2 border-black bg-white px-3.5 py-2 text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {updateProfileMutation.isPending ? (
                <span>Saving...</span>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            {saveSuccess && (
              <span className="text-xs font-black text-emerald-600 animate-pulse">
                Profile updated successfully.
              </span>
            )}
          </div>
        </div>

        {/* Account Details (Right 1 col) */}
        <div className="md:col-span-1 rounded-[24px] border-[2.5px] border-black bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-black text-black">Account Details</h3>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Authentication & system credentials.</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex flex-col gap-0.5 border-b border-stone-200 pb-2">
                <span className="text-[10px] text-stone-500 uppercase font-black tracking-wider">Email Address</span>
                <span className="text-black font-bold flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 stroke-[2.5]" />
                  {dbUser?.email || "Guest Account"}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 border-b border-stone-200 pb-2">
                <span className="text-[10px] text-stone-500 uppercase font-black tracking-wider">Username</span>
                <span className="text-black font-mono font-bold flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 stroke-[2.5]" />
                  {dbUser?.username || "user"}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-stone-500 uppercase font-black tracking-wider">Status</span>
                <span className="inline-flex items-center gap-1.5 font-black text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-stone-500 font-mono font-bold pt-2 border-t border-stone-200">
            ID: {dbUser?._id || dbUser?.id || "N/A"}
          </div>
        </div>
      </div>

      {/* 4. Recent Completed Quizzes Log */}
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
              Play a quiz to record your activity and track your progress!
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

export default ProfileStats;
