"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useMatch } from "@/features/match/hooks/useMatch";
import { useMatchSocket } from "@/features/match/hooks/useMatchSocket";
import { useBattleStore } from "@/store/battleStore";
import { ProblemPanel } from "@/features/match/components/ProblemPanel";
import { MatchHeader } from "@/features/match/components/MatchHeader";
import { RefreshCw, ShieldAlert, Home, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchArenaPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { data: dbUser, isLoading: userLoading } = useCurrentUser();
  const { data: match, isLoading: matchLoading, error: matchError } = useMatch(matchId);

  const {
    setMatchId,
    setTimeRemaining,
    setStatus,
    setMyUserId,
    resetBattle,
  } = useBattleStore();

  // Socket communication synchronization
  useMatchSocket(
    match?.roomCode,
    matchId,
    dbUser?._id
  );

  // Sync loaded match information with Battle Store state
  useEffect(() => {
    if (!match || !dbUser) return;

    setMatchId(match._id);
    setMyUserId(dbUser._id);

    // Calculate dynamic time remaining based on startedAt
    const durationSeconds = (match as any).duration || 1800; // default 30 mins
    const elapsedSeconds = Math.round(
      (Date.now() - new Date(match.startedAt).getTime()) / 1000
    );
    const remaining = Math.max(0, durationSeconds - elapsedSeconds);

    setTimeRemaining(remaining);
    setStatus(match.status === "IN_PROGRESS" ? "active" : "completed");
  }, [match, dbUser, setMatchId, setMyUserId, setTimeRemaining, setStatus]);

  // Loading States
  if (userLoading || matchLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        Preparing competitive match environment...
      </div>
    );
  }

  // Error States
  if (matchError || !match) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-4 p-6">
        <ShieldAlert className="h-8 w-8 text-rose-500 animate-pulse" />
        <div className="text-center space-y-1">
          <p className="text-foreground font-extrabold text-sm uppercase">Failed to retrieve match session</p>
          <p className="text-[10px] text-zinc-500">The battle room might have expired or you are unauthorized.</p>
        </div>
        <Button
          onClick={() => {
            resetBattle();
            router.push("/dashboard");
          }}
          className="bg-zinc-900 border border-border/80 text-foreground hover:bg-zinc-800 gap-1.5 font-mono text-xs"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    );
  }

  const opponent = match.players.find((p) => p.user?._id !== dbUser?._id)?.user;
  const opponentName = opponent?.displayName || opponent?.username || "Opponent";
  const opponentAvatar = opponent?.avatar || "";

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-foreground overflow-hidden">
      {/* Global Sync Header */}
      <MatchHeader
        matchId={matchId}
        opponentName={opponentName}
        opponentAvatar={opponentAvatar}
      />

      {/* Main split dashboard */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Column: Problem details */}
        <div className="w-full lg:w-[45%] h-1/2 lg:h-full min-h-0 shrink-0">
          <ProblemPanel problem={match.problem} />
        </div>

        {/* Right Column: MCQ Arena placeholder */}
        <div className="flex-1 h-1/2 lg:h-full flex flex-col items-center justify-center bg-zinc-900/40 border border-border/60 rounded-2xl p-6 text-center gap-4">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Swords className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-foreground">1v1 Battle Arena Ready</h3>
            <p className="text-xs text-muted-foreground">
              Old code execution system removed. MCQ battle arena module will be connected in Step 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
