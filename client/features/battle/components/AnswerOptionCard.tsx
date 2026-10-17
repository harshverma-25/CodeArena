"use client";

import React from "react";
import { Check, X } from "lucide-react";

export interface OptionTheme {
  bg: string;
  hoverBg: string;
  border: string;
  letterBg: string;
  scribble: React.ReactNode;
}

interface AnswerOptionCardProps {
  idx: number;
  letter: string;
  optionText: string;
  theme: OptionTheme;
  isSelected: boolean;
  isLocked: boolean;
  isSubmitting: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  isWrongSelected: boolean;
  onSelect: (index: number) => void;
}

/**
 * Isolated, memoized answer option card.
 * Prevents re-renders of the 4 option cards during countdown timer ticks.
 */
export const AnswerOptionCard = React.memo(function AnswerOptionCard({
  idx,
  letter,
  optionText,
  theme,
  isSelected,
  isLocked,
  isSubmitting,
  isRevealed,
  isCorrect,
  isWrongSelected,
  onSelect,
}: AnswerOptionCardProps) {
  let cardClasses = `${theme.bg} ${theme.hoverBg} border-[2.5px] border-black shadow-[4px_4px_0px_#000]`;
  let badgeClasses = "bg-white text-black border-2 border-black";

  if (isCorrect) {
    cardClasses = "bg-[#10B981] text-white border-[3px] border-black shadow-[4px_4px_0px_#000] scale-[1.01]";
    badgeClasses = "bg-white text-[#10B981] border-2 border-black";
  } else if (isWrongSelected) {
    cardClasses = "bg-[#EF4444] text-white border-[3px] border-black shadow-[4px_4px_0px_#000]";
    badgeClasses = "bg-white text-red-600 border-2 border-black";
  } else if (isSelected && isLocked) {
    cardClasses = "bg-[#FFE600] text-black border-[3px] border-black shadow-[4px_4px_0px_#000]";
    badgeClasses = "bg-black text-[#FFE600] border-2 border-black";
  } else if (isLocked) {
    cardClasses = `${theme.bg} opacity-60 border-[2.5px] border-stone-400 cursor-not-allowed shadow-[2px_2px_0px_#000]`;
  }

  return (
    <button
      type="button"
      disabled={isLocked || isSubmitting}
      onClick={() => onSelect(idx)}
      className={`group relative text-left p-3.5 sm:p-4 lg:py-3 lg:px-3.5 rounded-2xl lg:rounded-[14px] flex items-center gap-3 sm:gap-3.5 lg:gap-3 transition-all overflow-hidden ${cardClasses} ${
        !isLocked ? "hover:-translate-y-1 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer" : ""
      }`}
    >
      {/* Decorative comic scribble in corner */}
      {!isRevealed && !isSelected && theme.scribble}

      {/* Option Box Letter (A, B, C, D) */}
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-9 lg:h-9 rounded-xl lg:rounded-lg flex items-center justify-center font-black text-lg sm:text-xl lg:text-base shrink-0 shadow-[1px_1px_0px_#000] ${badgeClasses}`}
      >
        {letter}
      </div>

      {/* Option Text */}
      <div className="flex-1 min-w-0 pr-2">
        <span
          className={`font-black text-base sm:text-lg lg:text-base xl:text-[17px] leading-snug break-words ${
            isCorrect || isWrongSelected ? "text-white" : "text-black"
          }`}
        >
          {optionText}
        </span>

        {/* State Pills */}
        {isCorrect && (
          <span className="block mt-1 text-[11px] font-black uppercase tracking-wider text-emerald-100">
            ✓ Correct Answer
          </span>
        )}
        {isWrongSelected && (
          <span className="block mt-1 text-[11px] font-black uppercase tracking-wider text-red-100">
            ✗ Your Choice
          </span>
        )}
      </div>

      {/* Feedback Icon on Right */}
      <div className="shrink-0">
        {isCorrect ? (
          <div className="w-7 h-7 lg:w-6.5 lg:h-6.5 rounded-full bg-white text-emerald-600 flex items-center justify-center font-black">
            <Check className="w-4 h-4 lg:w-3.5 lg:h-3.5 stroke-[3]" />
          </div>
        ) : isWrongSelected ? (
          <div className="w-7 h-7 lg:w-6.5 lg:h-6.5 rounded-full bg-white text-red-600 flex items-center justify-center font-black">
            <X className="w-4 h-4 lg:w-3.5 lg:h-3.5 stroke-[3]" />
          </div>
        ) : isSelected && isLocked ? (
          <div className="w-7 h-7 lg:w-6.5 lg:h-6.5 rounded-full bg-black text-[#FFE600] flex items-center justify-center font-black">
            <Check className="w-4 h-4 lg:w-3.5 lg:h-3.5 stroke-[3]" />
          </div>
        ) : null}
      </div>
    </button>
  );
});
