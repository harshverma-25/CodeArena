"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ExitQuizModalProps {
  isOpen: boolean;
  isExiting: boolean;
  onStay: () => void;
  onExit: () => void;
}

/**
 * ExitQuizModal
 * Styled modal matching QUIZZY neobrutalist aesthetic for active quiz exit confirmation.
 */
export function ExitQuizModal({
  isOpen,
  isExiting,
  onStay,
  onExit,
}: ExitQuizModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-quiz-title"
      aria-describedby="exit-quiz-desc"
    >
      <div className="bg-[#FAF7EE] border-[3px] border-black rounded-[28px] p-6 sm:p-7 max-w-sm w-full shadow-[8px_8px_0px_#000] space-y-4 text-center">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] border-2 border-black text-red-600 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
          <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
        </div>

        {/* Modal Header & Copy */}
        <div>
          <h3
            id="exit-quiz-title"
            className="text-2xl font-black text-black tracking-tight"
          >
            Exit Quiz?
          </h3>
          <p
            id="exit-quiz-desc"
            className="text-sm font-bold text-stone-600 mt-2 leading-relaxed"
          >
            Are you sure you want to leave this quiz? Your current progress may be lost, and this quiz will end for you.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* Primary Action to keep user playing */}
          <button
            type="button"
            id="stay-in-quiz-button"
            onClick={onStay}
            disabled={isExiting}
            className="w-full py-3.5 px-4 rounded-full bg-white hover:bg-stone-100 active:translate-x-[2px] active:translate-y-[2px] text-black border-2 border-black font-black text-sm shadow-[3px_3px_0px_#000] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Stay in Quiz
          </button>

          {/* Destructive Action to forfeit / exit */}
          <button
            type="button"
            id="confirm-exit-quiz-button"
            onClick={onExit}
            disabled={isExiting}
            className="w-full py-3.5 px-4 rounded-full bg-[#EF4444] hover:bg-red-600 active:translate-x-[2px] active:translate-y-[2px] text-white border-2 border-black font-black text-sm shadow-[3px_3px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
          >
            {isExiting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Exiting Quiz...</span>
              </>
            ) : (
              <span>Exit Quiz</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExitQuizModal;
