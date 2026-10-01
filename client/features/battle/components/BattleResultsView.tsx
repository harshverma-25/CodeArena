"use client";

import React, { useState } from "react";
import { BattleResultsHeader } from "./BattleResultsHeader";
import { QuestionReviewCard } from "./QuestionReviewCard";
import { BattleResultDetails, BattleResultPlayerDetails } from "@/types";
import { CheckCircle2, XCircle, HelpCircle, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface BattleResultsViewProps {
  results: BattleResultDetails;
}

export function BattleResultsView({ results }: BattleResultsViewProps) {
  const { userPlayer, opponentPlayer } = results;
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(userPlayer.userId);

  const activePlayer: BattleResultPlayerDetails =
    selectedPlayerId === userPlayer.userId
      ? userPlayer
      : opponentPlayer || userPlayer;

  const totalQ = activePlayer.totalQuestions || results.questionCount || 1;
  const accuracy = Math.round((activePlayer.correctCount / totalQ) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Scores */}
      <BattleResultsHeader results={results} />

      {/* 2. Player Selection & Summary Metrics Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Question Breakdown
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review full options, submitted answers, correct solutions, and explanations
            </p>
          </div>

          {/* Player Toggle Tabs */}
          {opponentPlayer && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border shrink-0 self-start sm:self-auto font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedPlayerId(userPlayer.userId)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer",
                  selectedPlayerId === userPlayer.userId
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="h-3.5 w-3.5" />
                You ({userPlayer.score} pts)
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlayerId(opponentPlayer.userId)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer",
                  selectedPlayerId === opponentPlayer.userId
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-3.5 w-3.5" />
                {opponentPlayer.displayName || opponentPlayer.username || "Opponent"} ({opponentPlayer.score} pts)
              </button>
            </div>
          )}
        </div>

        {/* Selected Player Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Correct */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 className="h-4 w-4" /> Correct
            </div>
            <p className="text-2xl font-black font-mono text-emerald-400">
              {activePlayer.correctCount}
              <span className="text-xs font-normal text-emerald-400/70 ml-1">
                ({accuracy}%)
              </span>
            </p>
          </div>

          {/* Incorrect */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-bold font-mono">
              <XCircle className="h-4 w-4" /> Incorrect
            </div>
            <p className="text-2xl font-black font-mono text-rose-400">
              {activePlayer.incorrectCount}
            </p>
          </div>

          {/* Unanswered */}
          <div className="rounded-xl border border-zinc-500/20 bg-zinc-500/10 p-3.5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs font-bold font-mono">
              <HelpCircle className="h-4 w-4" /> Unanswered
            </div>
            <p className="text-2xl font-black font-mono text-zinc-400">
              {activePlayer.unansweredCount}
            </p>
          </div>

          {/* Total Questions */}
          <div className="rounded-xl border border-border bg-card/40 p-3.5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-bold font-mono">
              Total Questions
            </div>
            <p className="text-2xl font-black font-mono text-foreground">
              {activePlayer.totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Questions List */}
      <div className="space-y-6">
        {activePlayer.questions && activePlayer.questions.length > 0 ? (
          activePlayer.questions.map((question, idx) => (
            <QuestionReviewCard
              key={question.questionId || idx}
              questionNumber={idx + 1}
              question={question}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground font-mono text-xs">
            No question data available for this player.
          </div>
        )}
      </div>
    </div>
  );
}

export default BattleResultsView;
