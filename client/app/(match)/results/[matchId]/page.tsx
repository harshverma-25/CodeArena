"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBattleResult } from "@/features/battle/hooks/useBattleResult";
import { useBattleMutations } from "@/features/battle/hooks/useBattleMutations";
import { useBattleStore } from "@/store/battleStore";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  Trophy,
  Award,
  Medal,
  Check,
  X,
  Clock,
  Sparkles,
  Home,
  Compass,
  RotateCcw,
  Users,
  Star,
  Target,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

export default function MatchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = (params.matchId as string) || "";

  const { data: currentUser } = useCurrentUser();
  const { data: results, isLoading, isError, error, refetch } = useBattleResult(matchId);
  const { createRoom } = useBattleMutations();
  const { resetBattle } = useBattleStore();

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useEffect(() => {
    // Reset active live battle state when viewing report card
    resetBattle();
  }, [resetBattle]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#fff8f0] text-[#1d1b16] p-6 flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center space-y-4 text-center max-w-sm">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#317a63]/20 border-t-[#317a63] rounded-full animate-spin" />
            <Trophy className="h-7 w-7 text-[#317a63] absolute animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-[#1d1b16] tracking-tight">
            Finalizing Game Results
          </h2>
          <p className="text-xs text-[#3f4944] leading-relaxed">
            Gathering server-authoritative scores, rankings, and response analytics...
          </p>
        </div>
      </div>
    );
  }

  // Error State / Unauthorized / Not Found
  if (isError || !results) {
    const isForbidden = error?.message?.includes("Unauthorized") || error?.message?.includes("403");

    return (
      <div className="min-h-screen w-full bg-[#fff8f0] text-[#1d1b16] p-6 flex flex-col items-center justify-center font-sans">
        <div className="mx-auto max-w-md w-full text-center p-8 bg-white border border-[#ede7de] rounded-[28px] space-y-5 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffdad6] text-[#ba1a1a]">
            {isForbidden ? <ShieldAlert className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-[#1d1b16]">
              {isForbidden ? "Access Restricted" : "Quiz Results Unavailable"}
            </h3>
            <p className="text-xs text-[#3f4944] leading-relaxed">
              {error?.message ||
                "Unable to retrieve quiz performance report. Please verify your permissions or try again."}
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2 text-xs font-semibold">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#ede7de] text-[#1d1b16] hover:bg-[#f9f3ea] transition-all"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#317a63] text-white hover:bg-[#25604e] transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myId = currentUser?._id;

  // Authoritative ranking: Sort players descending by score, tie-break by total response time
  const sortedPlayers = [...results.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aTime = a.questions ? a.questions.reduce((sum, q) => sum + (q.timeTakenMs || 0), 0) : 0;
    const bTime = b.questions ? b.questions.reduce((sum, q) => sum + (q.timeTakenMs || 0), 0) : 0;
    return aTime - bTime;
  });

  // Calculate ranks supporting shared ranks for ties
  let currentRank = 1;
  const rankedPlayers = sortedPlayers.map((player, index) => {
    if (index > 0 && player.score < sortedPlayers[index - 1].score) {
      currentRank = index + 1;
    }
    const totalTimeMs = player.questions
      ? player.questions.reduce((sum, q) => sum + (q.timeTakenMs || 0), 0)
      : 0;
    const avgSpeedSec =
      player.totalQuestions > 0 ? (totalTimeMs / player.totalQuestions / 1000).toFixed(1) : "0.0";

    return {
      ...player,
      rank: currentRank,
      avgSpeedSec,
      totalTimeMs,
    };
  });

  // Podium slots (Top 3)
  const firstPlace = rankedPlayers[0] || null;
  const secondPlace = rankedPlayers[1] || null;
  const thirdPlace = rankedPlayers[2] || null;

  // Remaining players (4th place and beyond)
  const remainingPlayers = rankedPlayers.slice(3);

  // Current user's performance
  const myPlayer =
    rankedPlayers.find((p) => p.userId === myId) || rankedPlayers[0];
  const myAccuracy = myPlayer.totalQuestions > 0
    ? Math.round((myPlayer.correctCount / myPlayer.totalQuestions) * 100)
    : 0;
  const myQuestions = myPlayer.questions || [];

  const fastestQuestionMs =
    myQuestions.length > 0
      ? Math.min(
          ...myQuestions.filter((q) => q.timeTakenMs > 0).map((q) => q.timeTakenMs),
          999999
        )
      : 0;
  const fastestRoundSec =
    fastestQuestionMs > 0 && fastestQuestionMs < 999999
      ? (fastestQuestionMs / 1000).toFixed(1)
      : "1.4";

  // Check if current user is host (first player in original players list)
  const isHost = results.players.length > 0 && results.players[0].userId === myId;

  // Play Again action
  const handlePlayAgain = async () => {
    try {
      setIsCreatingRoom(true);
      const newRoom = await createRoom.mutateAsync({
        topic: results.topic,
        categoryId: results.categoryId,
        subjectId: results.isMixedCategory ? null : results.subjectId,
        isMixedCategory: Boolean(results.isMixedCategory),
        difficulty: (results.difficulty as any) || "Easy",
        duration: results.timePerQuestion || 30,
        questionCount: results.questionCount,
      });
      router.push(`/lobby/${newRoom.roomCode}`);
    } catch (err: any) {
      alert(err.message || "Failed to create new quiz room.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="bg-[#fff8f0] min-h-screen text-[#1d1b16] font-sans antialiased flex flex-col justify-between selection:bg-[#317a63]/20">
      {/* HEADER: Frosted Glass Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/85 backdrop-blur-xl border-b border-[#ede7de] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-extrabold text-xl text-[#317a63] tracking-tight">Quizly</span>
            <div className="h-4 w-px bg-[#ede7de] shrink-0" />
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm font-bold text-[#1d1b16] truncate">{results.topic}</span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#a8f1d5] text-[#002117] text-xs font-bold">
                Quiz Completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <nav className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-[#eee7df] text-[#1d1b16] font-semibold text-xs rounded-full">
                Multiplayer Results
              </span>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3f4944] hover:text-[#1d1b16] hover:bg-[#eee7df] transition-colors"
              >
                Return Home
              </button>
            </nav>
            <div className="w-8 h-8 rounded-full bg-[#317a63] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {currentUser?.displayName?.[0]?.toUpperCase() ||
                currentUser?.username?.[0]?.toUpperCase() ||
                "U"}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="w-full pt-20 flex-1">
        <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8">
          {/* TOP CELEBRATION & MATCH METADATA */}
          <div className="text-center relative mb-10">
            {/* Confetti Decorative SVG Sparks */}
            <div className="absolute inset-0 -top-6 flex items-center justify-between pointer-events-none opacity-40 max-w-2xl mx-auto">
              <svg className="text-[#317a63] animate-pulse" fill="none" height="42" viewBox="0 0 42 42" width="42">
                <path d="M21 0L24 16L40 21L24 26L21 42L18 26L2 21L18 16L21 0Z" fill="currentColor" />
              </svg>
              <svg className="text-[#c04332] translate-y-6" fill="none" height="28" viewBox="0 0 28 28" width="28">
                <circle cx="14" cy="14" fill="currentColor" r="6" />
                <path d="M14 0V6M14 22V28M0 14H6M22 14H28" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
              <svg className="text-[#6d9cfd] -translate-y-2" fill="none" height="34" viewBox="0 0 34 34" width="34">
                <rect fill="currentColor" height="16" rx="4" transform="rotate(45 17 2)" width="16" x="17" y="2" />
              </svg>
            </div>

            {/* Main Trophy Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#a8f1d5] text-[#002117] mb-3 shadow-sm">
              <Trophy className="w-8 h-8 text-[#10614b]" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1d1b16] tracking-tight mb-2">
              Quiz Completed!
            </h1>
            <p className="text-base sm:text-lg text-[#3f4944] max-w-lg mx-auto mb-5 leading-relaxed">
              What an amazing game! Here's how everyone performed in this room.
            </p>

            {/* Match Metadata Strip */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 bg-[#f3ede4] rounded-full text-[#3f4944] text-xs font-semibold shadow-sm border border-[#ede7de]">
              <span className="inline-flex items-center gap-1 font-bold text-[#1d1b16]">
                <Sparkles className="w-3.5 h-3.5 text-[#317a63]" />
                {results.topic}
              </span>
              <span className="text-[#bec9c3]">•</span>
              <span className="inline-flex items-center gap-1">
                <span>{results.questionCount} Questions</span>
              </span>
              <span className="text-[#bec9c3]">•</span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#317a63]" />
                <span>{results.players.length} Players</span>
              </span>
              <span className="text-[#bec9c3]">•</span>
              <span className="inline-flex items-center gap-1 font-mono">
                PIN: <strong className="text-[#1d1b16]">{results.roomCode}</strong>
              </span>
            </div>
          </div>

          {/* 3-TIER WINNERS PODIUM */}
          <div className="w-full bg-white rounded-[24px] p-6 sm:p-8 shadow-sm mb-6 relative overflow-hidden border border-[#ede7de]">
            {/* Ambient Glow Behind Champion */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#a8f1d5]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-3xl mx-auto pt-6 pb-2">
              {/* 2nd PLACE (Silver / Left) */}
              <div className="flex flex-col items-center">
                {secondPlace ? (
                  <>
                    <div className="relative mb-2 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#e8e2d9] text-[#3f4944] text-xs flex items-center justify-center font-bold mb-1 shadow-sm">
                        #{secondPlace.rank}
                      </div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[#eee7df] shadow-md flex items-center justify-center font-bold text-lg text-[#3f4944] border border-[#ede7de]">
                        {secondPlace.displayName?.[0]?.toUpperCase() ||
                          secondPlace.username?.[0]?.toUpperCase() ||
                          "P"}
                      </div>
                      {secondPlace.userId === myId && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#225bb8] text-white text-[9px] px-2 py-0.2 rounded-full shadow font-bold uppercase">
                          You
                        </span>
                      )}
                    </div>

                    <div className="text-center mb-3 px-1">
                      <h3 className="text-sm sm:text-base text-[#1d1b16] truncate font-bold">
                        {secondPlace.displayName || secondPlace.username}
                      </h3>
                      <div className="text-lg sm:text-xl font-black text-[#1d1b16] tracking-tight mt-0.5">
                        {secondPlace.score.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-[#3f4944]">pts</span>
                      </div>
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-[#f3ede4] text-[#3f4944] text-[11px] font-semibold">
                        {secondPlace.correctCount}/{secondPlace.totalQuestions} Correct
                      </div>
                    </div>

                    {/* Podium Step */}
                    <div className="w-full h-36 sm:h-44 bg-[#f3ede4] rounded-t-[20px] flex flex-col items-center justify-center p-2 shadow-inner text-center">
                      <Medal className="w-7 h-7 text-[#6f7974] mb-1" />
                      <span className="text-sm font-bold text-[#3f4944]">2nd Place</span>
                      <span className="text-xs text-[#6f7974]">Silver</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-24 bg-[#faf7f2] rounded-t-[20px] border border-dashed border-[#ede7de] flex items-center justify-center text-xs text-[#bec9c3]">
                    Empty Slot
                  </div>
                )}
              </div>

              {/* 1st PLACE (Champion Gold / Center) */}
              <div className="flex flex-col items-center -mt-6 z-10">
                {firstPlace && (
                  <>
                    <div className="relative mb-2 flex flex-col items-center">
                      <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#a8f1d5] text-[#002117] text-xs font-bold shadow-sm mb-1.5 animate-bounce">
                        <Trophy className="w-3.5 h-3.5 text-[#10614b]" />
                        <span>#1 Champion</span>
                      </div>

                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-b from-[#10614b] to-[#317a63] shadow-xl">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center font-extrabold text-2xl text-[#10614b]">
                          {firstPlace.displayName?.[0]?.toUpperCase() ||
                            firstPlace.username?.[0]?.toUpperCase() ||
                            "C"}
                        </div>
                        {firstPlace.userId === myId && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#10614b] text-white text-[10px] px-2.5 py-0.5 rounded-full shadow font-bold tracking-wide uppercase">
                            You
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center mb-3 px-1 mt-1">
                      <h2 className="text-base sm:text-lg text-[#1d1b16] font-extrabold truncate">
                        {firstPlace.displayName || firstPlace.username}
                      </h2>
                      <div className="text-3xl sm:text-4xl font-black text-[#10614b] tracking-tight leading-none mt-1">
                        {firstPlace.score.toLocaleString()}{" "}
                        <span className="text-base font-semibold text-[#10614b]/80">pts</span>
                      </div>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f5ee] text-[#10614b] text-xs font-bold border border-[#d2eadc]">
                        <span>
                          {firstPlace.correctCount}/{firstPlace.totalQuestions} Correct
                        </span>
                        <span>•</span>
                        <span>{firstPlace.avgSpeedSec}s Avg</span>
                      </div>
                    </div>

                    {/* Highest Podium Step */}
                    <div className="w-full h-48 sm:h-60 bg-gradient-to-b from-[#8cd5ba]/30 via-[#f3ede4] to-[#eee7df] rounded-t-[24px] flex flex-col items-center justify-center p-2 shadow-md text-center">
                      <div className="w-10 h-10 rounded-full bg-[#10614b] flex items-center justify-center text-white mb-1 shadow">
                        <Star className="w-5 h-5 fill-white" />
                      </div>
                      <span className="text-base sm:text-lg font-bold text-[#1d1b16]">1st Place</span>
                      <span className="text-xs text-[#10614b] font-bold">Gold Champion</span>
                    </div>
                  </>
                )}
              </div>

              {/* 3rd PLACE (Bronze / Right) */}
              <div className="flex flex-col items-center">
                {thirdPlace ? (
                  <>
                    <div className="relative mb-2 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#e8e2d9] text-[#3f4944] text-xs flex items-center justify-center font-bold mb-1 shadow-sm">
                        #{thirdPlace.rank}
                      </div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[#eee7df] shadow-md flex items-center justify-center font-bold text-lg text-[#3f4944] border border-[#ede7de]">
                        {thirdPlace.displayName?.[0]?.toUpperCase() ||
                          thirdPlace.username?.[0]?.toUpperCase() ||
                          "P"}
                      </div>
                      {thirdPlace.userId === myId && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#225bb8] text-white text-[9px] px-2 py-0.2 rounded-full shadow font-bold uppercase">
                          You
                        </span>
                      )}
                    </div>

                    <div className="text-center mb-3 px-1">
                      <h3 className="text-sm sm:text-base text-[#1d1b16] truncate font-bold">
                        {thirdPlace.displayName || thirdPlace.username}
                      </h3>
                      <div className="text-lg sm:text-xl font-black text-[#1d1b16] tracking-tight mt-0.5">
                        {thirdPlace.score.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-[#3f4944]">pts</span>
                      </div>
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-[#f3ede4] text-[#3f4944] text-[11px] font-semibold">
                        {thirdPlace.correctCount}/{thirdPlace.totalQuestions} Correct
                      </div>
                    </div>

                    {/* Podium Step */}
                    <div className="w-full h-28 sm:h-36 bg-[#f3ede4] rounded-t-[20px] flex flex-col items-center justify-center p-2 shadow-inner text-center">
                      <Award className="w-6 h-6 text-[#9f2b1d]/80 mb-1" />
                      <span className="text-sm font-bold text-[#3f4944]">3rd Place</span>
                      <span className="text-xs text-[#6f7974]">Bronze</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-24 bg-[#faf7f2] rounded-t-[20px] border border-dashed border-[#ede7de] flex items-center justify-center text-xs text-[#bec9c3]">
                    Empty Slot
                  </div>
                )}
              </div>
            </div>

            {/* Tie & Integrity Note Footer */}
            <div className="mt-4 pt-3 border-t border-[#ede7de] text-center text-xs text-[#3f4944] flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#317a63]" />
              <span>Scores calculated via speed-weighted accuracy. Ties broken by millisecond response delta.</span>
            </div>
          </div>

          {/* 4TH PLACE SECTION (Horizontal Compact Strip for 4-Player Matches) */}
          {remainingPlayers.map((player) => {
            const isMe = player.userId === myId;
            return (
              <div
                key={player.userId}
                className="w-full bg-white rounded-[20px] p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#ede7de]"
              >
                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-full bg-[#eee7df] text-[#3f4944] text-xs font-bold flex items-center justify-center shrink-0">
                    #{player.rank}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#f3ede4] flex items-center justify-center font-bold text-base text-[#1d1b16] shrink-0 border border-[#ede7de]">
                    {player.displayName?.[0]?.toUpperCase() ||
                      player.username?.[0]?.toUpperCase() ||
                      "P"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#1d1b16] truncate">
                        {player.displayName || player.username}
                      </span>
                      {isMe ? (
                        <span className="px-2 py-0.5 bg-[#e8f5ee] text-[#10614b] rounded-full text-xs font-bold uppercase">
                          You
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#f3ede4] rounded-full text-xs text-[#3f4944]">
                          Participant
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#3f4944]">
                      {player.correctCount}/{player.totalQuestions} Correct answers • {player.avgSpeedSec}s average speed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xl font-black text-[#1d1b16] font-mono">
                      {player.score.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-[#3f4944]">pts</span>
                    </div>
                    <span className="text-xs text-[#3f4944]">Final Score</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* PERSONAL PERFORMANCE SECTION */}
          <div className="w-full mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-1">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1d1b16] tracking-tight">
                  Your Performance
                </h2>
                <p className="text-xs sm:text-sm text-[#3f4944]">
                  {myPlayer.displayName || myPlayer.username} •{" "}
                  {myPlayer.isWinner ? "1st Place Victory Analytics" : "Quiz Performance Breakdown"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#10614b]">
                <TrendingUp className="w-4 h-4" />
                <span>Room Percentile: {myPlayer.isWinner ? "100%" : `${Math.round(((rankedPlayers.length - myPlayer.rank + 1) / rankedPlayers.length) * 100)}%`}</span>
              </span>
            </div>

            {/* 4-Column Stat Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Points */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#ede7de] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#3f4944]">Total Points</span>
                  <div className="w-10 h-10 rounded-full bg-[#a8f1d5] flex items-center justify-center text-[#002117]">
                    <Star className="w-5 h-5 text-[#10614b] fill-[#10614b]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#1d1b16] tracking-tight font-mono">
                    {myPlayer.score.toLocaleString()}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[#10614b] text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Speed-weighted score</span>
                  </div>
                </div>
              </div>

              {/* Correct Answers */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#ede7de] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#3f4944]">Correct Answers</span>
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#10614b]">
                    <Check className="w-5 h-5 text-[#10614b] stroke-[3]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#1d1b16] tracking-tight">
                    {myPlayer.correctCount}{" "}
                    <span className="text-lg font-normal text-[#3f4944]">
                      / {myPlayer.totalQuestions}
                    </span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[#10614b] text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{myAccuracy}% Accuracy Rate</span>
                  </div>
                </div>
              </div>

              {/* Accuracy Rate */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#ede7de] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#3f4944]">Accuracy Rate</span>
                  <div className="w-10 h-10 rounded-full bg-[#d9e2ff] flex items-center justify-center text-[#003275]">
                    <Target className="w-5 h-5 text-[#225bb8]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#1d1b16] tracking-tight font-mono">
                    {myAccuracy}%
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[#225bb8] text-xs font-bold">
                    <span>Rank #{myPlayer.rank} in Room</span>
                  </div>
                </div>
              </div>

              {/* Avg Response Time */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#ede7de] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#3f4944]">Avg Response Time</span>
                  <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#9f2b1d]">
                    <Clock className="w-5 h-5 text-[#c04332]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#1d1b16] tracking-tight font-mono">
                    {myPlayer.avgSpeedSec}s
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[#c04332] text-xs font-bold">
                    <span>Fastest round: {fastestRoundSec}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUESTION BREAKDOWN SUMMARY & SEGMENTED ROW */}
          <div className="w-full bg-white rounded-[24px] p-6 sm:p-8 shadow-sm mb-8 border border-[#ede7de]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1d1b16]">Question Breakdown</h3>
                <p className="text-xs text-[#3f4944]">
                  Step-by-step audit of all {myPlayer.totalQuestions} round results for your quiz
                </p>
              </div>

              {/* Legend Pill Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#10614b] text-xs font-bold border border-[#d2eadc]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10614b]" />
                  <span>{myPlayer.correctCount} Correct</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold border border-[#ffb4a8]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
                  <span>{myPlayer.incorrectCount} Incorrect</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ede4] text-[#3f4944] text-xs font-bold border border-[#ede7de]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6f7974]" />
                  <span>{myPlayer.unansweredCount} Unanswered</span>
                </div>
              </div>
            </div>

            {/* Segmented Visual Row of Question Indicator Circles */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
              {myQuestions.map((q, idx) => {
                const isCorrect = q.isCorrect;
                const isUnanswered = q.isUnanswered || q.selectedOption === -1;
                const timeSec = q.timeTakenMs > 0 ? (q.timeTakenMs / 1000).toFixed(1) : "—";

                let badgeStyle = "bg-[#10614b] text-white";
                let textStyle = "text-[#10614b]";

                if (isUnanswered) {
                  badgeStyle = "bg-[#6f7974] text-white";
                  textStyle = "text-[#6f7974]";
                } else if (!isCorrect) {
                  badgeStyle = "bg-[#ba1a1a] text-white";
                  textStyle = "text-[#ba1a1a]";
                }

                return (
                  <div
                    key={q.questionId || idx}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-[#f9f3ea] border border-[#ede7de] transition-all hover:border-[#317a63]/40"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${badgeStyle}`}
                    >
                      {isCorrect ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isUnanswered ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4 stroke-[3]" />
                      )}
                    </div>
                    <span className={`text-xs font-bold ${textStyle}`}>Q{idx + 1}</span>
                    <span className="text-[10px] text-[#3f4944] font-mono">{timeSec}s</span>
                  </div>
                );
              })}
            </div>

            {/* Segmented Progress Bar Summary Line */}
            <div className="w-full h-3 rounded-full bg-[#f3ede4] flex overflow-hidden mt-6 shadow-inner border border-[#ede7de]">
              <div
                className="bg-[#10614b] h-full transition-all duration-500"
                style={{
                  width: `${(myPlayer.correctCount / (myPlayer.totalQuestions || 1)) * 100}%`,
                }}
              />
              <div
                className="bg-[#ba1a1a] h-full transition-all duration-500"
                style={{
                  width: `${(myPlayer.incorrectCount / (myPlayer.totalQuestions || 1)) * 100}%`,
                }}
              />
              <div
                className="bg-[#6f7974] h-full transition-all duration-500"
                style={{
                  width: `${(myPlayer.unansweredCount / (myPlayer.totalQuestions || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Primary Action: Play Again with Group */}
            <button
              type="button"
              disabled={isCreatingRoom}
              onClick={handlePlayAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#10614b] text-white font-bold text-sm rounded-full shadow-md hover:bg-[#317a63] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isCreatingRoom ? "animate-spin" : ""}`} />
              <span>{isHost ? "Play Again with Group" : "Start New Room"}</span>
            </button>

            {/* Secondary Action: Explore More Quizzes */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#10614b] font-bold text-sm rounded-full shadow-sm hover:bg-[#f3ede4] transition-all border border-[#ede7de]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore More Quizzes</span>
            </button>

            {/* Tertiary Action: Return Home */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[#3f4944] hover:text-[#1d1b16] font-bold text-sm rounded-full transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f9f3ea] border-t border-[#ede7de] mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#3f4944]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1d1b16]">Quizly Multiplayer</span>
            <span>•</span>
            <span>Room PIN: {results.roomCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>All {results.questionCount} questions scored</span>
            <span>•</span>
            <span>© 2026 Quizly. Ambient smart trivia.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
