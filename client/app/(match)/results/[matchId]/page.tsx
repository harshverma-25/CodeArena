"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useMatch } from "@/features/match/hooks/useMatch";
import { useBattleStore } from "@/store/battleStore";
import { Button } from "@/components/ui/button";
import { Trophy, Frown, Award, Clock, Home, RefreshCw, BarChart2, BookOpen, CheckCircle2 } from "lucide-react";

export default function MatchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { data: dbUser, isLoading: userLoading } = useCurrentUser();
  const { data: match, isLoading: matchLoading } = useMatch(matchId);

  const { resetBattle } = useBattleStore();

  useEffect(() => {
    // Reset store states when visiting results to clear lobby connections
    resetBattle();
  }, [resetBattle]);

  if (userLoading || matchLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        Generating battle report cards...
      </div>
    );
  }

  if (!match || !dbUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-4">
        <Frown className="h-8 w-8 text-rose-500" />
        <span>Match result not found or expired.</span>
        <Button onClick={() => router.push("/dashboard")} className="font-mono text-xs">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const opponent = match.players.find((p) => p.user?._id !== dbUser._id)?.user;
  const opponentName = opponent?.displayName || opponent?.username || "Opponent";

  // Match outcome definition
  let outcome: "victory" | "defeat" | "draw" = "draw";
  if (match.winner) {
    outcome = match.winner._id === dbUser._id ? "victory" : "defeat";
  }

  const outcomeDetails = {
    victory: {
      title: "Victory",
      desc: "You outperformed the arena! Keep the streak hot.",
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/35 shadow-amber-500/5",
      icon: <Trophy className="h-12 w-12 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />,
    },
    defeat: {
      title: "Defeat",
      desc: "An honorable battle. Analyze your answers to improve.",
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/35 shadow-rose-500/5",
      icon: <Frown className="h-12 w-12 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />,
    },
    draw: {
      title: "Draw",
      desc: "Equal scores achieved across the battle questions.",
      colorClass: "text-zinc-400 bg-zinc-500/10 border-zinc-500/35 shadow-zinc-500/5",
      icon: <Award className="h-12 w-12 text-zinc-400" />,
    },
  };

  const currentOutcome = outcomeDetails[outcome];

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground p-6 md:p-10 flex flex-col items-center overflow-y-auto scrollbar-thin">
      <div className="w-full max-w-5xl space-y-8 flex-1 flex flex-col">
        {/* Outcome Card */}
        <div className={`p-8 border rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-2xl backdrop-blur-md shrink-0 ${currentOutcome.colorClass}`}>
          <div className="shrink-0">{currentOutcome.icon}</div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h1 className="text-3xl font-black font-mono uppercase tracking-wider">
              {currentOutcome.title}
            </h1>
            <p className="text-sm opacity-85 leading-relaxed max-w-xl">
              {currentOutcome.desc}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-zinc-900 border border-border/80 text-foreground hover:bg-zinc-800 font-mono text-xs uppercase tracking-wider gap-1.5 h-10 px-5 rounded-lg shadow-sm"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <div className="bg-zinc-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col font-mono text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Opponent</span>
              <span className="font-black text-foreground mt-0.5 max-w-[200px] truncate">
                {opponentName}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col font-mono text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Total Duration</span>
              <span className="font-black text-foreground mt-0.5">
                {match.duration ? `${Math.floor(match.duration / 60)}m ${match.duration % 60}s` : "Finished"}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col font-mono text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Topic</span>
              <span className="font-black text-foreground mt-0.5 uppercase">
                {match.problem?.topic || "Technical"}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="flex-1 flex flex-col bg-zinc-900/60 border border-border/60 rounded-2xl p-8 shadow-xl items-center justify-center text-center gap-4">
          <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-foreground">Battle Complete</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Old code editor comparison has been removed. Full MCQ question-by-question review, answer breakdown, and scoring will be populated here in the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
