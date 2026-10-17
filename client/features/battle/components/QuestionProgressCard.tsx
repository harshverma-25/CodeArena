"use client";

import React from "react";
import { ArcadeCrownIcon } from "@/components/ui/ArcadeIcons";

interface QuestionProgressCardProps {
  currentQNumber: number;
  totalQuestions: number;
  currentQIndex: number;
}

/**
 * Isolated, memoized Card B for segmented question progress capsules.
 * Only re-renders when currentQuestionIndex or totalQuestions changes.
 */
export const QuestionProgressCard = React.memo(function QuestionProgressCard({
  currentQNumber,
  totalQuestions,
  currentQIndex,
}: QuestionProgressCardProps) {
  return (
    <div className="relative bg-white border-[2.5px] border-black rounded-[22px] p-3.5 sm:p-4 lg:p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
      <div>
        <h3 className="font-black text-sm sm:text-base lg:text-[15px] text-black text-center tracking-tight">
          Question {currentQNumber} / {totalQuestions}
        </h3>
      </div>

      {/* Segmented Progress Capsules matching screenshot */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCompleted = idx < currentQNumber;
          const isCurrent = idx === currentQIndex;
          return (
            <div
              key={idx}
              className={`h-3 sm:h-3.5 rounded-full border-1.5 border-black transition-all ${
                isCompleted
                  ? "w-4 sm:w-5 bg-[#0D9488]"
                  : "w-4 sm:w-5 bg-white"
              } ${isCurrent ? "ring-2 ring-black" : ""}`}
              title={`Question ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Crown Doodle on top right */}
      <div className="absolute -top-2 -right-1 pointer-events-none">
        <ArcadeCrownIcon className="w-6 h-5" />
      </div>
    </div>
  );
});
