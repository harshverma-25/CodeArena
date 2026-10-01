"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Frown, Award, Clock, BookOpen, Layers, Home, RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BattleResultDetails } from "@/types";

interface BattleResultsHeaderProps {
  results: BattleResultDetails;
}

export function BattleResultsHeader({ results }: BattleResultsHeaderProps) {
  const { userPlayer, opponentPlayer, result, topic, difficulty, duration, roomCode, startedAt } = results;

  const outcomeConfig = {
    VICTORY: {
      title: "VICTORY!",
      desc: "Outstanding performance! You conquered this battle arena.",
      bannerBg: "from-amber-500/15 via-primary/10 to-amber-500/5 border-amber-500/30",
      iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-amber-500/10",
      icon: <Trophy className="h-10 w-10 text-amber-400 animate-bounce" />,
      badgeBg: "bg-amber-400 text-amber-950 font-black",
    },
    DEFEAT: {
      title: "DEFEAT",
      desc: "An honorable battle. Review your question breakdown to sharpen your skills.",
      bannerBg: "from-rose-500/15 via-zinc-900/40 to-rose-500/5 border-rose-500/30",
      iconBg: "bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-rose-500/10",
      icon: <Frown className="h-10 w-10 text-rose-400" />,
      badgeBg: "bg-rose-500 text-rose-950 font-black",
    },
    DRAW: {
      title: "IT'S A DRAW!",
      desc: "Incredible match! Both contenders achieved identical final scores.",
      bannerBg: "from-primary/15 via-indigo-950/40 to-primary/5 border-primary/30",
      iconBg: "bg-primary/15 text-primary border-primary/40 shadow-primary/10",
      icon: <Award className="h-10 w-10 text-primary" />,
      badgeBg: "bg-primary text-primary-foreground font-black",
    },
    IN_PROGRESS: {
      title: "IN PROGRESS",
      desc: "This battle is still ongoing.",
      bannerBg: "from-blue-500/15 to-blue-500/5 border-blue-500/30",
      iconBg: "bg-blue-500/15 text-blue-400 border-blue-500/40",
      icon: <Award className="h-10 w-10 text-blue-400" />,
      badgeBg: "bg-blue-500 text-blue-950 font-black",
    },
    CANCELLED: {
      title: "CANCELLED",
      desc: "This battle was cancelled before completion.",
      bannerBg: "from-zinc-500/15 to-zinc-500/5 border-zinc-500/30",
      iconBg: "bg-zinc-500/15 text-zinc-400 border-zinc-500/40",
      icon: <Frown className="h-10 w-10 text-zinc-400" />,
      badgeBg: "bg-zinc-500 text-zinc-950 font-black",
    },
  };

  const currentOutcome = outcomeConfig[result] || outcomeConfig.DRAW;

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Outcome Card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border bg-gradient-to-r p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6",
          currentOutcome.bannerBg
        )}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left flex-1 min-w-0">
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border shadow-xl",
              currentOutcome.iconBg
            )}
          >
            {currentOutcome.icon}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h1 className="text-3xl md:text-4xl font-black font-mono tracking-tight uppercase text-foreground">
                {currentOutcome.title}
              </h1>
              <span className={cn("text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full", currentOutcome.badgeBg)}>
                Room {roomCode}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              {currentOutcome.desc}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
          <Link
            href="/history"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-4 text-xs font-bold text-foreground hover:bg-secondary/60 transition-colors font-mono cursor-pointer shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            History
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-4 text-xs font-bold text-foreground hover:bg-secondary/60 transition-colors font-mono cursor-pointer shadow-sm"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/battle/new"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors font-mono cursor-pointer shadow-md shadow-primary/15"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </Link>
        </div>
      </div>

      {/* Players Score Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User Player Scorecard */}
        <div
          className={cn(
            "rounded-2xl border p-5 bg-card/80 backdrop-blur-sm shadow-xl flex items-center justify-between gap-4 relative overflow-hidden",
            userPlayer.isWinner ? "border-emerald-500/50 bg-emerald-950/10 shadow-emerald-500/5" : "border-border"
          )}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {userPlayer.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userPlayer.avatar}
                alt={userPlayer.username}
                className="h-12 w-12 rounded-2xl border border-border bg-zinc-950 object-cover shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl border border-border bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-400 text-sm shrink-0">
                {(userPlayer.displayName || userPlayer.username || "You").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground">
                You
              </span>
              <h3 className="text-base font-extrabold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                {userPlayer.displayName || userPlayer.username || "You"}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {userPlayer.correctCount} / {userPlayer.totalQuestions} Correct
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl sm:text-4xl font-black font-mono text-primary">
              {userPlayer.score}
            </span>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Points
            </p>
          </div>
        </div>

        {/* Opponent Player Scorecard */}
        <div
          className={cn(
            "rounded-2xl border p-5 bg-card/80 backdrop-blur-sm shadow-xl flex items-center justify-between gap-4 relative overflow-hidden",
            opponentPlayer?.isWinner ? "border-emerald-500/50 bg-emerald-950/10 shadow-emerald-500/5" : "border-border"
          )}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {opponentPlayer?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={opponentPlayer.avatar}
                alt={opponentPlayer.username}
                className="h-12 w-12 rounded-2xl border border-border bg-zinc-950 object-cover shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl border border-border bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-400 text-sm shrink-0">
                {(opponentPlayer?.displayName || opponentPlayer?.username || "Opponent").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground">
                Opponent
              </span>
              <h3 className="text-base font-extrabold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                {opponentPlayer?.displayName || opponentPlayer?.username || "Challenger"}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {opponentPlayer?.correctCount || 0} / {results.questionCount} Correct
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl sm:text-4xl font-black font-mono text-foreground">
              {opponentPlayer?.score || 0}
            </span>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Points
            </p>
          </div>
        </div>
      </div>

      {/* Match Spec Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card/40 border border-border/80 p-3.5 rounded-xl flex items-center gap-3 font-mono text-xs">
          <BookOpen className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase">Topic</span>
            <span className="font-bold text-foreground truncate block">{topic}</span>
          </div>
        </div>

        <div className="bg-card/40 border border-border/80 p-3.5 rounded-xl flex items-center gap-3 font-mono text-xs">
          <Layers className="h-4 w-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase">Difficulty</span>
            <span className="font-bold text-foreground capitalize block">{difficulty}</span>
          </div>
        </div>

        <div className="bg-card/40 border border-border/80 p-3.5 rounded-xl flex items-center gap-3 font-mono text-xs">
          <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase">Duration</span>
            <span className="font-bold text-foreground block">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="bg-card/40 border border-border/80 p-3.5 rounded-xl flex items-center gap-3 font-mono text-xs">
          <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block uppercase">Date</span>
            <span className="font-bold text-foreground truncate block">{formatDate(startedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BattleResultsHeader;
