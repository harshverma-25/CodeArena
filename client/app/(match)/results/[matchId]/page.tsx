"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBattleResult } from "@/features/battle/hooks/useBattleResult";
import { useBattleMutations } from "@/features/battle/hooks/useBattleMutations";
import { useBattleStore } from "@/store/battleStore";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { socketManager } from "@/lib/socket";
import { Navbar } from "@/components/shared/Navbar";
import {
  GamerBoyAvatar,
  GamerGirlAvatar,
  GamerCapAvatar,
  GamerOrangeAvatar,
} from "@/components/ui/PlayerAvatars";
import {
  ArcadeCrownIcon,
  ArcadeLightningIcon,
} from "@/components/ui/ArcadeIcons";
import {
  CelebrationBoyIllustration,
  CelebrationTrophyIllustration,
  ComicBackgroundBurst,
  ArcadeTargetIcon,
  LeaderboardRankBadge,
} from "@/features/battle/components/ResultsIllustrations";
import {
  Check,
  X,
  Star,
  Home,
  RefreshCw,
  Trophy,
  AlertTriangle,
  Zap,
  Target,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MatchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = (params.matchId as string) || "";

  const { data: currentUser } = useCurrentUser();
  const { data: results, isLoading, isError, error, refetch } = useBattleResult(matchId);
  const { createRoom, playAgain } = useBattleMutations();
  const { resetBattle } = useBattleStore();

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    // Reset active live battle state when viewing report card
    resetBattle();
  }, [resetBattle]);

  // Re-join socket room and listen for multiplayer play-again broadcast
  useEffect(() => {
    if (!results?.roomCode) return;
    const roomCode = results.roomCode.toUpperCase();
    const socket = socketManager.getSocket();

    // Ensure player is connected to the room channel so they receive room:play_again broadcasts
    socketManager.emit("room:join", { roomCode });

    const handlePlayAgainBroadcast = (payload: { oldRoomCode: string; newRoomCode: string }) => {
      if (payload?.oldRoomCode?.toUpperCase() === roomCode && payload?.newRoomCode) {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          router.push(`/lobby/${payload.newRoomCode.toUpperCase()}`);
        }
      }
    };

    if (socket) {
      socket.on("room:play_again", handlePlayAgainBroadcast);
    }

    return () => {
      if (socket) {
        socket.off("room:play_again", handlePlayAgainBroadcast);
      }
    };
  }, [results?.roomCode, router]);

  // Loading State with comic arcade styling
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7EE] text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 pt-24">
          <div className="bg-white border-[3px] border-black rounded-3xl p-8 max-w-sm w-full text-center shadow-[6px_6px_0px_#000] space-y-4">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-[#FEF08A] border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
              <Trophy className="w-8 h-8 text-black animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">
              Tallying Scores...
            </h2>
            <p className="text-xs font-bold text-stone-600">
              Gathering server-authoritative results, rankings, and stats!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State / Unauthorized / Not Found
  if (isError || !results) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7EE] text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 pt-24">
          <div className="mx-auto max-w-md w-full text-center p-8 bg-white border-[3px] border-black rounded-3xl space-y-5 shadow-[6px_6px_0px_#000]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBCFE8] border-2 border-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="h-7 w-7 text-black stroke-[2.5]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-black uppercase">
                Results Unavailable
              </h3>
              <p className="text-xs font-bold text-stone-600 leading-relaxed">
                {error?.message || "Unable to retrieve quiz performance report. Please try again."}
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-black bg-[#FAF7EE] text-black font-black text-xs hover:bg-stone-200 transition-all shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-black text-black font-black text-xs hover:bg-[#FACC15] transition-all shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
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

  // Current user's performance
  const myPlayer =
    rankedPlayers.find((p) => p.userId === myId) ||
    rankedPlayers.find((p) => p.userId === results.userPlayer?.userId) ||
    rankedPlayers[0];

  const correctAnswers = myPlayer?.correctCount ?? 0;
  const incorrectAnswers =
    myPlayer?.incorrectCount ??
    Math.max(0, (myPlayer?.totalQuestions ?? results.questionCount) - correctAnswers);
  const totalQuestions = myPlayer?.totalQuestions || results.questionCount || (correctAnswers + incorrectAnswers) || 1;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const totalScore = myPlayer?.score ?? 0;
  const avgSpeedSec = myPlayer?.avgSpeedSec ?? "0.0";

  // Helper for rendering player avatars
  const renderPlayerAvatar = (avatarUrl: string | undefined, index: number) => {
    if (avatarUrl && (avatarUrl.startsWith("http") || avatarUrl.startsWith("/") || avatarUrl.startsWith("data:"))) {
      return (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      );
    }
    const avatars = [
      <GamerBoyAvatar key="boy" className="w-full h-full" />,
      <GamerGirlAvatar key="girl" className="w-full h-full" />,
      <GamerCapAvatar key="cap" className="w-full h-full" />,
      <GamerOrangeAvatar key="orange" className="w-full h-full" />,
    ];
    return avatars[index % avatars.length];
  };

  // Pastel styling configurations for player leaderboard rows matching the screenshot
  const rowColorConfigs = [
    { bg: "bg-[#FEF08A]" }, // Rank 1: Pastel Yellow
    { bg: "bg-[#DDD6FE]" }, // Rank 2: Pastel Purple
    { bg: "bg-[#A7F3D0]" }, // Rank 3: Pastel Mint
    { bg: "bg-[#FBCFE8]" }, // Rank 4: Pastel Pink
  ];

  // Play Again action
  const handlePlayAgain = async () => {
    if (isCreatingRoom || hasNavigatedRef.current) return;
    try {
      setIsCreatingRoom(true);
      if (results.roomCode) {
        const newRoom = await playAgain.mutateAsync(results.roomCode);
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          router.push(`/lobby/${newRoom.roomCode}`);
        }
      } else {
        const newRoom = await createRoom.mutateAsync({
          topic: results.topic,
          categoryId: results.categoryId,
          subjectId: results.isMixedCategory ? null : results.subjectId,
          isMixedCategory: Boolean(results.isMixedCategory),
          difficulty: (results.difficulty as any) || "Easy",
          questionCount: results.questionCount,
        });
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          router.push(`/lobby/${newRoom.roomCode}`);
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to create rematch room.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <Navbar />

      {/* 2. MAIN RESULTS CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 flex flex-col justify-between">
        <div className="w-full space-y-6">
          
          {/* DESKTOP TWO-COLUMN LAYOUT / MOBILE STACK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT SIDE: QUIZ COMPLETION PANEL & PERFORMANCE STATS (approx 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* A. CELEBRATION PANEL */}
              <div className="relative bg-white border-[2.5px] border-black rounded-[26px] shadow-[5px_5px_0px_#000] p-5 sm:p-7 overflow-hidden flex flex-col justify-between min-h-[290px] sm:min-h-[320px]">
                
                {/* Background Comic Burst Accents */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <ComicBackgroundBurst className="w-full h-full object-cover" />
                </div>

                {/* Decorative Comic Stars & Lightning in corners */}
                <div className="absolute top-3 left-4 pointer-events-none">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[#FFE600] text-xl font-black">★</span>
                    <span className="text-[#A7F3D0] text-sm font-black">★</span>
                  </div>
                </div>
                <div className="absolute top-3 right-4 pointer-events-none">
                  <ArcadeLightningIcon className="w-7 h-7 text-[#FFE600] rotate-12" />
                </div>

                {/* Main Content inside Celebration Panel */}
                <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 flex-1">
                  
                  {/* Left: Gamer Boy Celebration Illustration */}
                  <div className="shrink-0 flex items-center justify-center w-28 sm:w-36 md:w-44 -ml-2 sm:-ml-1">
                    <CelebrationBoyIllustration className="w-full h-auto max-h-[220px]" />
                  </div>

                  {/* Center: Crown, QUIZ COMPLETED, AMAZING JOB, Motivational Subtitle */}
                  <div className="flex-1 text-center flex flex-col items-center justify-center px-1 sm:px-2">
                    {/* Golden Crown */}
                    <div className="mb-0.5 sm:mb-1 hover:scale-110 transition-transform">
                      <ArcadeCrownIcon className="w-9 h-7 sm:w-11 sm:h-8" />
                    </div>

                    {/* Comic 3D Heading: QUIZ COMPLETED! */}
                    <h1
                      className="font-black text-2xl sm:text-4xl md:text-[40px] uppercase text-white leading-none tracking-wide text-center"
                      style={{
                        WebkitTextStroke: "2.5px #000",
                        textShadow: "3px 4px 0px #000, 4px 5px 0px #000",
                      }}
                    >
                      QUIZ<br className="sm:hidden" /> COMPLETED!
                    </h1>

                    {/* Yellow pill banner: AMAZING JOB! */}
                    <div className="mt-2.5 sm:mt-3 inline-flex items-center px-4 sm:px-6 py-1 sm:py-1.5 rounded-full bg-[#FFE600] border-2 border-black shadow-[2.5px_2.5px_0px_#000] transform -rotate-1 hover:rotate-0 transition-transform">
                      <span className="font-black text-xs sm:text-sm tracking-wider uppercase text-black">
                        AMAZING JOB!
                      </span>
                    </div>

                    {/* Motivational Subtitle */}
                    <p className="mt-3 text-[11px] sm:text-xs md:text-sm font-bold text-stone-700 max-w-xs sm:max-w-sm mx-auto leading-tight">
                      You&apos;ve completed the quiz! Keep learning and challenge yourself again!
                    </p>
                  </div>

                  {/* Right: Golden Celebration Trophy Illustration */}
                  <div className="shrink-0 flex items-center justify-center w-24 sm:w-32 md:w-36 -mr-2 sm:-mr-1">
                    <CelebrationTrophyIllustration className="w-full h-auto max-h-[200px]" />
                  </div>
                </div>
              </div>

              {/* B. 4 PERFORMANCE STATISTIC CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Correct Answers */}
                <div className="bg-[#A7F3D0] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#10B981] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Check className="w-6 h-6 text-black stroke-[3.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-2xl sm:text-3xl text-black leading-none">
                      {correctAnswers}
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-black/80 leading-tight mt-0.5 truncate">
                      Correct Answers
                    </div>
                  </div>
                </div>

                {/* 2. Incorrect Answers */}
                <div className="bg-[#FBCFE8] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F43F5E] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <X className="w-6 h-6 text-black stroke-[3.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-2xl sm:text-3xl text-black leading-none">
                      {incorrectAnswers}
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-black/80 leading-tight mt-0.5 truncate">
                      Incorrect Answers
                    </div>
                  </div>
                </div>

                {/* 3. Accuracy */}
                <div className="bg-[#DDD6FE] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <ArcadeTargetIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-2xl sm:text-3xl text-black leading-none">
                      {accuracy}%
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-black/80 leading-tight mt-0.5 truncate">
                      Accuracy
                    </div>
                  </div>
                </div>

                {/* 4. Total Score */}
                <div className="bg-[#FEF08A] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Star className="w-6 h-6 text-black fill-[#FFE600] stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-2xl sm:text-3xl text-black leading-none truncate">
                      {totalScore.toLocaleString()}
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-black/80 leading-tight mt-0.5 truncate">
                      Total Score
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: FINAL LEADERBOARD (approx 5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white border-[2.5px] border-black rounded-[26px] shadow-[5px_5px_0px_#000] p-5 sm:p-6 flex-1 flex flex-col justify-between">
                
                {/* Leaderboard Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                      <Trophy className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="font-black text-xl sm:text-2xl uppercase tracking-wider text-black leading-none">
                        FINAL LEADERBOARD
                      </h2>
                      <p className="text-xs font-bold text-stone-600 mt-1">
                        Here&apos;s how everyone performed!
                      </p>
                    </div>
                  </div>

                  {/* Comic spark in top-right */}
                  <div className="shrink-0">
                    <ArcadeLightningIcon className="w-6 h-6 text-[#FFE600] rotate-12" />
                  </div>
                </div>

                {/* Player Rows: Multiplayer Mode vs. Solo Mode */}
                <div className="py-4 space-y-3 flex-1 flex flex-col justify-center">
                  {results.players.length > 1 ? (
                    // MULTIPLAYER MODE: Render actual players with ranks, scores, and pastel styling
                    rankedPlayers.map((player, index) => {
                      const isMe = player.userId === myId;
                      const colorConfig = rowColorConfigs[index % rowColorConfigs.length];

                      return (
                        <div
                          key={player.userId || index}
                          className={cn(
                            "w-full rounded-2xl border-[2.5px] border-black p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#000] transition-transform hover:-translate-y-0.5",
                            colorConfig.bg
                          )}
                        >
                          {/* Left: Rank Badge + Avatar + Name/You */}
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <LeaderboardRankBadge rank={player.rank} />
                            
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-black overflow-hidden bg-white shrink-0 shadow-[2px_2px_0px_#000]">
                              {renderPlayerAvatar(player.avatar, index)}
                            </div>

                            <div className="min-w-0">
                              <div className="font-black text-sm sm:text-base text-black truncate">
                                {player.displayName || player.username}
                              </div>
                              {isMe && (
                                <span className="text-xs font-bold text-stone-700 block -mt-0.5">
                                  You
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Player Score */}
                          <div className="text-right shrink-0">
                            <span className="font-black text-lg sm:text-xl text-black">
                              {player.score.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // SOLO MODE: Show personal performance summary rows without fabricated opponents
                    <>
                      {/* Row 1: Player Final Rank / Total Score (Yellow) */}
                      <div className="w-full rounded-2xl border-[2.5px] border-black p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#000] bg-[#FEF08A]">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <LeaderboardRankBadge rank={1} />
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-black overflow-hidden bg-white shrink-0 shadow-[2px_2px_0px_#000]">
                            {renderPlayerAvatar(myPlayer.avatar, 0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm sm:text-base text-black truncate">
                              {myPlayer.displayName || myPlayer.username}
                            </div>
                            <span className="text-xs font-bold text-stone-700 block -mt-0.5">
                              You
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-lg sm:text-xl text-black">
                            {myPlayer.score.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Speed / Response Time (Purple) */}
                      <div className="w-full rounded-2xl border-[2.5px] border-black p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#000] bg-[#DDD6FE]">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                            <Zap className="w-5 h-5 text-black fill-[#FACC15]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm sm:text-base text-black truncate">
                              Average Speed
                            </div>
                            <span className="text-xs font-bold text-stone-700 block -mt-0.5">
                              Per Question
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-lg sm:text-xl text-black">
                            {avgSpeedSec}s
                          </span>
                        </div>
                      </div>

                      {/* Row 3: Question Completion (Mint) */}
                      <div className="w-full rounded-2xl border-[2.5px] border-black p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#000] bg-[#A7F3D0]">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                            <Target className="w-5 h-5 text-black" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm sm:text-base text-black truncate">
                              Questions Solved
                            </div>
                            <span className="text-xs font-bold text-stone-700 block -mt-0.5">
                              Completed rounds
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-lg sm:text-xl text-black">
                            {correctAnswers}/{totalQuestions}
                          </span>
                        </div>
                      </div>

                      {/* Row 4: Accuracy Tier / Rating (Pink) */}
                      <div className="w-full rounded-2xl border-[2.5px] border-black p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#000] bg-[#FBCFE8]">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                            <Flame className="w-5 h-5 text-black fill-[#F43F5E]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm sm:text-base text-black truncate">
                              Performance Tier
                            </div>
                            <span className="text-xs font-bold text-stone-700 block -mt-0.5">
                              {accuracy >= 80 ? "Mastery" : accuracy >= 60 ? "Proficient" : "Challenger"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-lg sm:text-xl text-black">
                            {accuracy}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Subtitle / Note */}
                <div className="pt-2 text-center text-[11px] font-bold text-stone-500">
                  {results.players.length > 1
                    ? "Ties broken by response speed delta."
                    : "Solo practice session completed."}
                </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM ACTION BUTTONS (PLAY AGAIN & GO TO HOME) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* BUTTON 1: PLAY AGAIN (Vibrant Pink, Replay Icon, Subtitle) */}
            <button
              type="button"
              disabled={isCreatingRoom}
              onClick={handlePlayAgain}
              className="group relative w-full bg-[#FF4D85] hover:bg-[#F43F5E] text-white border-[3px] border-black rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[5px_5px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer flex items-center gap-4 disabled:opacity-60"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                <RefreshCw className={cn("w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[3]", isCreatingRoom && "animate-spin")} />
              </div>
              <div className="text-left min-w-0">
                <div className="font-black text-xl sm:text-2xl tracking-wide uppercase leading-tight text-white drop-shadow-[1px_1px_0px_#000]">
                  {isCreatingRoom ? "PREPARING..." : "PLAY AGAIN"}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white/90 mt-0.5">
                  Try another quiz
                </div>
              </div>
            </button>

            {/* BUTTON 2: GO TO HOME (Bright Yellow, Home Icon, Subtitle) */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="group relative w-full bg-[#FFE600] hover:bg-[#FACC15] text-black border-[3px] border-black rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[5px_5px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer flex items-center gap-4"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                <Home className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFE600] fill-[#FFE600] stroke-[2]" />
              </div>
              <div className="text-left min-w-0">
                <div className="font-black text-xl sm:text-2xl tracking-wide uppercase leading-tight text-black">
                  GO TO HOME
                </div>
                <div className="text-xs sm:text-sm font-bold text-black/80 mt-0.5">
                  Back to main page
                </div>
              </div>
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
