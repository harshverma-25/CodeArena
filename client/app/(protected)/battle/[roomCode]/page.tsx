"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Home,
  Check,
  CheckCircle,
  X,
  XCircle,
  Clock,
  LogOut,
  Users,
  Trophy,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  HelpCircle,
  Award,
} from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import {
  ArcadeCrownIcon,
  ArcadeLightningIcon,
  ArcadeStarIcon,
} from "@/components/ui/ArcadeIcons";
import {
  GamerBoyAvatar,
  GamerGirlAvatar,
  GamerCapAvatar,
  GamerOrangeAvatar,
} from "@/components/ui/PlayerAvatars";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLiveBattle, LiveBattlePlayer } from "@/features/battle/hooks/useLiveBattle";

const OPTION_LETTERS = ["A", "B", "C", "D"];

// 4 distinct pastel color themes for the 2x2 option cards matching the screenshot
const OPTION_THEMES = [
  {
    bg: "bg-[#A7F3D0]", // Option A: Pastel Mint / Aqua
    hoverBg: "hover:bg-[#6EE7B7]",
    border: "border-black",
    letterBg: "bg-white",
    scribble: (
      <svg className="w-8 h-8 text-emerald-600/40 absolute right-4 bottom-2 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M10 30L25 15L32 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="12" r="2" fill="currentColor" />
        <circle cx="34" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    bg: "bg-[#DDD6FE]", // Option B: Pastel Lavender / Purple
    hoverBg: "hover:bg-[#C4B5FD]",
    border: "border-black",
    letterBg: "bg-white",
    scribble: (
      <svg className="w-8 h-8 text-purple-600/40 absolute right-4 bottom-2 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M12 20L20 12L28 20L36 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 26L30 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    bg: "bg-[#FBCFE8]", // Option C: Pastel Pink / Coral
    hoverBg: "hover:bg-[#F472B6]",
    border: "border-black",
    letterBg: "bg-white",
    scribble: (
      <svg className="w-8 h-8 text-pink-600/40 absolute right-4 bottom-2 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M15 25L25 15M25 15L35 25M25 15V32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="15" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    bg: "bg-[#7DD3FC]", // Option D: Pastel Sky Blue
    hoverBg: "hover:bg-[#38BDF8]",
    border: "border-black",
    letterBg: "bg-white",
    scribble: (
      <svg className="w-8 h-8 text-sky-600/40 absolute right-4 bottom-2 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
        <path d="M26 14L34 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
];

// Fallback avatars for player card slots 1 to 4
const PLAYER_AVATARS = [
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" /> : <GamerBoyAvatar className="w-full h-full" />,
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" /> : <GamerGirlAvatar className="w-full h-full" />,
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" /> : <GamerCapAvatar className="w-full h-full" />,
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" /> : <GamerOrangeAvatar className="w-full h-full" />,
];

// Player card pastel color themes matching screenshot
const PLAYER_CARD_THEMES = [
  { bg: "bg-[#FEF08A]", bookmarkBg: "bg-[#FFE600]" }, // #1 Yellow
  { bg: "bg-[#DDD6FE]", bookmarkBg: "bg-[#38BDF8]" }, // #2 Purple
  { bg: "bg-[#A7F3D0]", bookmarkBg: "bg-[#FFE600]" }, // #3 Mint (or tied #2)
  { bg: "bg-[#FBCFE8]", bookmarkBg: "bg-[#F472B6]" }, // #4 Pink
];

export default function LiveQuizArenaPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params.roomCode as string) || "").toUpperCase();

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const {
    battle,
    players,
    selectedOption,
    isLocked,
    isSubmitting,
    potentialScore,
    lockedScore,
    timeRemaining,
    timerPercent,
    isRevealed,
    revealData,
    revealCountdown,
    results,
    status,
    errorMessage,
    isSocketDisconnected,
    submitAnswer,
    advanceRound,
    reconnectBattle,
  } = useLiveBattle(roomCode);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Synchronized navigation to results screen on battle completion
  useEffect(() => {
    if (status === "completed" && results?.battleId) {
      router.push(`/results/${results.battleId}`);
    }
  }, [status, results, router]);

  // Loading state
  if (status === "loading" || isUserLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
          <div className="bg-white border-[2.5px] border-black rounded-3xl p-8 shadow-[6px_6px_0px_#000] flex flex-col items-center gap-4 max-w-sm w-full">
            <div className="w-14 h-14 border-4 border-black border-t-[#FFE600] rounded-full animate-spin" />
            <h2 className="text-2xl font-black text-black tracking-tight">
              Entering Quiz Arena
            </h2>
            <p className="text-xs font-bold text-stone-600 font-mono">
              Synchronizing round with room {roomCode}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state / Invalid Room
  if (status === "error" || errorMessage || (!battle && status !== "completed")) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24">
          <div className="max-w-md w-full text-center p-8 bg-white border-[2.5px] border-black rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE2E2] border-2 border-black text-red-600 shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="h-7 w-7 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-black">Quiz Arena Unavailable</h3>
            <p className="text-sm font-bold text-stone-600 leading-relaxed">
              {errorMessage || "Unable to connect to this live quiz. The match may have ended or the PIN is invalid."}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-black bg-[#FAF7EE] hover:bg-stone-200 text-black font-black text-sm shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => reconnectBattle()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 stroke-[2.5]" />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQIndex = battle?.currentQuestionIndex || 0;
  const currentQNumber = currentQIndex + 1;
  const totalQuestions = battle?.questionCount || 10;

  const myId = currentUser?._id;
  const isHost = players.length > 0 && players[0].userId === myId;
  const answeredCount = players.filter((p) => p.hasAnswered).length;
  const totalPlayersCount = players.length || 1;
  const isSoloMatch = totalPlayersCount === 1;

  // Question details
  const questionText = battle?.currentQuestion?.question || "Loading question...";
  const options = battle?.currentQuestion?.options || [];
  const categoryTopic = battle?.topic || "PROGRAMMING";

  // Determine user's reveal outcome
  const myRevealResult = revealData?.players.find((p) => p.userId === myId);
  const isMyAnswerCorrect = myRevealResult?.isCorrect || false;
  const myEarnedScore = myRevealResult?.earnedScore || 0;
  const correctAnswerIndex = revealData?.correctAnswer ?? -1;

  // Compute player rankings handling ties
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  let runningRank = 1;
  const rankedPlayers = sortedPlayers.map((player, idx) => {
    if (idx > 0 && (player.score || 0) < (sortedPlayers[idx - 1].score || 0)) {
      runningRank = idx + 1;
    }
    return { ...player, rank: runningRank };
  });

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 pb-16 select-none relative overflow-x-hidden font-sans">
      {/* 1. TOP NAVBAR */}
      <Navbar />

      {/* Decorative comic edge flourishes */}
      <div className="absolute top-24 left-3 pointer-events-none opacity-80 hidden lg:block">
        <ArcadeStarIcon className="w-7 h-7 text-[#FFE600]" />
      </div>
      <div className="absolute top-32 right-3 pointer-events-none opacity-80 hidden lg:block">
        <ArcadeLightningIcon className="w-8 h-8 text-[#FFE600]" />
      </div>

      {/* Reconnecting banner if socket drops temporarily */}
      {isSocketDisconnected && (
        <div className="fixed top-22 left-1/2 -translate-x-1/2 z-50 bg-[#FEE2E2] border-[2.5px] border-black text-red-900 px-5 py-2.5 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-black shadow-[4px_4px_0px_#000] animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-600 stroke-[2.5]" />
          <span>Connection interrupted. Reconnecting to live quiz session...</span>
          <button
            onClick={() => reconnectBattle()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-black border border-black cursor-pointer"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN GAMEPLAY ARENA DASHBOARD (Directly beneath Navbar) */}
      {/* ========================================================================= */}
      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-26 space-y-5">
        
        {/* DUAL-COLUMN LAYOUT: Left (Quiz Gameplay) & Right (Multiplayer Leaderboard) */}
        <div className={`grid grid-cols-1 ${isSoloMatch ? "lg:grid-cols-12" : "lg:grid-cols-12"} gap-5 items-start`}>
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: TIMER, PROGRESS, SCORE & CORE QUESTION CARD */}
          {/* ======================================================================= */}
          <div className={`${isSoloMatch ? "lg:col-span-8 lg:col-start-3" : "lg:col-span-8"} flex flex-col gap-5`}>
            
            {/* TOP ROW: 3 CARDS (TIMER, QUESTION PROGRESS, SCORE) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* CARD A: TIMER CARD */}
              <div className="relative bg-[#FEF08A] border-[2.5px] border-black rounded-[22px] p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-3">
                  {/* Timer Stopwatch Icon */}
                  <div className="w-11 h-11 rounded-2xl bg-[#CFFAFE] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Clock className="w-6 h-6 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="font-black text-2xl sm:text-3xl text-black leading-none font-mono tracking-tight">
                      {timeRemaining}s
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-stone-900 uppercase mt-0.5 block">
                      TIME LEFT
                    </span>
                  </div>
                </div>

                {/* Decreasing Horizontal Progress Bar */}
                <div className="mt-3 w-full h-3 bg-white border-2 border-black rounded-full overflow-hidden p-0.5">
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

              {/* CARD B: QUESTION PROGRESS CARD */}
              <div className="relative bg-white border-[2.5px] border-black rounded-[22px] p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-black text-center tracking-tight">
                    Question {currentQNumber} / {totalQuestions}
                  </h3>
                </div>

                {/* Segmented Progress Capsules matching screenshot */}
                <div className="mt-3 flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {Array.from({ length: totalQuestions }).map((_, idx) => {
                    const isCompleted = idx < currentQNumber;
                    const isCurrent = idx === currentQIndex;
                    return (
                      <div
                        key={idx}
                        className={`h-3.5 rounded-full border-1.5 border-black transition-all ${
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

              {/* CARD C: YOUR SCORE CARD */}
              <div className="relative bg-[#DDD6FE] border-[2.5px] border-black rounded-[22px] p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  {/* Golden Trophy Icon */}
                  <div className="w-11 h-11 rounded-2xl bg-[#FEF08A] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Trophy className="w-6 h-6 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="font-black text-2xl sm:text-3xl text-black leading-none font-mono tracking-tight">
                      {(battle?.myScore || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-stone-900 uppercase mt-0.5 block">
                      YOUR SCORE
                    </span>
                  </div>
                </div>

                {/* Live points ticker info */}
                <div className="mt-3 text-[11px] font-extrabold text-stone-700 flex items-center justify-between">
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
              </div>

            </div>

            {/* CARD D: QUESTION PANEL & ANSWER OPTIONS */}
            <div className="relative bg-white border-[2.5px] border-black rounded-[28px] p-6 sm:p-8 shadow-[6px_6px_0px_#000] overflow-hidden">
              
              {/* Large subtle question mark watermark in background */}
              <div className="absolute -right-4 top-10 pointer-events-none opacity-10 select-none">
                <span className="font-black text-9xl text-stone-900 font-mono">?</span>
              </div>

              {/* Category / Subject Badge + Crown Doodle */}
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDD6FE] border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="font-mono font-black text-xs text-black">
                    &lt;/&gt;
                  </span>
                  <span className="font-black text-xs uppercase tracking-wider text-black">
                    {categoryTopic}
                  </span>
                </div>
                <ArcadeCrownIcon className="w-6 h-5" />
              </div>

              {/* Core Question Typography */}
              <h2 className="font-black text-2xl sm:text-3xl lg:text-4xl text-black leading-tight mb-2 tracking-tight">
                {questionText}
              </h2>

              {/* Instructions Subtitle */}
              <p className="font-bold text-xs sm:text-sm text-stone-600 mb-6">
                {isRevealed
                  ? "Round ended. Review the answer below!"
                  : "Choose the correct answer before the timer runs out!"}
              </p>

              {/* 2x2 Interactive Answer Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((optionText, idx) => {
                  const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
                  const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
                  const isSelected = selectedOption === idx;
                  const isCorrect = isRevealed && correctAnswerIndex === idx;
                  const isWrongSelected = isRevealed && isSelected && !isCorrect;

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
                      key={idx}
                      type="button"
                      disabled={isLocked || isSubmitting}
                      onClick={() => submitAnswer(idx)}
                      className={`group relative text-left p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 transition-all overflow-hidden ${cardClasses} ${
                        !isLocked ? "hover:-translate-y-1 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer" : ""
                      }`}
                    >
                      {/* Decorative comic scribble in corner */}
                      {!isRevealed && !isSelected && theme.scribble}

                      {/* Option Box Letter (A, B, C, D) */}
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shrink-0 shadow-[1px_1px_0px_#000] ${badgeClasses}`}
                      >
                        {letter}
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 min-w-0 pr-2">
                        <span className={`font-black text-base sm:text-xl leading-snug break-words ${
                          isCorrect || isWrongSelected ? "text-white" : "text-black"
                        }`}>
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
                          <div className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center font-black">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : isWrongSelected ? (
                          <div className="w-7 h-7 rounded-full bg-white text-red-600 flex items-center justify-center font-black">
                            <X className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : isSelected && isLocked ? (
                          <div className="w-7 h-7 rounded-full bg-black text-[#FFE600] flex items-center justify-center font-black">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Reveal Mode: Educational Explanation Accordion */}
              {isRevealed && revealData && (
                <div className="mt-6 p-4 rounded-2xl bg-[#FEF08A] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <ArcadeStarIcon className="w-4 h-4 text-black" />
                      Educational Explanation
                    </span>
                    <span className="font-black text-xs bg-white border border-black px-2 py-0.5 rounded-md">
                      Next question in {revealCountdown}s
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 leading-relaxed">
                    {revealData.explanation || "This option represents the standard definition and logic for this topic."}
                  </p>
                  {isHost && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={advanceRound}
                        className="px-4 py-1.5 bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next Round Now</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: MULTIPLAYER PLAYERS ROSTER & ANSWER STATUS PANEL */}
          {/* ======================================================================= */}
          {!isSoloMatch ? (
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* PLAYERS LEADERBOARD PANEL */}
              <div className="relative bg-white border-[2.5px] border-black rounded-[28px] p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
                
                {/* Header: PLAYERS (4/4) + Stars & Lightning */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#DDD6FE] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                      <Users className="w-5 h-5 text-black stroke-[2.5]" />
                    </div>
                    <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                      PLAYERS ({totalPlayersCount}/4)
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <ArcadeStarIcon className="w-5 h-5 text-[#FFE600]" />
                    <ArcadeLightningIcon className="w-6 h-6 text-[#0D9488]" />
                  </div>
                </div>

                {/* Players List with Custom Ranked Badges */}
                <div className="flex flex-col gap-3">
                  {rankedPlayers.map((player, idx) => {
                    const isMe = player.userId === myId;
                    const theme = PLAYER_CARD_THEMES[idx % PLAYER_CARD_THEMES.length];
                    const avatarRenderer = PLAYER_AVATARS[idx % PLAYER_AVATARS.length];

                    return (
                      <div
                        key={player.userId}
                        className={`relative rounded-2xl border-[2.5px] border-black p-3 sm:p-3.5 shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3 ${theme.bg} ${
                          isMe ? "ring-2 ring-black" : ""
                        }`}
                      >
                        {/* Rank Bookmark Tag (#1, #2, #3, #4) */}
                        <div className="absolute -top-2.5 -left-2 z-10">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md border-2 border-black font-black text-xs shadow-[1px_1px_0px_#000] ${theme.bookmarkBg} text-black`}>
                            #{player.rank}
                            {player.rank === 1 && <ArcadeCrownIcon className="w-3.5 h-3 inline-block" />}
                          </span>
                        </div>

                        {/* Left: Avatar + Name + Answer State */}
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          {/* Circular Avatar */}
                          <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_#000] shrink-0">
                            {avatarRenderer(player)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-sm text-black truncate leading-tight">
                                {player.displayName || player.username}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-stone-700 leading-tight block">
                              {isMe ? "You" : player.isHost ? "Host" : "Guest"}
                            </span>

                            {/* Answer Status Badge & Response Latency */}
                            <div className="mt-1 flex items-center gap-1.5">
                              {player.hasAnswered ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D1FAE5] border border-black font-black text-[10px] text-[#065F46]">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  Answered
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#CFFAFE] border border-black font-black text-[10px] text-[#0369A1]">
                                  <Clock className="w-2.5 h-2.5 stroke-[2.5]" />
                                  Thinking...
                                </span>
                              )}

                              {/* Ping / Latency metric */}
                              <span className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${player.hasAnswered ? "bg-emerald-500" : "bg-sky-500"}`} />
                                {player.timeTakenMs ? `${player.timeTakenMs}ms` : "Live"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Authoritative Player Score */}
                        <div className="shrink-0 text-right">
                          <span className="font-black text-lg sm:text-xl text-black font-mono">
                            {(player.score || 0).toLocaleString()}
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* ANSWER-STATUS PANEL (Below Players List) */}
              <div className="bg-white border-[2.5px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DDD6FE] border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
                    <MessageSquare className="w-5 h-5 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-black">
                      {answeredCount}/{totalPlayersCount} answered
                    </h4>
                    <p className="text-[11px] font-bold text-stone-600">
                      {answeredCount === totalPlayersCount
                        ? "All players answered! Revealing..."
                        : "Waiting for other players..."}
                    </p>
                  </div>
                </div>

                {/* 3 Animated indicator dots */}
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                  <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse [animation-delay:200ms]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse [animation-delay:400ms]" />
                </div>
              </div>

            </div>
          ) : (
            // SOLO MODE ADAPTATION: Solo Statistics Card
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-white border-[2.5px] border-black rounded-[28px] p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-2xl bg-[#FEF08A] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Award className="w-5 h-5 text-black stroke-[2.5]" />
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                    SOLO PRACTICE
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FEF08A] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-black">Questions Remaining</span>
                    <span className="font-mono font-black text-base">{totalQuestions - currentQNumber}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#A7F3D0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-black">Current Potential</span>
                    <span className="font-mono font-black text-base">{potentialScore} pts</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#CFFAFE] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-black">Total Score</span>
                    <span className="font-mono font-black text-base">{(battle?.myScore || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Leave Quiz Confirmation Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7EE] border-[3px] border-black rounded-[28px] p-6 max-w-sm w-full shadow-[8px_8px_0px_#000] space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] border-2 border-black text-red-600 flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <LogOut className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-black">
                Forfeit Quiz Session?
              </h3>
              <p className="text-xs font-bold text-stone-600 mt-2 leading-relaxed">
                Leaving now will abandon your active round and forfeit any points accumulated in this match.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  router.push("/");
                }}
                className="w-full py-3 px-4 rounded-full bg-[#EF4444] hover:bg-red-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                Yes, Leave Quiz
              </button>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="w-full py-3 px-4 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-black font-black text-sm shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Stay &amp; Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
