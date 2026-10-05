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
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-muted-foreground bg-secondary/40 border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* User Avatar */}
            <div className="relative">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={username}
                  className="h-20 w-20 rounded-2xl border border-border bg-zinc-950 object-cover shadow-inner shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-border bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-400 text-xl shrink-0">
                  {(displayName || username || "?").slice(0, 2).toUpperCase()}
                </div>
              )}
              {rank > 0 && rank <= 3 && (
                <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-400 text-xs shadow-md">
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                </span>
              )}
            </div>

            {/* User Meta */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {displayName || username}
                </h2>
                {isCurrentUser && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                @{username}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1 font-mono font-bold text-primary">
                  <Shield className="h-3.5 w-3.5" /> Rank #{rank > 0 ? rank : "Unranked"}
                </span>
                <span className="hidden sm:inline text-zinc-700">•</span>
                <span className="font-mono">Joined: {formatDate(joinedAt)}</span>
              </div>
            </div>
          </div>

          {/* Back Action */}
          <div className="shrink-0 flex gap-2">
            <Link
              href="/leaderboard"
              className="inline-flex h-9 items-center gap-1.5 border border-border/80 rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-foreground hover:bg-zinc-800 transition-colors font-mono cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global Rank */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Global Rank
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">
              #{rank > 0 ? rank : "-"}
            </span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              Arena Standing
            </p>
          </div>
        </div>

        {/* Quizzes Played */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Quizzes Played
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{totalQuizzes}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              Completed Quizzes
            </p>
          </div>
        </div>

        {/* Best Score */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Best Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">
              {highestScore > 0 ? highestScore : (bestRank && bestRank > 0 ? `#${bestRank}` : "-")}
            </span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              {highestScore > 0 ? "Highest Score" : "Best Placement"}
            </p>
          </div>
        </div>

        {/* Answer Accuracy */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md">
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

      {/* 3. Recent Quiz Activity Section */}
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

export default PublicProfileView;
