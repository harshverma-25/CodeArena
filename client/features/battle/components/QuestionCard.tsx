"use client";

import React from "react";
import { Check, Loader2, Lock, HelpCircle } from "lucide-react";
import { BattleQuestion } from "@/types";

interface QuestionCardProps {
  question: BattleQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  isLocked: boolean;
  isSubmitting: boolean;
  onSelectOption: (index: number) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isLocked,
  isSubmitting,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
      {/* Decorative gradient background blur */}
      <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Question prompt */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Question {questionNumber} of {totalQuestions}
          </span>
          {isLocked && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Lock className="h-3 w-3" />
              Locked In
            </span>
          )}
        </div>

        <h2 className="text-lg md:text-xl font-bold text-foreground leading-relaxed font-sans whitespace-pre-wrap">
          {question.question}
        </h2>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const letter = OPTION_LABELS[idx] || `${idx + 1}`;

          return (
            <button
              key={idx}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectOption(idx)}
              className={`group flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none relative overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/15 ring-1 ring-primary"
                  : isLocked
                  ? "border-border/60 bg-background/40 opacity-60 cursor-not-allowed"
                  : "border-border bg-background hover:border-primary/50 hover:bg-secondary/40 active:scale-[0.99]"
              }`}
            >
              {/* Option Letter Indicator */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono font-black text-xs transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isLocked
                    ? "bg-secondary text-muted-foreground border border-border/60"
                    : "bg-secondary text-foreground border border-border group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/40"
                }`}
              >
                {isSelected ? <Check className="h-4 w-4" /> : letter}
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-1">
                <span
                  className={`text-sm font-medium leading-snug transition-colors ${
                    isSelected ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {optionText}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submitting state feedback banner */}
      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-mono font-semibold animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Answer submitted! Waiting for server confirmation...</span>
        </div>
      )}
    </div>
  );
}
export default QuestionCard;
