"use client";

import React from "react";
import { User, Trophy, WifiOff } from "lucide-react";
import { OpponentLiveState } from "../hooks/useLiveBattle";

interface BattleScoreBoardProps {
  myUsername: string;
  myDisplayName?: string;
  myAvatar?: string;
  myScore: number;
  myCurrentQuestionNumber: number;
  totalQuestions: number;
  opponent: OpponentLiveState | null;
}

export function BattleScoreBoard({
  myUsername,
  myDisplayName,
  myAvatar,
  myScore,
  myCurrentQuestionNumber,
  totalQuestions,
  opponent,
}: BattleScoreBoardProps) {
  const myName = myDisplayName || myUsername || "You";
  const oppName = opponent?.displayName || opponent?.username || "Opponent";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      {/* Player 1 Card (You) */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-primary/30 bg-primary/5 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-3">
          {myAvatar ? (
            <img
              src={myAvatar}
              alt={myName}
              className="h-11 w-11 rounded-full border-2 border-primary/40 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary font-mono font-black border border-primary/30">
              {myName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-foreground truncate max-w-[130px]">
                {myName}
              </span>
              <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                YOU
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Question {Math.min(myCurrentQuestionNumber, totalQuestions)} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Your Score */}
        <div className="text-right">
          <div className="text-2xl font-black font-mono text-primary flex items-center gap-1 justify-end">
            <Trophy className="h-4 w-4 text-primary" />
            <span>{myScore}</span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider font-semibold">
            Points
          </span>
        </div>
      </div>

      {/* Player 2 Card (Opponent) */}
      <div
        className={`flex items-center justify-between p-4 rounded-2xl border shadow-md relative overflow-hidden transition-colors ${
          opponent?.isDisconnected
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border bg-card"
        }`}
      >
        <div className="flex items-center gap-3">
          {opponent?.avatar ? (
            <img
              src={opponent.avatar}
              alt={oppName}
              className="h-11 w-11 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground font-mono font-black border border-border">
              {oppName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-foreground truncate max-w-[130px]">
                {oppName}
              </span>
              {opponent?.isDisconnected ? (
                <span className="flex items-center gap-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase animate-pulse">
                  <WifiOff className="h-2.5 w-2.5" />
                  Reconnecting
                </span>
              ) : opponent?.isCompleted ? (
                <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                  Finished
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              {opponent
                ? opponent.isCompleted
                  ? "All questions answered"
                  : `Question ${Math.min((opponent.currentQuestionIndex || 0) + 1, totalQuestions)} of ${totalQuestions}`
                : "Waiting for challenger..."}
            </p>
          </div>
        </div>

        {/* Opponent Score */}
        <div className="text-right">
          <div className="text-2xl font-black font-mono text-foreground flex items-center gap-1 justify-end">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{opponent?.score || 0}</span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider font-semibold">
            Points
          </span>
        </div>
      </div>
    </div>
  );
}
export default BattleScoreBoard;
