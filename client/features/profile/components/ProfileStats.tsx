"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { 
  Trophy, 
  Percent, 
  Swords, 
  Frown, 
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
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-border bg-card/40 animate-pulse">
          <div className="h-20 w-20 rounded-2xl bg-secondary shrink-0" />
          <div className="space-y-2 flex-1 w-full text-center sm:text-left">
            <div className="h-6 w-1/3 rounded bg-secondary mx-auto sm:mx-0" />
            <div className="h-4 w-1/4 rounded bg-secondary mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border border-border bg-card p-5" />
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
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-muted-foreground bg-secondary/40 border-border";
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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* User Avatar */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dbUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${dbUser?.username || 'user'}`}
                alt={dbUser?.username || "User"}
                className="h-20 w-20 rounded-2xl border border-border bg-zinc-950 object-cover shadow-inner shrink-0"
              />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground border-2 border-card">
                🏆
              </span>
            </div>

            {/* User Meta */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {dbUser?.displayName || dbUser?.username}
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                @{dbUser?.username || "challenger"}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1 font-mono font-bold text-primary">
                  <Shield className="h-3.5 w-3.5" /> Rank #{rank > 0 ? rank : "Unranked"}
                </span>
                <span className="hidden sm:inline text-zinc-700">•</span>
                <span className="font-mono">Joined: {formatDate(dbUser?.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link
              href="/leaderboard"
              className="inline-flex h-9 items-center gap-1.5 border border-border/80 rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-foreground hover:bg-zinc-800 transition-colors font-mono cursor-pointer"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global Rank */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Global Rank
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">#{rank > 0 ? rank : "-"}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              Arena Standing
            </p>
          </div>
        </div>

        {/* Quizzes Played */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Quizzes Played
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{quizzesPlayed}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              Completed Quizzes
            </p>
          </div>
        </div>

        {/* Best Score */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Best Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{bestScore > 0 ? bestScore : (bestRank && bestRank > 0 ? `#${bestRank}` : "-")}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              {bestScore > 0 ? "Highest Score" : "Best Placement"}
            </p>
          </div>
        </div>

        {/* Answer Accuracy */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Accuracy
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{accuracy}%</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              {totalCorrect} / {totalQuestions} Correct
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Edit Settings & Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Edit Settings (Left 2 cols) */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">Profile Settings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Customize your public-facing information.</p>
          </div>

          <div className="space-y-4">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your public display name"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold cursor-pointer disabled:opacity-55 font-mono"
            >
              {updateProfileMutation.isPending ? (
                <>Saving...</>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
            {saveSuccess && (
              <span className="text-xs font-bold font-mono text-emerald-400 animate-pulse">
                Profile updated successfully.
              </span>
            )}
          </div>
        </div>

        {/* Account Details (Right 1 col) */}
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Security & Account</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Clerk authenticated information.</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email Address</span>
                <span className="text-foreground flex items-center gap-1.5 overflow-hidden text-ellipsis">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  {dbUser?.email || "Guest Account"}
                </span>
              </div>

              <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Username ID</span>
                <span className="text-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                  {dbUser?.username || "no-username"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">System Status</span>
                <span className="text-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono pt-4 border-t border-border/40">
            Account ID: {dbUser?._id || dbUser?.id || "N/A"}
          </div>
        </div>
      </div>

      {/* 4. Recent Completed Quizzes Log */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-lg font-bold text-foreground">Recent Quiz Activity</h3>
          <span className="text-xs text-muted-foreground font-mono">
            Showing last {recentBattles.length} completed quizzes
          </span>
        </div>

        {recentBattles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed border-border rounded-xl bg-background/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground mb-3">
              <HelpCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-foreground">No completed quizzes recorded</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Join or host a quiz room to record your performance stats!
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-background/40 hover:bg-background/80 transition-all duration-200"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-foreground text-sm">
                        {battle.topic} ({battle.questionCount} Qs)
                      </span>
                      {battle.difficulty && (
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono", getDifficultyColor(battle.difficulty))}>
                          {battle.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span className="font-medium text-foreground/80 font-sans">
                        {isSolo ? "Solo Quiz" : `${totalPlayers} Participants`}
                      </span>
                      <span>•</span>
                      <span className="text-foreground/90 font-bold font-mono">
                        Score: {battle.userScore}
                      </span>
                      {battle.userAccuracy !== undefined && (
                        <>
                          <span>•</span>
                          <span>{battle.userAccuracy}% Accuracy</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDuration(battle.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {isSolo ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 font-mono">
                        <Award className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : userRank === 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400 font-mono">
                        <Trophy className="h-3.5 w-3.5" /> Rank #1
                      </span>
                    ) : userRank === 2 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-300/15 border border-slate-300/30 px-3 py-1 text-xs font-bold text-slate-200 font-mono">
                        🥈 Rank #2
                      </span>
                    ) : userRank === 3 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-700/15 border border-amber-700/30 px-3 py-1 text-xs font-bold text-amber-500 font-mono">
                        🥉 Rank #3
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-400 font-mono">
                        Rank #{userRank}
                      </span>
                    )}

                    <Link
                      href={`/results/${battle._id}`}
                      className="inline-flex h-8 items-center gap-1 border border-border/80 rounded-md bg-zinc-900 px-3 text-xs font-semibold text-foreground hover:bg-zinc-800 transition-colors cursor-pointer font-mono"
                    >
                      Results <ExternalLink className="h-3 w-3" />
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
