"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Swords, RefreshCw, AlertTriangle, Home } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLiveBattle } from "@/features/battle/hooks/useLiveBattle";
import { BattleHeader } from "@/features/battle/components/BattleHeader";
import { BattleScoreBoard } from "@/features/battle/components/BattleScoreBoard";
import { QuestionCard } from "@/features/battle/components/QuestionCard";
import { WaitingForOpponent } from "@/features/battle/components/WaitingForOpponent";
import { BattleResultsModal } from "@/features/battle/components/BattleResultsModal";
import { Button } from "@/components/ui/button";

export default function LiveBattlePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params.roomCode as string) || "").toUpperCase();

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const {
    battle,
    opponent,
    selectedOption,
    isLocked,
    isSubmitting,
    timeRemaining,
    results,
    status,
    errorMessage,
    submitAnswer,
  } = useLiveBattle(roomCode);

  // 1. Loading State
  if (status === "loading" || isUserLoading) {
    return (
      <div className="mx-auto max-w-4xl min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Swords className="h-6 w-6 text-primary absolute animate-pulse" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">Synchronizing Battle Arena</h2>
          <p className="text-xs text-muted-foreground font-mono">
            Connecting to server room {roomCode}...
          </p>
        </div>
      </div>
    );
  }

  // 2. Error State / Invalid Room
  if (status === "error" || errorMessage || (!battle && status !== "completed")) {
    return (
      <div className="mx-auto max-w-md text-center p-8 border border-destructive/20 bg-destructive/5 rounded-3xl space-y-4 my-12 animate-in fade-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Battle Room Unavailable</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {errorMessage ||
            "Unable to access active battle. The battle may have concluded or the room code is invalid."}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="border border-border text-foreground hover:bg-secondary/40"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Dashboard
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const currentQNumber = (battle?.currentQuestionIndex || 0) + 1;
  const totalQuestions = battle?.questionCount || 10;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16 relative">
      {/* Results Modal when battle completed */}
      {status === "completed" && results && (
        <BattleResultsModal results={results} currentUserId={currentUser?._id} />
      )}

      {/* Battle Header */}
      {battle && (
        <BattleHeader
          roomCode={battle.roomCode}
          topic={battle.topic}
          difficulty={battle.difficulty}
          currentQuestionNumber={currentQNumber}
          totalQuestions={totalQuestions}
          timeRemaining={timeRemaining}
          timePerQuestion={battle.timePerQuestion || 30}
        />
      )}

      {/* Live ScoreBoard */}
      <BattleScoreBoard
        myUsername={currentUser?.username || "You"}
        myDisplayName={currentUser?.displayName}
        myAvatar={currentUser?.avatar}
        myScore={battle?.myScore || 0}
        myCurrentQuestionNumber={currentQNumber}
        totalQuestions={totalQuestions}
        opponent={opponent}
      />

      {/* Main Interaction Area */}
      {status === "waiting_opponent" ? (
        <WaitingForOpponent
          myScore={battle?.myScore || 0}
          totalQuestions={totalQuestions}
          opponent={opponent}
        />
      ) : battle?.currentQuestion ? (
        <QuestionCard
          question={battle.currentQuestion}
          questionNumber={currentQNumber}
          totalQuestions={totalQuestions}
          selectedOption={selectedOption}
          isLocked={isLocked}
          isSubmitting={isSubmitting}
          onSelectOption={submitAnswer}
        />
      ) : null}
    </div>
  );
}
