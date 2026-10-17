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
import { useQuizExitGuard } from "@/features/battle/hooks/useQuizExitGuard";
import { ExitQuizModal } from "@/features/battle/components/ExitQuizModal";
import {
  BattleTimerCard,
  MobileTimerPill,
  ScoreTicker,
  RevealCountdownBadge,
  MaxRoundValueBadge,
  AnswerOptionCard,
  PlayerRosterItem,
  QuestionProgressCard,
} from "@/features/battle";

const OPTION_LETTERS = ["A", "B", "C", "D"];

// 4 distinct pastel color themes for the 2x2 option cards matching the screenshot
const OPTION_THEMES = [
  {
    bg: "bg-[#A7F3D0]", // Option A: Pastel Mint / Aqua
    hoverBg: "hover:bg-[#6EE7B7]",
    border: "border-black",
    letterBg: "bg-white",
    scribble: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600/40 absolute right-3.5 bottom-1.5 pointer-events-none" viewBox="0 0 40 40" fill="none">
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
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600/40 absolute right-3.5 bottom-1.5 pointer-events-none" viewBox="0 0 40 40" fill="none">
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
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-pink-600/40 absolute right-3.5 bottom-1.5 pointer-events-none" viewBox="0 0 40 40" fill="none">
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
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600/40 absolute right-3.5 bottom-1.5 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
        <path d="M26 14L34 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
];

// Fallback avatars for player card slots 1 to 4
const PLAYER_AVATARS = [
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <GamerBoyAvatar className="w-full h-full" />,
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <GamerGirlAvatar className="w-full h-full" />,
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <GamerCapAvatar className="w-full h-full" />,
  (p: LiveBattlePlayer) => p.avatar ? <img src={p.avatar} alt={p.displayName} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <GamerOrangeAvatar className="w-full h-full" />,
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
    lockedScore,
    isRevealed,
    revealData,
    results,
    status,
    errorMessage,
    isSocketDisconnected,
    submitAnswer,
    advanceRound,
    reconnectBattle,
    forfeitBattle,
  } = useLiveBattle(roomCode);

  const isQuizActive = (status === "active" || status === "reveal") && !battle?.isMyCompleted;

  const {
    isExitModalOpen,
    isExiting,
    openExitModal,
    closeExitModal,
    confirmExit,
  } = useQuizExitGuard({
    isQuizActive,
    onExitQuiz: forfeitBattle,
    defaultExitPath: "/",
  });

  // Synchronized navigation to results screen on battle completion
  useEffect(() => {
    if (status === "completed" && results?.battleId) {
      router.push(`/results/${results.battleId}`);
    }
  }, [status, results, router]);

  const currentQIndex = battle?.currentQuestionIndex || 0;

  // Automatically scroll to the top whenever a new question is presented (especially on mobile)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentQIndex]);

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
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 pb-12 select-none relative overflow-x-hidden font-sans">
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
      <main className="w-full max-w-[1360px] lg:max-w-[1290px] mx-auto px-4 sm:px-6 lg:px-7 pt-[86px] sm:pt-[90px] lg:pt-[84px] space-y-4 sm:space-y-5 lg:space-y-4">
        
        {/* DUAL-COLUMN LAYOUT: Left (Quiz Gameplay) & Right (Scorecard & Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-4.5 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: CORE QUESTION CARD & STATS CARDS */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5 lg:gap-3.5">
            
            {/* 3 STATS CARDS (TIMER, QUESTION PROGRESS, SCORE) */}
            {/* On mobile: placed below Question Card (order-2); On desktop: placed at top (lg:order-1) */}
            <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-3">
              
              {/* CARD A: ISOLATED TIMER CARD */}
              <BattleTimerCard
                roundStartedAt={battle?.roundStartedAt || 0}
                timePerQuestion={battle?.timePerQuestion || 30}
                isLocked={isLocked}
                isRevealed={isRevealed}
                status={status}
              />

              {/* CARD B: QUESTION PROGRESS CARD */}
              <QuestionProgressCard
                currentQNumber={currentQNumber}
                totalQuestions={totalQuestions}
                currentQIndex={currentQIndex}
              />

              {/* CARD C: YOUR SCORE CARD */}
              <div className="relative bg-[#DDD6FE] border-[2.5px] border-black rounded-[22px] p-3.5 sm:p-4 lg:p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-2.5">
                  {/* Golden Trophy Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-9.5 lg:h-9.5 rounded-2xl lg:rounded-xl bg-[#FEF08A] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="font-black text-2xl sm:text-3xl lg:text-[26px] text-black leading-none font-mono tracking-tight">
                      {(battle?.myScore || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-stone-900 uppercase mt-0.5 block">
                      YOUR SCORE
                    </span>
                  </div>
                </div>

                {/* Live points ticker info */}
                <ScoreTicker
                  roundStartedAt={battle?.roundStartedAt || 0}
                  isLocked={isLocked}
                  isRevealed={isRevealed}
                  isMyAnswerCorrect={isMyAnswerCorrect}
                  myEarnedScore={myEarnedScore}
                />
              </div>

            </div>

            {/* CARD D: QUESTION PANEL & ANSWER OPTIONS */}
            {/* On mobile: placed FIRST at top (order-1); On desktop: placed under stats cards (lg:order-2) */}
            <div className="order-1 lg:order-2 relative bg-white border-[2.5px] border-black rounded-[26px] lg:rounded-[22px] p-5 sm:p-7 lg:p-5.5 shadow-[5px_5px_0px_#000] overflow-hidden">
              
              {/* Large subtle question mark watermark in background */}
              <div className="absolute -right-4 top-10 pointer-events-none opacity-10 select-none">
                <span className="font-black text-9xl text-stone-900 font-mono">?</span>
              </div>

              {/* Category / Subject Badge + Live Mobile Timer + Exit Quiz Action Button */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDD6FE] border-2 border-black shadow-[2px_2px_0px_#000]">
                    <span className="font-mono font-black text-xs text-black">
                      &lt;/&gt;
                    </span>
                    <span className="font-black text-xs uppercase tracking-wider text-black">
                      {categoryTopic}
                    </span>
                  </div>
                  {/* Mobile-only timer pill so user at top always sees remaining time without scrolling */}
                  <MobileTimerPill
                    roundStartedAt={battle?.roundStartedAt || 0}
                    timePerQuestion={battle?.timePerQuestion || 30}
                    isRevealed={isRevealed}
                    status={status}
                  />
                  <ArcadeCrownIcon className="w-6 h-5 hidden sm:inline-block" />
                </div>

                <button
                  type="button"
                  id="header-exit-quiz-button"
                  onClick={() => openExitModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black transition-all cursor-pointer"
                  title="Exit this quiz"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Exit Quiz</span>
                </button>
              </div>

              {/* Core Question Typography */}
              <h2 className="font-black text-2xl sm:text-3xl lg:text-[27px] xl:text-[31px] text-black leading-snug mb-2 lg:mb-1.5 tracking-tight">
                {questionText}
              </h2>

              {/* Instructions Subtitle */}
              <p className="font-bold text-xs sm:text-sm text-stone-600 mb-5 lg:mb-3.5">
                {isRevealed
                  ? "Round ended. Review the answer below!"
                  : "Choose the correct answer before the timer runs out!"}
              </p>

              {/* 2x2 Interactive Answer Options Grid (Stacked 1-col on mobile, 2-col on sm+) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-3">
                {options.map((optionText, idx) => (
                  <AnswerOptionCard
                    key={idx}
                    idx={idx}
                    letter={OPTION_LETTERS[idx] || `${idx + 1}`}
                    optionText={optionText}
                    theme={OPTION_THEMES[idx % OPTION_THEMES.length]}
                    isSelected={selectedOption === idx}
                    isLocked={isLocked}
                    isSubmitting={isSubmitting}
                    isRevealed={isRevealed}
                    isCorrect={isRevealed && correctAnswerIndex === idx}
                    isWrongSelected={isRevealed && selectedOption === idx && correctAnswerIndex !== idx}
                    onSelect={submitAnswer}
                  />
                ))}
              </div>

              {/* Reveal Mode: Educational Explanation Accordion */}
              {isRevealed && revealData && (
                <div className="mt-5 lg:mt-4 p-4 lg:p-3.5 rounded-2xl bg-[#FEF08A] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <ArcadeStarIcon className="w-4 h-4 text-black" />
                      Educational Explanation
                    </span>
                    <RevealCountdownBadge
                      isRevealed={isRevealed}
                      revealDurationSec={revealData.revealDurationSec || 5}
                    />
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
          {/* RIGHT COLUMN: MULTIPLAYER PLAYERS ROSTER & ANSWER STATUS PANEL / SOLO */}
          {/* ======================================================================= */}
          {!isSoloMatch ? (
            <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 lg:gap-3.5">
              
              {/* PLAYERS LEADERBOARD PANEL */}
              <div className="relative bg-white border-[2.5px] border-black rounded-[26px] lg:rounded-[22px] p-4.5 sm:p-5.5 lg:p-4 shadow-[5px_5px_0px_#000]">
                
                {/* Header: PLAYERS (4/4) + Stars & Lightning */}
                <div className="flex items-center justify-between mb-3.5 lg:mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#DDD6FE] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                      <Users className="w-5 h-5 text-black stroke-[2.5]" />
                    </div>
                    <h3 className="font-black text-base sm:text-lg lg:text-base text-black uppercase tracking-tight">
                      PLAYERS ({totalPlayersCount}/4)
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <ArcadeStarIcon className="w-5 h-5 text-[#FFE600]" />
                    <ArcadeLightningIcon className="w-6 h-6 text-[#0D9488]" />
                  </div>
                </div>

                {/* Players List with Custom Ranked Badges */}
                <div className="flex flex-col gap-2.5 lg:gap-2">
                  {rankedPlayers.map((player, idx) => (
                    <PlayerRosterItem
                      key={player.userId}
                      player={player}
                      isMe={player.userId === myId}
                      theme={PLAYER_CARD_THEMES[idx % PLAYER_CARD_THEMES.length]}
                      avatarRenderer={PLAYER_AVATARS[idx % PLAYER_AVATARS.length]}
                    />
                  ))}
                </div>

              </div>

              {/* ANSWER-STATUS PANEL (Below Players List) */}
              <div className="bg-white border-[2.5px] border-black rounded-2xl p-3.5 sm:p-4 lg:p-3 shadow-[4px_4px_0px_#000] flex items-center justify-between">
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

              {/* ACTION CONTROLS PANEL (Right Side Button Div) */}
              <div className="bg-white border-[2.5px] border-black rounded-[26px] lg:rounded-[22px] p-4 sm:p-5 lg:p-3.5 shadow-[5px_5px_0px_#000] flex flex-col gap-2.5 lg:gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-stone-700">
                    Match Controls
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500">
                    {isHost ? "Room Host" : "Player"}
                  </span>
                </div>

                {isRevealed && isHost && (
                  <button
                    type="button"
                    onClick={advanceRound}
                    className="w-full py-2.5 sm:py-3 lg:py-2.5 px-4 bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Next Round Now</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

                <button
                  type="button"
                  id="multiplayer-sidebar-exit-quiz-button"
                  onClick={() => openExitModal()}
                  className="w-full py-2.5 sm:py-3 lg:py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>Exit Quiz</span>
                </button>
              </div>

            </div>
          ) : (
            // SOLO MODE: Right side Scorecard & Action Controls
            <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 lg:gap-3.5">
              <div className="bg-white border-[2.5px] border-black rounded-[26px] lg:rounded-[22px] p-4.5 sm:p-5.5 lg:p-4 shadow-[5px_5px_0px_#000]">
                <div className="flex items-center justify-between mb-3.5 lg:mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 lg:w-9 lg:h-9 rounded-2xl lg:rounded-xl bg-[#FEF08A] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                      <Trophy className="w-5 h-5 lg:w-4.5 lg:h-4.5 text-black stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg lg:text-base text-black uppercase tracking-tight leading-tight">
                        SCORECARD
                      </h3>
                      <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">
                        Solo Practice Mode
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArcadeStarIcon className="w-5 h-5 text-[#FFE600]" />
                  </div>
                </div>

                <div className="space-y-2.5 lg:space-y-2">
                  <div className="p-3 sm:p-3.5 lg:p-2.5 rounded-2xl lg:rounded-xl bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-stone-700">Question Progress</span>
                    <span className="font-mono font-black text-base lg:text-sm text-black">
                      {currentQNumber} / {totalQuestions}
                    </span>
                  </div>

                  <div className="p-3 sm:p-3.5 lg:p-2.5 rounded-2xl lg:rounded-xl bg-[#DDD6FE] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-stone-900">Total Score</span>
                    <span className="font-mono font-black text-lg lg:text-base text-black">
                      {(battle?.myScore || 0).toLocaleString()} <span className="text-xs">pts</span>
                    </span>
                  </div>

                  <div className="p-3 sm:p-3.5 lg:p-2.5 rounded-2xl lg:rounded-xl bg-[#CFFAFE] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-stone-900">Questions Remaining</span>
                    <span className="font-mono font-black text-base lg:text-sm text-black">
                      {Math.max(0, totalQuestions - currentQNumber)}
                    </span>
                  </div>

                  <div className="p-3 sm:p-3.5 lg:p-2.5 rounded-2xl lg:rounded-xl bg-[#FEF08A] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                    <span className="font-black text-xs text-stone-900">Max Round Value</span>
                    <MaxRoundValueBadge
                      roundStartedAt={battle?.roundStartedAt || 0}
                      isLocked={isLocked}
                    />
                  </div>
                </div>
              </div>

              {/* ACTION CONTROLS PANEL (Right Side Button Div) */}
              <div className="bg-white border-[2.5px] border-black rounded-[26px] lg:rounded-[22px] p-4 sm:p-5 lg:p-3.5 shadow-[5px_5px_0px_#000] flex flex-col gap-2.5 lg:gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-stone-700">
                    Quiz Actions
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500">
                    Solo Session
                  </span>
                </div>

                {isRevealed && (
                  <button
                    type="button"
                    onClick={advanceRound}
                    className="w-full py-2.5 sm:py-3 lg:py-2.5 px-4 bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Next Round Now</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

                <button
                  type="button"
                  id="solo-sidebar-exit-quiz-button"
                  onClick={() => openExitModal()}
                  className="w-full py-2.5 sm:py-3 lg:py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>Exit Quiz</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Exit Quiz Confirmation Modal */}
      <ExitQuizModal
        isOpen={isExitModalOpen}
        isExiting={isExiting}
        onStay={closeExitModal}
        onExit={confirmExit}
      />

    </div>
  );
}
