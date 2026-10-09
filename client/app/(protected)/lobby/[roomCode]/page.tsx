"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Copy,
  Check,
  Play,
  Users,
  Gamepad2,
  Settings as SettingsIcon,
  ListOrdered,
  Timer,
  Link as LinkIcon,
  X,
  AlertTriangle,
  Sparkles,
  LogOut,
  ChevronRight,
  Shield,
  Loader2,
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

import { useRoom } from "@/features/battle/hooks/useRoom";
import { useBattleMutations } from "@/features/battle/hooks/useBattleMutations";
import { useLobbySocket } from "@/features/battle/hooks/useLobbySocket";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { RoomPlayer } from "@/types";

export default function MultiplayerLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params.roomCode as string) || "").toUpperCase();

  // 1. Auth & Room queries
  const { data: currentUser } = useCurrentUser();
  const {
    data: initialRoom,
    isLoading: isRestLoading,
    isError: isRestError,
    error: restError,
    refetch,
  } = useRoom(roomCode);
  const { leaveRoom, startMatch } = useBattleMutations();

  // 2. Real-time Socket synchronization
  const {
    room: socketRoom,
    isConnected,
    isStarting: isSocketStarting,
    error: socketError,
    startBattle: emitStartBattle,
    clearError,
    toggleReady,
    updateLobbySettings,
  } = useLobbySocket(roomCode, initialRoom);

  const room = socketRoom || initialRoom;

  // Local UI states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState("");
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Settings states: Question Count & Time per Question
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(30);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.origin}/lobby/${roomCode}`);
    }
  }, [roomCode]);

  // Sync settings from server room
  useEffect(() => {
    if (room?.settings) {
      if (room.settings.questionCount) {
        setSelectedQuestionCount(room.settings.questionCount);
      }
      if (room.settings.timeLimit) {
        setSelectedTimeLimit(room.settings.timeLimit);
      }
    }
  }, [room?.settings]);

  // Toast notification helper
  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Surface socket errors
  useEffect(() => {
    if (socketError) {
      showToast(socketError);
      clearError();
    }
  }, [socketError, clearError]);

  // Auto-redirect if room is in progress
  useEffect(() => {
    if (room && (room.status === "IN_PROGRESS" || room.status === "active")) {
      router.push(`/battle/${roomCode}`);
    }
  }, [room, roomCode, router]);

  // Copy PIN action
  const handleCopyPin = () => {
    if (!roomCode) return;
    navigator.clipboard?.writeText(roomCode);
    setCopiedCode(true);
    showToast(`Room code ${roomCode} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy Invite URL action
  const handleCopyInviteLink = () => {
    if (!joinUrl) return;
    navigator.clipboard?.writeText(joinUrl);
    setCopiedLink(true);
    showToast("Invite link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Leave room action
  const handleLeave = async () => {
    try {
      await leaveRoom.mutateAsync(roomCode);
    } catch (err) {
      console.error("Failed to leave room", err);
    } finally {
      router.push("/");
    }
  };

  // Host determination
  const hostId = room?.host?._id || room?.hostId || (room as { hostId?: string })?.hostId;
  const currentUserId = currentUser?._id;
  const isHost = Boolean(
    hostId &&
      currentUserId &&
      (hostId === currentUserId || hostId.toString() === currentUserId.toString())
  );

  // Players evaluation
  const players = room?.players || [];
  const playerCount = players.length;
  const maxCapacity = 4;

  const myPlayer = players.find(
    (p) =>
      p.user?._id &&
      currentUserId &&
      (p.user._id === currentUserId || p.user._id.toString() === currentUserId.toString())
  );
  const isMyPlayerReady = Boolean(myPlayer?.isReady);

  // Readiness evaluation for match start
  const nonHostPlayers = players.filter(
    (p) => !p.isHost && p.user?._id?.toString() !== hostId?.toString()
  );
  const allNonHostsReady =
    nonHostPlayers.length === 0 || nonHostPlayers.every((p) => p.isReady);
  const isEveryoneReady = players.length > 0 && players.every((p) => p.isHost || p.isReady);

  // Settings update handlers (Host only)
  const handleQuestionCountSelect = (count: number) => {
    if (!isHost) {
      showToast("Only the room host can change quiz settings.");
      return;
    }
    setSelectedQuestionCount(count);
    updateLobbySettings({
      questionCount: count,
      timeLimit: selectedTimeLimit,
    });
  };

  const handleTimeLimitSelect = (seconds: number) => {
    if (!isHost) {
      showToast("Only the room host can change quiz settings.");
      return;
    }
    setSelectedTimeLimit(seconds);
    updateLobbySettings({
      timeLimit: seconds,
      questionCount: selectedQuestionCount,
    });
  };

  // Start game handler
  const isStarting = isSocketStarting || startMatch.isPending;

  const handleStartGame = async () => {
    if (!isHost || isStarting) return;
    if (!allNonHostsReady) {
      showToast("Waiting for all players to ready up!");
      return;
    }
    try {
      emitStartBattle();
      await startMatch.mutateAsync(roomCode);
    } catch (err: any) {
      console.error("Failed to start match:", err);
      showToast(err?.message || "Failed to start quiz");
    }
  };

  // Loading state
  if (isRestLoading && !room) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4 bg-white border-[2.5px] border-black rounded-3xl p-8 shadow-[4px_4px_0px_#000]">
            <div className="w-12 h-12 border-4 border-black border-t-[#FFE600] rounded-full animate-spin" />
            <p className="font-black text-sm text-black">
              Connecting to room {roomCode}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isRestError || !room) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <div className="max-w-md w-full text-center p-8 bg-white border-[2.5px] border-black rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
            <AlertTriangle className="h-12 w-12 text-[#EF4444] mx-auto stroke-[2.5]" />
            <h2 className="text-2xl font-black text-black">Room Not Found</h2>
            <p className="text-sm font-bold text-stone-600">
              {restError?.message || "This quiz room does not exist, has expired, or is full."}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2.5 rounded-full border-2 border-black bg-[#FAF7EE] hover:bg-stone-200 text-black font-black text-sm shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Split roomCode into 6 individual characters for digit tiles
  const digitChars = roomCode.padEnd(6, "-").slice(0, 6).split("");

  // Slot styling configurations for the 4 player cards matching screenshot
  const slotConfigs = [
    {
      bg: "bg-[#FEF08A]", // Slot 1: Pastel yellow (Host)
      avatar: (p: RoomPlayer) => p.user?.avatar ? <img src={p.user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <GamerBoyAvatar className="w-full h-full" />,
    },
    {
      bg: "bg-[#DDD6FE]", // Slot 2: Pastel purple
      avatar: (p: RoomPlayer) => p.user?.avatar ? <img src={p.user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <GamerGirlAvatar className="w-full h-full" />,
    },
    {
      bg: "bg-[#A7F3D0]", // Slot 3: Pastel mint/cyan
      avatar: (p: RoomPlayer) => p.user?.avatar ? <img src={p.user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <GamerCapAvatar className="w-full h-full" />,
    },
    {
      bg: "bg-[#FBCFE8]", // Slot 4: Pastel soft pink
      avatar: (p: RoomPlayer) => p.user?.avatar ? <img src={p.user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <GamerOrangeAvatar className="w-full h-full" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 pb-16 select-none relative overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <Navbar />

      {/* Starting Arena Fullscreen Transition Overlay */}
      {isStarting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7EE]/95 backdrop-blur-md transition-all duration-300">
          <div className="text-center space-y-4 max-w-md px-6 bg-white border-[3px] border-black rounded-3xl p-8 shadow-[8px_8px_0px_#000]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D1FAE5] border-2 border-black text-xs font-black text-[#065F46] uppercase">
              <Sparkles className="h-4 w-4" />
              Initializing Quiz Session
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight">
              Quiz Starting Now!
            </h2>
            <p className="text-sm font-bold text-stone-700">
              Preparing server questions and synchronized countdown timer...
            </p>
            <div className="relative flex items-center justify-center pt-2">
              <div className="w-12 h-12 border-4 border-black border-t-[#FFE600] rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black text-white font-black text-xs sm:text-sm shadow-[4px_4px_0px_#FFE600] border-2 border-black">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Comic edge decorative flourishes */}
      <div className="absolute top-24 left-3 pointer-events-none opacity-80 hidden lg:block">
        <ArcadeStarIcon className="w-6 h-6 text-[#FFE600]" />
      </div>
      <div className="absolute bottom-16 right-4 pointer-events-none opacity-80 hidden lg:block">
        <ArcadeLightningIcon className="w-7 h-7 text-[#EC4899]" />
      </div>

      {/* ========================================================================= */}
      {/* MAIN LOBBY DASHBOARD CONTENT (Directly beneath Navbar) */}
      {/* ========================================================================= */}
      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-26 space-y-5">
        
        {/* TWO-COLUMN DESKTOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: ROOM CODE PANEL & PLAYERS PANEL & INVITE FRIENDS */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* 1. ROOM CODE PANEL */}
            <div className="relative bg-white border-[2.5px] border-black rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0px_#000]">
              
              {/* Decorative lightning doodle in top-right */}
              <div className="absolute top-4 right-5 pointer-events-none hidden sm:block">
                <ArcadeLightningIcon className="w-7 h-7 text-[#FFE600]" />
              </div>

              {/* Panel Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#67E8F9] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                  <Gamepad2 className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                      ROOM CODE
                    </h2>
                    <ArcadeCrownIcon className="w-5 h-4 inline-block" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-stone-600 mt-0.5">
                    Share this code with your friends to join the quiz!
                  </p>
                </div>
              </div>

              {/* Digit Tiles & Copy Code Button */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
                
                {/* 6 Individual Yellow Digit Tiles */}
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  {digitChars.map((char, index) => (
                    <div
                      key={index}
                      className="w-10 h-13 sm:w-13 sm:h-16 rounded-xl sm:rounded-2xl bg-[#FFE600] border-[2.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000] transform transition-transform hover:-translate-y-0.5"
                    >
                      <span className="font-black text-2xl sm:text-3xl text-black font-mono">
                        {char}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Copy Code Button */}
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="inline-flex items-center gap-2 bg-[#DDD6FE] hover:bg-[#C4B5FD] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] transition-all cursor-pointer ml-auto"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 stroke-[2.5]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* 2. PLAYERS PANEL */}
            <div className="bg-white border-[2.5px] border-black rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0px_#000]">
              
              {/* Header: PLAYERS count & Live readiness status */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#DDD6FE] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <Users className="w-5 h-5 text-black stroke-[2.5]" />
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight flex items-center gap-1.5">
                    PLAYERS ({playerCount}/{maxCapacity})
                    <ArcadeCrownIcon className="w-5 h-4 inline-block" />
                  </h3>
                </div>

                {/* Real-time Readiness Pill */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-stone-900">
                  <span className={`w-2.5 h-2.5 rounded-full ${isEveryoneReady ? "bg-[#10B981]" : "bg-amber-500 animate-pulse"}`} />
                  <span>
                    {isEveryoneReady
                      ? "Everyone is ready!"
                      : `${players.filter((p) => p.isHost || p.isReady).length}/${playerCount} ready`}
                  </span>
                </div>
              </div>

              {/* 4 Player Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {[0, 1, 2, 3].map((slotIndex) => {
                  const player = players[slotIndex];
                  const cfg = slotConfigs[slotIndex];

                  if (player) {
                    const isPlayerHost = Boolean(
                      player.isHost ||
                      (player.user?._id && player.user._id.toString() === hostId?.toString())
                    );
                    const isCurrentPlayer = Boolean(
                      player.user?._id &&
                      currentUserId &&
                      (player.user._id === currentUserId || player.user._id.toString() === currentUserId.toString())
                    );
                    const displayName =
                      player.user?.displayName || player.user?.username || `Player ${slotIndex + 1}`;

                    return (
                      <div
                        key={player.user?._id || slotIndex}
                        className={`relative rounded-[22px] border-[2.5px] border-black p-3.5 flex flex-col items-center justify-between shadow-[3px_3px_0px_#000] ${cfg.bg} min-h-[220px] transition-transform hover:-translate-y-1`}
                      >
                        {/* Top Controls: Crown badge (if host) & Leave/Remove button */}
                        <div className="w-full flex items-center justify-between mb-1">
                          {isPlayerHost ? (
                            <span className="w-7 h-7 rounded-lg bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]" title="Room Host">
                              <ArcadeCrownIcon className="w-4 h-3.5" />
                            </span>
                          ) : (
                            <div className="w-7 h-7" />
                          )}

                          {/* Leave / Exit button for current user */}
                          {isCurrentPlayer && (
                            <button
                              type="button"
                              onClick={handleLeave}
                              title="Leave Room"
                              className="w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-red-100 hover:text-red-600 shadow-[1px_1px_0px_#000] cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          )}
                        </div>

                        {/* Avatar Frame with Illustrated Character */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-[2.5px] border-black overflow-hidden bg-white shadow-[2px_2px_0px_#000] my-1">
                          {cfg.avatar(player)}
                        </div>

                        {/* Player Name & Role */}
                        <div className="text-center my-1 w-full px-1">
                          <p className="font-black text-sm text-black truncate leading-tight">
                            {displayName}
                          </p>
                          <p className="font-bold text-[11px] text-stone-700 leading-tight mt-0.5">
                            {isCurrentPlayer
                              ? isPlayerHost ? "You (Host)" : "You"
                              : isPlayerHost ? "Host" : "Guest"}
                          </p>
                        </div>

                        {/* Ready Button / Status Pill */}
                        <div className="w-full mt-2">
                          {isPlayerHost ? (
                            // Host is authoritative and always ready
                            <div className="w-full py-1.5 px-3 rounded-full bg-[#059669] text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>READY</span>
                            </div>
                          ) : isCurrentPlayer ? (
                            // Current non-host player can toggle their readiness
                            <button
                              type="button"
                              onClick={() => toggleReady(!isMyPlayerReady)}
                              className={`w-full py-1.5 px-3 rounded-full border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${
                                isMyPlayerReady
                                  ? "bg-[#059669] hover:bg-[#047857] text-white"
                                  : "bg-[#F59E0B] hover:bg-[#D97706] text-black"
                              }`}
                            >
                              {isMyPlayerReady ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>READY</span>
                                </>
                              ) : (
                                <span>READY UP</span>
                              )}
                            </button>
                          ) : (
                            // Other non-host players display their current ready state
                            <div
                              className={`w-full py-1.5 px-3 rounded-full border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 ${
                                player.isReady
                                  ? "bg-[#059669] text-white"
                                  : "bg-amber-100 text-amber-900 border-dashed"
                              }`}
                            >
                              {player.isReady ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>READY</span>
                                </>
                              ) : (
                                <span>WAITING</span>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  }

                  // Empty Slot
                  return (
                    <div
                      key={slotIndex}
                      className="rounded-[22px] border-2 border-dashed border-stone-300 bg-stone-50/70 p-4 flex flex-col items-center justify-center text-center min-h-[220px]"
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 mb-2">
                        <Users className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <span className="font-black text-xs text-stone-500 uppercase">
                        Slot {slotIndex + 1}
                      </span>
                      <span className="text-[11px] font-bold text-stone-400 mt-0.5">
                        Waiting for friend...
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* 3. INVITE FRIENDS PANEL (Bottom-Left) */}
            <div className="bg-white border-[2.5px] border-black rounded-[22px] p-4 sm:p-5 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF08A] border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
                  <LinkIcon className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-black uppercase tracking-tight">
                    INVITE FRIENDS
                  </h4>
                  <p className="text-[11px] sm:text-xs font-bold text-stone-600">
                    Share this link to invite friends directly
                  </p>
                </div>
              </div>

              {/* URL and Copy Link Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={joinUrl || `https://quizzy.app/join/${roomCode}`}
                  className="w-full bg-[#FAF7EE] border-2 border-stone-300 rounded-xl px-3.5 py-2 font-bold text-xs sm:text-sm text-stone-800 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 stroke-[2.5]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: QUIZ SETTINGS & START QUIZ BUTTON */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* 1. QUIZ SETTINGS PANEL */}
            <div className="bg-white border-[2.5px] border-black rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0px_#000]">
              
              {/* Header with Gear & Crown */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                  <SettingsIcon className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                    QUIZ SETTINGS
                  </h3>
                  <ArcadeCrownIcon className="w-5 h-4 inline-block" />
                </div>
              </div>

              {/* SETTING 1: Number of Questions */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#DDD6FE] border-1.5 border-black flex items-center justify-center shrink-0">
                    <ListOrdered className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  </div>
                  <label className="font-black text-sm sm:text-base text-black">
                    Number of Questions
                  </label>
                </div>

                {/* 3 Segmented Buttons: 10, 15, 20 */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[10, 15, 20].map((count) => {
                    const isSelected = selectedQuestionCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        disabled={!isHost}
                        onClick={() => handleQuestionCountSelect(count)}
                        className={`py-3 px-3 rounded-2xl border-[2.5px] font-black text-base transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]"
                            : "bg-white text-stone-700 border-stone-300 hover:border-black hover:bg-stone-50"
                        } ${!isHost ? "cursor-not-allowed opacity-90" : "active:translate-x-[1px] active:translate-y-[1px]"}`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SETTING 2: Time per Question */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#CFFAFE] border-1.5 border-black flex items-center justify-center shrink-0">
                    <Timer className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  </div>
                  <label className="font-black text-sm sm:text-base text-black">
                    Time per Question
                  </label>
                </div>

                {/* 3 Segmented Buttons: 10s, 20s, 30s */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[10, 20, 30].map((seconds) => {
                    const isSelected = selectedTimeLimit === seconds;
                    return (
                      <button
                        key={seconds}
                        type="button"
                        disabled={!isHost}
                        onClick={() => handleTimeLimitSelect(seconds)}
                        className={`py-3 px-3 rounded-2xl border-[2.5px] font-black text-base transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]"
                            : "bg-white text-stone-700 border-stone-300 hover:border-black hover:bg-stone-50"
                        } ${!isHost ? "cursor-not-allowed opacity-90" : "active:translate-x-[1px] active:translate-y-[1px]"}`}
                      >
                        {seconds}s
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 2. GIANT PINK START QUIZ BUTTON (Bottom-Right) */}
            <div className="flex flex-col items-center w-full">
              
              {/* Comic speed dashes burst above button */}
              <div className="flex items-center justify-center gap-1.5 mb-[-8px] z-10">
                <span className="w-1.5 h-3 bg-black rounded-full -rotate-45" />
                <span className="w-1.5 h-4 bg-black rounded-full" />
                <span className="w-1.5 h-3 bg-black rounded-full rotate-45" />
              </div>

              {/* Start Quiz Main Button */}
              <button
                type="button"
                disabled={!isHost || isStarting || !allNonHostsReady}
                onClick={handleStartGame}
                className={`w-full py-4 sm:py-5 px-6 rounded-full border-[3px] border-black flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_#000] relative group ${
                  !isHost
                    ? "bg-[#FF4D85] opacity-80 cursor-not-allowed"
                    : !allNonHostsReady
                    ? "bg-[#FF4D85] opacity-75 cursor-not-allowed"
                    : "bg-[#FF4D85] hover:bg-[#F43F5E] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer hover:shadow-[4px_4px_0px_#000]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-black stroke-black ml-0.5" />
                </div>
                <span className="font-black text-xl sm:text-2xl lg:text-3xl tracking-wider text-white uppercase drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                  {isStarting ? "STARTING..." : "START QUIZ"}
                </span>
              </button>

              {/* Status explanation below button matching screenshot */}
              <p className="text-xs sm:text-sm font-bold text-stone-700 text-center mt-3">
                {!isHost
                  ? "Waiting for the host to start the game..."
                  : !allNonHostsReady
                  ? "Waiting for all players to be ready..."
                  : "All players ready! Click to begin the match!"}
              </p>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
