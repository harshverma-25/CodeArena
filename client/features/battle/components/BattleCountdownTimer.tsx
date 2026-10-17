"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { ArcadeStarIcon } from "@/components/ui/ArcadeIcons";

interface BattleTimerCardProps {
  roundStartedAt: number;
  timePerQuestion: number;
  isLocked: boolean;
  isRevealed: boolean;
  status: string;
}

/**
 * Isolated Card A Countdown Timer component.
 * Encapsulates the 100ms progress bar and second ticker updates, preventing
 * high-frequency re-renders of the parent BattleArenaPage, question card, and options.
 */
export const BattleTimerCard = React.memo(function BattleTimerCard({
  roundStartedAt,
  timePerQuestion,
  isLocked,
  isRevealed,
  status,
}: BattleTimerCardProps) {
  const totalDurationSec = timePerQuestion || 30;
  const totalDurationMs = totalDurationSec * 1000;

  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    if (!roundStartedAt || status !== "active") return totalDurationSec;
    const elapsed = Math.max(0, Date.now() - roundStartedAt);
    return Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));
  });

  const [timerPercent, setTimerPercent] = useState<number>(() => {
    if (!roundStartedAt || status !== "active") return 100;
    const elapsed = Math.max(0, Date.now() - roundStartedAt);
    return Math.max(0, Math.min(100, ((totalDurationMs - elapsed) / totalDurationMs) * 100));
  });

  useEffect(() => {
    if (status !== "active" || isRevealed || !roundStartedAt) {
      return;
    }

    const tick = () => {
      const now = Date.now();
      const elapsedMs = Math.max(0, now - roundStartedAt);
      const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
      const remainingSecs = Math.ceil(remainingMs / 1000);
      const percent = Math.max(0, Math.min(100, (remainingMs / totalDurationMs) * 100));

      setTimeRemaining(remainingSecs);
      setTimerPercent(percent);

      if (remainingMs <= 0) {
        clearInterval(timerId);
      }
    };

    tick();
    const timerId = setInterval(tick, 100);

    return () => clearInterval(timerId);
  }, [status, isRevealed, roundStartedAt, totalDurationMs]);

  return (
    <div className="relative bg-[#FEF08A] border-[2.5px] border-black rounded-[22px] p-3.5 sm:p-4 lg:p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between overflow-hidden">
      <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-2.5">
        {/* Timer Stopwatch Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-9.5 lg:h-9.5 rounded-2xl lg:rounded-xl bg-[#CFFAFE] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 text-black stroke-[2.5]" />
        </div>
        <div>
          <div className="font-black text-2xl sm:text-3xl lg:text-[26px] text-black leading-none font-mono tracking-tight">
            {timeRemaining}s
          </div>
          <span className="text-[10px] font-black tracking-widest text-stone-900 uppercase mt-0.5 block">
            TIME LEFT
          </span>
        </div>
      </div>

      {/* Decreasing Horizontal Progress Bar */}
      <div className="mt-2.5 sm:mt-3 w-full h-3 bg-white border-2 border-black rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-150 ${
            timeRemaining <= 3 ? "bg-red-600" : "bg-black"
          }`}
          style={{ width: `${Math.max(0, Math.min(100, timerPercent))}%` }}
        />
      </div>

      {/* Decorative star doodle */}
      <div className="absolute top-2 right-2 pointer-events-none opacity-80">
        <ArcadeStarIcon className="w-4 h-4 text-[#FFE600]" />
      </div>
    </div>
  );
});

interface MobileTimerPillProps {
  roundStartedAt: number;
  timePerQuestion: number;
  isRevealed: boolean;
  status: string;
}

/**
 * Isolated mobile countdown pill rendered above the question text on mobile screens.
 */
export const MobileTimerPill = React.memo(function MobileTimerPill({
  roundStartedAt,
  timePerQuestion,
  isRevealed,
  status,
}: MobileTimerPillProps) {
  const totalDurationSec = timePerQuestion || 30;
  const totalDurationMs = totalDurationSec * 1000;

  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    if (!roundStartedAt || status !== "active") return totalDurationSec;
    const elapsed = Math.max(0, Date.now() - roundStartedAt);
    return Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));
  });

  useEffect(() => {
    if (status !== "active" || isRevealed || !roundStartedAt) {
      return;
    }

    const tick = () => {
      const now = Date.now();
      const elapsedMs = Math.max(0, now - roundStartedAt);
      const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
      const remainingSecs = Math.ceil(remainingMs / 1000);
      setTimeRemaining(remainingSecs);

      if (remainingMs <= 0) {
        clearInterval(timerId);
      }
    };

    tick();
    const timerId = setInterval(tick, 250);

    return () => clearInterval(timerId);
  }, [status, isRevealed, roundStartedAt, totalDurationMs]);

  return (
    <div className="inline-flex sm:hidden items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF08A] border-2 border-black shadow-[2px_2px_0px_#000] font-mono font-black text-xs">
      <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>{timeRemaining}s</span>
    </div>
  );
});

interface ScoreTickerProps {
  roundStartedAt: number;
  isLocked: boolean;
  isRevealed: boolean;
  isMyAnswerCorrect: boolean;
  myEarnedScore: number;
}

/**
 * Isolated live score ticker in Card C.
 * Dynamically computes remaining potential score based on roundStartedAt
 * without re-rendering the score card container or other components.
 */
export const ScoreTicker = React.memo(function ScoreTicker({
  roundStartedAt,
  isLocked,
  isRevealed,
  isMyAnswerCorrect,
  myEarnedScore,
}: ScoreTickerProps) {
  const [potentialScore, setPotentialScore] = useState<number>(1000);

  useEffect(() => {
    if (isLocked || isRevealed || !roundStartedAt) {
      return;
    }

    const tick = () => {
      const now = Date.now();
      const elapsedSec = Math.max(0, (now - roundStartedAt) / 1000);
      // Formula: 1000 pts start, drops by 30 pts/sec. Min: 100.
      const score = Math.max(100, Math.round(1000 - elapsedSec * 30));
      setPotentialScore(score);
    };

    tick();
    const timerId = setInterval(tick, 100);

    return () => clearInterval(timerId);
  }, [isLocked, isRevealed, roundStartedAt]);

  return (
    <div className="mt-2.5 sm:mt-3 text-[11px] font-extrabold text-stone-700 flex items-center justify-between">
      <span>
        {isRevealed
          ? isMyAnswerCorrect
            ? `+${myEarnedScore} pts awarded!`
            : "0 pts earned"
          : isLocked
          ? "Locked in!"
          : `Max: ${potentialScore} pts`}
      </span>
      {isRevealed && isMyAnswerCorrect && (
        <span className="text-[#065F46] font-black">✓ Correct</span>
      )}
    </div>
  );
});

interface RevealCountdownBadgeProps {
  isRevealed: boolean;
  revealDurationSec: number;
}

/**
 * Isolated countdown badge in the educational reveal accordion.
 * Counts down 5s to 0s locally without triggering re-renders of the question or options.
 */
export const RevealCountdownBadge = React.memo(function RevealCountdownBadge({
  isRevealed,
  revealDurationSec = 5,
}: RevealCountdownBadgeProps) {
  const [countdown, setCountdown] = useState(revealDurationSec);

  useEffect(() => {
    if (!isRevealed) return;
    setCountdown(revealDurationSec);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed, revealDurationSec]);

  return (
    <span className="font-black text-xs bg-white border border-black px-2 py-0.5 rounded-md">
      Next question in {countdown}s
    </span>
  );
});

interface MaxRoundValueBadgeProps {
  roundStartedAt: number;
  isLocked: boolean;
}

/**
 * Isolated badge for solo sidebar displaying the ticking max round value.
 */
export const MaxRoundValueBadge = React.memo(function MaxRoundValueBadge({
  roundStartedAt,
  isLocked,
}: MaxRoundValueBadgeProps) {
  const [potentialScore, setPotentialScore] = useState<number>(1000);

  useEffect(() => {
    if (isLocked || !roundStartedAt) return;

    const tick = () => {
      const elapsedSec = Math.max(0, (Date.now() - roundStartedAt) / 1000);
      const score = Math.max(100, Math.round(1000 - elapsedSec * 30));
      setPotentialScore(score);
    };

    tick();
    const interval = setInterval(tick, 100);

    return () => clearInterval(interval);
  }, [isLocked, roundStartedAt]);

  return (
    <span className="font-mono font-black text-base text-black">
      {potentialScore} pts
    </span>
  );
});
