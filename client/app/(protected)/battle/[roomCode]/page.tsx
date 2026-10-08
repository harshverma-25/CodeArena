"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Users,
  Award,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLiveBattle } from "@/features/battle/hooks/useLiveBattle";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function LiveBattlePage() {
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
    submitAnswer,
    advanceRound,
  } = useLiveBattle(roomCode);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Synchronized navigation to results screen on battle completion
  React.useEffect(() => {
    if (status === "completed" && results?.battleId) {
      router.push(`/results/${results.battleId}`);
    }
  }, [status, results, router]);

  // 1. Loading State
  if (status === "loading" || isUserLoading) {
    return (
      <div className="min-h-screen bg-[#fff8f0] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-4 border-[#317a63]/20 border-t-[#317a63] rounded-full animate-spin" />
          <Sparkles className="h-7 w-7 text-[#317a63] absolute animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-[#1d1b16] tracking-tight font-headline-md">
          Entering Quiz Room
        </h2>
        <p className="text-sm text-[#3f4944] font-mono mt-1">
          Synchronizing quiz with room {roomCode}...
        </p>
      </div>
    );
  }

  // 2. Error State / Invalid Room
  if (status === "error" || errorMessage || (!battle && status !== "completed")) {
    return (
      <div className="min-h-screen bg-[#fff8f0] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-8 bg-white border border-[#ede7de] rounded-[28px] shadow-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffdad6] text-[#ba1a1a]">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-black text-[#1d1b16]">Quiz Session Unavailable</h3>
          <p className="text-sm text-[#3f4944] leading-relaxed">
            {errorMessage ||
              "Unable to connect to this live quiz. The room may have ended or the PIN is invalid."}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#ede7de] text-[#1d1b16] hover:bg-[#f9f3ea] font-semibold text-sm transition-all cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#317a63] text-white hover:bg-[#25604e] font-semibold text-sm transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQIndex = battle?.currentQuestionIndex || 0;
  const currentQNumber = currentQIndex + 1;
  const totalQuestions = battle?.questionCount || 10;
  const matchProgressPct = Math.round((currentQNumber / totalQuestions) * 100);

  const myId = currentUser?._id;
  const isHost = players.length > 0 && players[0].userId === myId;
  const answeredCount = players.filter((p) => p.hasAnswered).length;
  const totalPlayersCount = players.length || 1;

  // Question details
  const questionText = battle?.currentQuestion?.question || "Loading question...";
  const options = battle?.currentQuestion?.options || [];

  // Determine user's reveal outcome
  const myRevealResult = revealData?.players.find((p) => p.userId === myId);
  const isMyAnswerCorrect = myRevealResult?.isCorrect || false;
  const myEarnedScore = myRevealResult?.earnedScore || 0;
  const correctAnswerIndex = revealData?.correctAnswer ?? -1;

  // Active score ticker display
  let displayedScore = potentialScore;
  if (isRevealed) {
    displayedScore = myEarnedScore;
  } else if (isLocked && lockedScore !== null) {
    displayedScore = lockedScore;
  }

  return (
    <div className="bg-[#fff8f0] min-h-screen text-[#1d1b16] flex flex-col font-sans antialiased selection:bg-[#317a63]/20">
      {/* TOP HEADER: Frosted Glass Bar matching Stitch design */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/90 backdrop-blur-xl border-b border-[#ede7de] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Brand + Status Pill + Room PIN */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/images/quizzy-logo.png"
                alt="Quizzy"
                className="h-7 w-auto object-contain"
              />
              <span className="font-extrabold text-xl text-[#317a63] tracking-tight group-hover:opacity-90">
                Quizzy
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 bg-[#f3ede4] px-3 py-1 rounded-full text-[#317a63] font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#317a63] animate-pulse" />
              <span>Live Quiz</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 bg-white border border-[#ede7de] px-3 py-1 rounded-full shadow-sm">
              <span className="text-xs font-semibold text-[#3f4944]">PIN</span>
              <span className="text-xs font-bold text-[#1d1b16] font-mono tracking-wider">
                {roomCode}
              </span>
            </div>
          </div>

          {/* Center: Topic & Round info (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 flex-1 justify-center max-w-xl">
            <span className="text-sm font-bold text-[#1d1b16] truncate">
              {battle?.topic || "Technical Quiz"} — Round {currentQNumber} of {totalQuestions}
            </span>
            <div className="flex items-center gap-1 bg-[#f9f3ea] px-3 py-1 rounded-full border border-[#ede7de]">
              <Users className="w-3.5 h-3.5 text-[#317a63]" />
              <span className="text-xs font-semibold text-[#3f4944]">
                {totalPlayersCount}/4 Connected
              </span>
            </div>
          </div>

          {/* Right: Leave button + User Avatar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#fbeae7] hover:bg-[#f8ded8] text-[#9f2b1d] border border-[#f4c8c0] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Leave Quiz"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-[#317a63] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {currentUser?.displayName?.[0]?.toUpperCase() ||
                currentUser?.username?.[0]?.toUpperCase() ||
                "U"}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full pt-20 flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-4 sm:py-6 flex flex-col">
        {/* Top Match Header & Global Progress Strip */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#ede7de] mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#317a63] font-bold text-xs uppercase tracking-wider border border-[#d2eadc]">
                <span className="w-2 h-2 rounded-full bg-[#317a63] animate-pulse" />
                Live Quiz
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#1d1b16] tracking-tight">
                {battle?.topic || "Technical Quiz"}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f3ede4] text-xs font-bold text-[#3f4944]">
                Round {currentQNumber} of {totalQuestions}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#d9e2ff] text-xs font-bold text-[#003275]">
                {battle?.difficulty ? `${battle.difficulty.toUpperCase()} • ` : ""}
                {battle?.timePerQuestion || 30}s limit
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#3f4944] bg-[#f9f3ea] px-3 py-1.5 rounded-full border border-[#ede7de]">
                <Clock className="w-3.5 h-3.5 text-[#317a63]" />
                <span>
                  Speed Multiplier: <strong className="text-[#1d1b16]">1.0x</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Question Progress Bar Strip */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-medium text-[#3f4944]">
              <span>Quiz Progress ({matchProgressPct}%)</span>
              <span className="font-bold text-[#1d1b16]">
                Question {currentQNumber} / {totalQuestions}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f3ede4] overflow-hidden">
              <div
                className="h-full bg-[#317a63] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${matchProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* DUAL COLUMN MAIN LAYOUT (70% Quiz Main, 30% Player Roster & Context Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: ~70% Quiz Canvas */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Core Question Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#ede7de] relative overflow-hidden flex flex-col">
              {/* Subtle ambient decorative blur element */}
              <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-[#e8f5ee]/60 blur-2xl pointer-events-none" />

              {/* Top Meta Row & Countdown Points Counter */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#f3ede4] text-[#3f4944] rounded-full text-xs font-bold tracking-wider uppercase">
                    QUESTION {currentQNumber < 10 ? `0${currentQNumber}` : currentQNumber}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#3f4944] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#317a63]" />
                    <span>{battle?.topic || "Computer Science"}</span>
                  </div>
                </div>

                {/* Decreasing Score Ticker & SVG Animated Timer Ring */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={`text-3xl sm:text-4xl font-black tracking-tight leading-none tabular-nums font-mono ${
                        isRevealed
                          ? isMyAnswerCorrect
                            ? "text-[#317a63]"
                            : "text-[#ba1a1a]"
                          : isLocked
                          ? "text-[#225bb8]"
                          : "text-[#317a63]"
                      }`}
                    >
                      {isRevealed
                        ? isMyAnswerCorrect
                          ? `+${displayedScore} PTS`
                          : "0 PTS"
                        : `${displayedScore} PTS`}
                    </div>
                    <span className="text-xs text-[#3f4944] font-medium tracking-tight block mt-0.5">
                      {isRevealed ? (
                        isMyAnswerCorrect ? (
                          <span className="text-[#317a63] font-bold">✓ Scored +{myEarnedScore} points</span>
                        ) : (
                          <span className="text-[#ba1a1a] font-bold">✗ Incorrect (0 pts)</span>
                        )
                      ) : isLocked ? (
                        <span>🔒 Locked at {lockedScore || potentialScore} pts</span>
                      ) : (
                        <span className="text-[#317a63] animate-pulse">
                          ⏱️ Points decreasing — tap to lock!
                        </span>
                      )}
                    </span>
                  </div>

                  {/* SVG Animated Circular Timer Ring */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                      <circle
                        className="text-[#f3ede4]"
                        cx="22"
                        cy="22"
                        fill="none"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <circle
                        className={`transition-all duration-100 ${
                          timeRemaining <= 3 ? "text-[#ba1a1a]" : "text-[#317a63]"
                        }`}
                        cx="22"
                        cy="22"
                        fill="none"
                        r="18"
                        stroke="currentColor"
                        strokeDasharray="113.1"
                        strokeDashoffset={113.1 * (1 - timerPercent / 100)}
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <span
                      className={`absolute text-xs font-bold font-mono ${
                        timeRemaining <= 3 ? "text-[#ba1a1a] animate-pulse" : "text-[#1d1b16]"
                      }`}
                    >
                      {timeRemaining}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Timer Progress Line */}
              <div className="w-full h-1.5 bg-[#f3ede4] rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    timeRemaining <= 3 ? "bg-[#ba1a1a]" : "bg-[#317a63]"
                  }`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>

              {/* Core Question Typography */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1d1b16] tracking-tight mb-2 leading-snug">
                {questionText}
              </h2>
              <p className="text-sm text-[#3f4944] mb-6">
                Select the correct option below. Faster answers earn more points.
              </p>

              {/* 2x2 Interactive Answer Option Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((optionText, idx) => {
                  const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
                  const isSelected = selectedOption === idx;
                  const isCorrect = isRevealed && correctAnswerIndex === idx;
                  const isWrongSelected = isRevealed && isSelected && !isCorrect;

                  let cardStyle =
                    "bg-white hover:bg-[#f9f3ea] border border-[#ede7de] text-[#1d1b16] hover:border-[#317a63]/40 hover:-translate-y-0.5 shadow-sm";
                  let badgeStyle = "bg-[#f3ede4] text-[#1d1b16]";

                  if (isCorrect) {
                    cardStyle =
                      "bg-[#317a63] text-white border-2 border-[#317a63] shadow-md -translate-y-0.5";
                    badgeStyle = "bg-white text-[#317a63]";
                  } else if (isWrongSelected) {
                    cardStyle =
                      "bg-[#ba1a1a] text-white border-2 border-[#ba1a1a] shadow-md -translate-y-0.5";
                    badgeStyle = "bg-white text-[#ba1a1a]";
                  } else if (isSelected && isLocked) {
                    cardStyle =
                      "bg-[#eee7df] border-2 border-[#317a63] text-[#1d1b16] shadow-sm";
                    badgeStyle = "bg-[#317a63] text-white";
                  } else if (isLocked) {
                    cardStyle = "bg-white border border-[#ede7de] opacity-60 pointer-events-none";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLocked || isSubmitting}
                      onClick={() => submitAnswer(idx)}
                      className={`group w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-4 ${cardStyle}`}
                    >
                      {/* Option Letter Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${badgeStyle}`}
                      >
                        {letter}
                      </div>

                      {/* Option Content */}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base font-bold truncate">
                          {optionText}
                        </div>
                        {isCorrect && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                            Correct Answer
                          </span>
                        )}
                        {isWrongSelected && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                            Your Choice
                          </span>
                        )}
                      </div>

                      {/* Option Icon Indicator */}
                      <div className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : isWrongSelected ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : isSelected && isLocked ? (
                          <CheckCircle className="w-5 h-5 text-[#317a63]" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waiting Status & Live Multiplayer Submission Strip */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede7de] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isLocked ? "bg-[#e8f5ee] text-[#317a63]" : "bg-[#f3ede4] text-[#3f4944]"
                  }`}
                >
                  {isLocked ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5 animate-spin" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1d1b16]">
                    {isRevealed
                      ? "Round complete — reviewing answer"
                      : isLocked
                      ? "Answer locked in! Waiting for other players..."
                      : "Thinking... select your answer to lock points!"}
                  </div>
                  <div className="text-xs text-[#3f4944]">
                    {answeredCount} of {totalPlayersCount} players have submitted
                  </div>
                </div>
              </div>

              {/* Micro Player State Mini-Avatars */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {players.map((p) => {
                  const isMe = p.userId === myId;
                  const initial = p.displayName?.[0]?.toUpperCase() || p.username?.[0]?.toUpperCase() || "P";
                  return (
                    <div
                      key={p.userId}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        p.hasAnswered
                          ? "bg-[#e8f5ee] border-[#d2eadc] text-[#317a63]"
                          : "bg-[#f9f3ea] border-[#ede7de] text-[#3f4944]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          p.hasAnswered
                            ? "bg-[#317a63] text-white"
                            : "bg-[#bec9c3] text-[#1d1b16]"
                        }`}
                      >
                        {initial}
                      </div>
                      <span>{isMe ? "You" : p.displayName || p.username}</span>
                      {p.hasAnswered ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#317a63]" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#3f4944] animate-spin" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ~30% Side Panel (Player Roster & Explanation) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Live Player Room Roster */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#ede7de] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#ede7de]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#317a63]" />
                  <span className="font-bold text-sm text-[#1d1b16]">Room Players</span>
                </div>
                <span className="text-xs font-semibold text-[#3f4944]">
                  {totalPlayersCount} Connected
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {players.map((p, idx) => {
                  const isMe = p.userId === myId;
                  const initial =
                    p.displayName?.[0]?.toUpperCase() || p.username?.[0]?.toUpperCase() || "P";

                  return (
                    <div
                      key={p.userId}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                        isMe ? "bg-[#f9f3ea] border border-[#ede7de]" : "bg-white border border-[#ede7de]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              isMe
                                ? "bg-[#317a63] text-white"
                                : "bg-[#f3ede4] text-[#1d1b16]"
                            }`}
                          >
                            {initial}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                              p.isDisconnected
                                ? "bg-[#ba1a1a]"
                                : "bg-[#317a63]"
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#1d1b16] truncate flex items-center gap-1.5">
                            <span className="truncate">{p.displayName || p.username}</span>
                            {p.isHost && (
                              <span className="px-1.5 py-0.2 rounded bg-[#e8f5ee] text-[#317a63] text-[9px] font-bold uppercase border border-[#d2eadc]">
                                Host
                              </span>
                            )}
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded bg-[#f3ede4] text-[#3f4944] text-[9px] font-bold uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#3f4944] font-medium flex items-center gap-1 mt-0.5">
                            {p.hasAnswered ? (
                              <span className="text-[#317a63] flex items-center gap-1 font-semibold">
                                <CheckCircle className="w-3 h-3" />
                                Submitted {p.timeTakenMs ? `(${(p.timeTakenMs / 1000).toFixed(1)}s)` : ""}
                              </span>
                            ) : (
                              <span className="text-[#3f4944] flex items-center gap-1">
                                <Clock className="w-3 h-3 animate-spin" />
                                Thinking...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Player Score */}
                      <span className="text-sm font-bold font-mono text-[#317a63] shrink-0">
                        {p.score} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Answer Reveal & Educational Explanation Panel */}
            {isRevealed && revealData ? (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#ede7de] flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider text-[#317a63] uppercase font-mono">
                    EDUCATIONAL BREAKDOWN
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isMyAnswerCorrect
                        ? "bg-[#e8f5ee] text-[#317a63] border border-[#d2eadc]"
                        : "bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb4a8]"
                    }`}
                  >
                    {isMyAnswerCorrect ? `+${myEarnedScore} pts Earned` : "0 pts Earned"}
                  </span>
                </div>

                {/* Highlight Status Banner */}
                <div
                  className={`p-3.5 rounded-xl flex items-start gap-3 border ${
                    isMyAnswerCorrect
                      ? "bg-[#e8f5ee] border-[#d2eadc] text-[#10614b]"
                      : "bg-[#ffdad6] border-[#ffb4a8] text-[#ba1a1a]"
                  }`}
                >
                  {isMyAnswerCorrect ? (
                    <CheckCircle className="w-5 h-5 text-[#317a63] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm font-bold text-[#1d1b16]">
                      {isMyAnswerCorrect
                        ? `Option ${OPTION_LETTERS[correctAnswerIndex]}: Correct!`
                        : `Option ${OPTION_LETTERS[correctAnswerIndex]} was the correct answer.`}
                    </div>
                    <div className="text-xs text-[#3f4944] mt-0.5">
                      {isMyAnswerCorrect
                        ? "Speed bonus applied based on server-side response timing."
                        : "No points awarded for incorrect response or timeout."}
                    </div>
                  </div>
                </div>

                {/* Educational Body */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1d1b16] mb-1">
                    Why is this correct?
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed">
                    {revealData.explanation ||
                      "The correct answer represents the standard definition and protocol implementation."}
                  </p>
                </div>

                {/* Match Accuracy Metric */}
                <div className="pt-2 border-t border-[#ede7de] flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#3f4944]">Round Accuracy (Round {currentQNumber})</span>
                    <span className="text-[#317a63] font-bold">
                      {revealData.accuracyPct}% ({revealData.correctCount} of {revealData.totalPlayers}{" "}
                      correct)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#f3ede4] overflow-hidden">
                    <div
                      className="h-full bg-[#317a63] rounded-full transition-all duration-500"
                      style={{ width: `${revealData.accuracyPct}%` }}
                    />
                  </div>
                </div>

                {/* Next Question Countdown & Early Skip Button */}
                <div className="pt-2 border-t border-[#ede7de] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#3f4944] font-medium font-mono">
                    Next in {revealCountdown}s...
                  </span>

                  {isHost && (
                    <button
                      type="button"
                      onClick={advanceRound}
                      className="px-4 py-1.5 bg-[#317a63] hover:bg-[#25604e] text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Next Round</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#ede7de] flex flex-col items-center justify-center text-center p-6 text-[#3f4944] gap-2">
                <Clock className="w-8 h-8 text-[#317a63] animate-pulse" />
                <span className="text-sm font-bold text-[#1d1b16]">Round In Progress</span>
                <p className="text-xs max-w-xs text-[#3f4944]">
                  Educational breakdown and accuracy statistics will be displayed once all players submit or the timer expires.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f9f3ea] border-t border-[#ede7de] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#3f4944]">
          <div className="flex items-center gap-2">
            <span>Room PIN: {roomCode}</span>
            <span>•</span>
            <span>{isHost ? "Host Session Active" : "Player Session Active"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Multiplayer Game Engine</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#317a63]" />
              <span className="text-[#317a63] font-semibold">Low Latency Sync</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Quizzy Leave Confirmation Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fff8f0] border border-[#ede7de] rounded-[28px] p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdad6] text-[#9f2b1d] flex items-center justify-center mx-auto shadow-sm">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1d1b16] tracking-tight">
                Leave Quizzy Match?
              </h3>
              <p className="text-xs text-[#3f4944] mt-2 leading-relaxed">
                If you leave now, your active quiz progress will be abandoned and your match will be forfeited.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  router.push("/");
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#9f2b1d] hover:bg-[#852216] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Yes, Leave Match
              </button>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#f3ede4] text-[#1d1b16] border border-[#ede7de] font-bold text-xs transition-all cursor-pointer"
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
