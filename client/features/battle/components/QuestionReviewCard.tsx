"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, Lightbulb, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BattleResultQuestion } from "@/types";

interface QuestionReviewCardProps {
  questionNumber: number;
  question: BattleResultQuestion;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function QuestionReviewCard({ questionNumber, question }: QuestionReviewCardProps) {
  const {
    question: questionText,
    options,
    correctAnswer,
    explanation,
    selectedOption,
    isCorrect,
    timeTakenMs,
    isUnanswered,
  } = question;

  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) return "0.0s";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-xl transition-all space-y-5 relative overflow-hidden",
        isCorrect
          ? "border-emerald-500/30 bg-emerald-950/10"
          : isUnanswered
          ? "border-border bg-card/60"
          : "border-rose-500/30 bg-rose-950/10"
      )}
    >
      {/* Question Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary font-mono text-xs font-black text-foreground border border-border">
            Q{questionNumber}
          </span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            ID: {question.questionId}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Taken */}
          {!isUnanswered && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full border border-border">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeTakenMs)}
            </span>
          )}

          {/* Verdict Badge */}
          {isCorrect ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="h-4 w-4" /> Correct (+1)
            </span>
          ) : isUnanswered ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/15 border border-zinc-500/30 px-3 py-1 text-xs font-bold text-zinc-400 font-mono">
              <HelpCircle className="h-4 w-4" /> Timed Out / Unanswered
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-400 font-mono">
              <XCircle className="h-4 w-4" /> Incorrect (0)
            </span>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
          {questionText}
        </h3>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {options.map((optionText, idx) => {
          const isThisCorrect = idx === correctAnswer;
          const isThisSelected = idx === selectedOption;

          let optionStyle = "border-border bg-secondary/20 text-muted-foreground hover:bg-secondary/30";
          let labelStyle = "bg-secondary text-muted-foreground border-border";
          let badgeText = null;

          if (isThisCorrect) {
            optionStyle = "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold shadow-emerald-500/5";
            labelStyle = "bg-emerald-500 text-emerald-950 font-bold border-emerald-400";
            if (isThisSelected) {
              badgeText = "Your Choice ✓ (Correct)";
            } else {
              badgeText = "Correct Answer ✓";
            }
          } else if (isThisSelected && !isCorrect) {
            optionStyle = "border-rose-500/60 bg-rose-500/15 text-rose-300 font-semibold shadow-rose-500/5";
            labelStyle = "bg-rose-500 text-rose-950 font-bold border-rose-400";
            badgeText = "Your Choice ✗";
          }

          return (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border transition-all relative text-xs sm:text-sm",
                optionStyle
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold",
                  labelStyle
                )}
              >
                {OPTION_LABELS[idx]}
              </span>

              <div className="flex-1 min-w-0 pr-2 pt-0.5 leading-snug">
                <span>{optionText}</span>
              </div>

              {badgeText && (
                <span
                  className={cn(
                    "shrink-0 font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border self-center",
                    isThisCorrect
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  )}
                >
                  {badgeText}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation Box */}
      {explanation && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Answer Breakdown & Explanation</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans pl-6">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuestionReviewCard;
