"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBattleStore } from "@/store/battleStore";
import { Wifi, WifiOff, Clock, ShieldAlert, Cpu } from "lucide-react";

interface MatchHeaderProps {
  matchId: string;
  opponentName: string;
  opponentAvatar: string;
}

export function MatchHeader({ matchId, opponentName, opponentAvatar }: MatchHeaderProps) {
  const router = useRouter();
  const {
    isSocketConnected,
    timeRemainingSeconds,
    decrementTime,
    status,
    setStatus,
    opponentProgress,
  } = useBattleStore();

  // Run countdown ticker when match is active
  useEffect(() => {
    if (status !== "active") return;

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, decrementTime]);

  // Handle Match timeout
  useEffect(() => {
    if (status === "active" && timeRemainingSeconds === 0) {
      setStatus("completed");
      router.push(`/results/${matchId}`);
    }
  }, [timeRemainingSeconds, status, matchId, router, setStatus]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemainingSeconds <= 60;

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-zinc-950/85 border-b border-border/80 shadow-md backdrop-blur-md shrink-0">
      {/* Brand & Connection State */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-primary font-mono tracking-widest uppercase">
            CodeArena Battle
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Match ID: {matchId.slice(-8)}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono transition-colors uppercase ${
            isSocketConnected
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse"
          }`}
        >
          {isSocketConnected ? (
            <>
              <Wifi className="h-3 w-3" />
              Live
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-center">
        <div
          className={`flex items-center gap-2.5 px-6 py-2 bg-zinc-900 border rounded-2xl shadow-inner font-mono text-2xl font-black transition-all ${
            isLowTime
              ? "text-rose-500 border-rose-500/35 animate-pulse shadow-rose-500/5 bg-rose-950/10"
              : "text-foreground border-border/60"
          }`}
        >
          <Clock className={`h-6 w-6 ${isLowTime ? "text-rose-500" : "text-primary"}`} />
          {formatTime(timeRemainingSeconds)}
        </div>
      </div>

      {/* Opponent Live Status Card */}
      <div className="flex items-center gap-3 bg-zinc-900/60 border border-border/60 rounded-xl px-4 py-2.5 min-w-[240px]">
        {/* Avatar */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={opponentAvatar || "/placeholder-avatar.png"}
            alt={opponentName}
            className="w-9 h-9 rounded-lg border border-border bg-zinc-950 object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col font-mono text-xs">
          <span className="font-bold text-foreground truncate max-w-[120px]">{opponentName}</span>
          <span className="text-[10px] text-zinc-500">
            {opponentProgress
              ? `Passed ${opponentProgress.testCasesPassed}/${opponentProgress.totalTestCases || "?"}`
              : "No submissions yet"}
          </span>
        </div>

        {/* Action Status Badge */}
        <div className="shrink-0">
          {opponentProgress?.submissionStatus === "running" && (
            <div className="flex items-center gap-1 text-[10px] text-primary animate-pulse font-bold font-mono">
              <Cpu className="h-3 w-3 animate-spin" />
              JUDGING
            </div>
          )}
          {opponentProgress?.submissionStatus === "success" && (
            <span className="px-2 py-0.5 rounded text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-mono uppercase tracking-wider">
              Accepted
            </span>
          )}
          {opponentProgress?.submissionStatus === "failed" && (
            <span className="px-2 py-0.5 rounded text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 font-mono uppercase tracking-wider">
              Failed
            </span>
          )}
          {(!opponentProgress || opponentProgress.submissionStatus === "idle" || !opponentProgress.submissionStatus) && (
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Coding
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
export default MatchHeader;
