"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trophy, Swords, Home, RotateCcw, Award, Meh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BattleResultsPayload } from "@/types";

interface BattleResultsModalProps {
  results: BattleResultsPayload;
  currentUserId?: string;
}

export function BattleResultsModal({ results, currentUserId }: BattleResultsModalProps) {
  const router = useRouter();

  const myPlayer = results.players.find((p) => p.userId === currentUserId);
  const oppPlayer = results.players.find((p) => p.userId !== currentUserId);

  const isWinner = results.winnerId && currentUserId && results.winnerId === currentUserId;
  const isDraw = results.isDraw;
  const isLoser = !isDraw && !isWinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 text-center">
        {/* Top colored accent line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r ${
            isWinner
              ? "from-amber-400 via-primary to-amber-500"
              : isDraw
              ? "from-blue-500 via-indigo-500 to-primary"
              : "from-rose-500 via-zinc-600 to-rose-700"
          }`}
        />

        {/* Victory / Defeat / Draw Icon & Title */}
        <div className="space-y-3 pt-2">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl ${
              isWinner
                ? "bg-amber-500/15 border-2 border-amber-500/40 text-amber-500 shadow-amber-500/10 scale-105"
                : isDraw
                ? "bg-primary/15 border-2 border-primary/40 text-primary shadow-primary/10"
                : "bg-secondary border-2 border-border text-muted-foreground"
            }`}
          >
            {isWinner ? (
              <Trophy className="h-10 w-10 animate-bounce" />
            ) : isDraw ? (
              <Award className="h-10 w-10" />
            ) : (
              <Meh className="h-10 w-10" />
            )}
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {isWinner ? "VICTORY!" : isDraw ? "IT'S A DRAW!" : "DEFEAT"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {isWinner
                ? "Outstanding performance! You conquered this battle arena."
                : isDraw
                ? "Incredible match! Both contenders finished with identical scores."
                : "Good effort! Sharpen your skills and claim victory next time."}
            </p>
          </div>
        </div>

        {/* Players Final Score Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Your Card */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-2 relative overflow-hidden ${
              isWinner
                ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                : "border-border bg-background/50"
            }`}
          >
            {isWinner && (
              <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-mono">
                Winner
              </span>
            )}
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              You
            </p>
            <p className="text-4xl font-black font-mono text-primary">
              {myPlayer?.score || 0}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              Total Score
            </p>
          </div>

          {/* Opponent Card */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-2 relative overflow-hidden ${
              !isDraw && !isWinner
                ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                : "border-border bg-background/50"
            }`}
          >
            {!isDraw && !isWinner && (
              <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-mono">
                Winner
              </span>
            )}
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono truncate">
              {oppPlayer?.displayName || oppPlayer?.username || "Opponent"}
            </p>
            <p className="text-4xl font-black font-mono text-foreground">
              {oppPlayer?.score || 0}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              Total Score
            </p>
          </div>
        </div>

        {/* Match Spec Details */}
        <div className="p-3 rounded-xl border border-border/60 bg-background/40 flex items-center justify-around text-xs font-mono text-muted-foreground">
          <div>
            <span className="opacity-70">Category: </span>
            <span className="font-bold text-foreground">{results.topic}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="opacity-70">Difficulty: </span>
            <span className="font-bold text-foreground capitalize">{results.difficulty}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="border border-border text-foreground hover:bg-secondary/40 h-11 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Dashboard
          </Button>
          <Button
            onClick={() => router.push("/battle/new")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/15 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
export default BattleResultsModal;
