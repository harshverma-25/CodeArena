"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swords, WifiOff } from "lucide-react";

import { useRoom } from "@/features/battle/hooks/useRoom";
import { useBattleMutations } from "@/features/battle/hooks/useBattleMutations";
import { useLobbySocket } from "@/features/battle/hooks/useLobbySocket";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

// Slot styling presets matching the Stitch warm studio palette
const SLOT_STYLES = [
  { icon: "smart_toy", bg: "bg-[#e8f5ee]", text: "text-[#317a63]", border: "border-[#d2eadc]" },
  { icon: "psychology", bg: "bg-[#f3ede4]", text: "text-[#225bb8]", border: "border-[#e2dacd]" },
  { icon: "rocket_launch", bg: "bg-[#fbeae7]", text: "text-[#c04332]", border: "border-[#f5cfc7]" },
  { icon: "bolt", bg: "bg-[#e8f1fc]", text: "text-[#225bb8]", border: "border-[#cce0fc]" },
];

export default function MultiplayerLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params.roomCode as string) || "").toUpperCase();

  // 1. Authentication & Room Queries
  const { data: currentUser } = useCurrentUser();
  const {
    data: initialRoom,
    isLoading: isRestLoading,
    isError: isRestError,
    error: restError,
    refetch,
  } = useRoom(roomCode);
  const { leaveRoom, startMatch } = useBattleMutations();

  // 2. Real-time Socket Synchronization
  const {
    room: socketRoom,
    isConnected,
    isStarting: isSocketStarting,
    opponentDisconnected,
    error: socketError,
    startBattle: emitStartBattle,
    clearError,
  } = useLobbySocket(roomCode, initialRoom);

  const room = socketRoom || initialRoom;

  // Local state for interactive controls
  const [pinHidden, setPinHidden] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.origin}/lobby/${roomCode}`);
    }
  }, [roomCode]);

  // Toast notification helper
  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // Formatted PIN (e.g., "824 229" or "K8L 9M0")
  const formattedPin =
    roomCode.length === 6 ? `${roomCode.slice(0, 3)} ${roomCode.slice(3)}` : roomCode;

  // Copy PIN action
  const handleCopyPin = () => {
    if (!roomCode) return;
    navigator.clipboard?.writeText(roomCode);
    showToast(`Room PIN ${formattedPin} copied to clipboard!`);
  };

  // Copy Invite URL action
  const handleCopyInviteLink = () => {
    if (!joinUrl) return;
    navigator.clipboard?.writeText(joinUrl);
    showToast("Join link copied to clipboard!");
  };

  // Toggle PIN visibility
  const togglePinVisibility = () => {
    setPinHidden((prev) => !prev);
  };

  // Auto-redirect if room is in progress
  useEffect(() => {
    if (room && (room.status === "IN_PROGRESS" || room.status === "active")) {
      router.push(`/battle/${roomCode}`);
    }
  }, [room, roomCode, router]);

  // Leave room action
  const handleLeave = async () => {
    try {
      await leaveRoom.mutateAsync(roomCode);
    } catch (err) {
      console.error("Failed to leave room", err);
    } finally {
      router.push("/dashboard");
    }
  };

  // Host determination
  const hostId = room?.host?._id || (room as { hostId?: string })?.hostId;
  const currentUserId = currentUser?._id;
  const isHost = Boolean(
    hostId &&
      currentUserId &&
      (hostId === currentUserId || hostId.toString() === currentUserId.toString())
  );

  const hostPlayer = room?.players.find(
    (p) => p.isHost || (p.user?._id && p.user._id.toString() === hostId?.toString())
  );
  const hostDisplayName =
    hostPlayer?.user?.displayName ||
    hostPlayer?.user?.username ||
    room?.host?.displayName ||
    room?.host?.username ||
    "Host";

  // Start game handler
  const isStarting = isSocketStarting || startMatch.isPending;

  const handleStartGame = async () => {
    if (!isHost || isStarting) return;
    try {
      // Call both socket and REST start to guarantee execution
      emitStartBattle();
      await startMatch.mutateAsync(roomCode);
    } catch (err: any) {
      console.error("Failed to start match:", err);
      showToast(err?.message || "Failed to start quiz arena");
    }
  };

  // Loading state
  if (isRestLoading && !room) {
    return (
      <div className="stitch-scope min-h-screen bg-[#fff8f0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#317a63]/20 border-t-[#317a63] rounded-full animate-spin" />
          <p className="font-label-md text-label-md text-on-surface-variant font-semibold">
            Connecting to room {roomCode}...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isRestError || !room) {
    return (
      <div className="stitch-scope min-h-screen bg-[#fff8f0] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 bg-white border border-[#ede7de] rounded-[28px] shadow-xl space-y-4">
          <span className="material-symbols-outlined text-[48px] text-[#9f2b1d]">
            error
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Room Not Found
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {restError?.message ||
              "This quiz room does not exist, has expired, or is no longer accessible."}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2 rounded-full border border-[#ede7de] bg-[#f9f3ea] hover:bg-[#f3ede4] text-on-surface font-label-md text-label-md font-semibold cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 rounded-full bg-[#317a63] hover:bg-[#25604e] text-white font-label-md text-label-md font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const players = room.players || [];
  const playerCount = players.length;
  const maxCapacity = 4;
  const emptySlotsCount = Math.max(0, maxCapacity - playerCount);

  // Generate real QR code endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    joinUrl || `http://localhost:3000/lobby/${roomCode}`
  )}&color=31-122-99&bgcolor=ffffff`;

  return (
    <div className="stitch-scope bg-[#fff8f0] font-body-md text-on-surface antialiased relative min-h-screen selection:bg-primary-container/20 selection:text-primary-container">
      {/* Ambient Pastel Blur Background Orbs in Warm Ivory Studio palette */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-[#e8f5ee]/70 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] -left-32 w-[500px] h-[500px] bg-[#fbf2eb]/80 rounded-full blur-[110px]"></div>
        <div className="absolute top-[60%] -right-32 w-[600px] h-[600px] bg-[#f3ece0]/70 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-[#eef7f2]/60 rounded-full blur-[120px]"></div>
      </div>

      {/* Starting Arena Fullscreen Transition Overlay */}
      {isStarting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fff8f0]/95 backdrop-blur-md transition-all duration-300">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] border border-[#d2eadc] text-xs font-bold text-[#317a63] font-mono tracking-wide uppercase animate-pulse">
              <Swords className="h-4 w-4" />
              Initializing Live Arena
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
              Quiz Commencing!
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Synchronizing question queue and preparing server timer...
            </p>
            <div className="relative flex items-center justify-center pt-2">
              <div className="w-14 h-14 border-4 border-[#317a63]/20 border-t-[#317a63] rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center gap-space-sm bg-white/95 backdrop-blur-xl border border-[#ede7de] px-space-lg py-space-sm rounded-full shadow-2xl text-on-surface font-label-md text-label-md ${
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
        id="toast"
      >
        <span className="material-symbols-outlined text-[18px] text-[#317a63]">
          check_circle
        </span>
        <span>{toastMessage}</span>
      </div>

      {/* Top Header (Frosted Glass Top Bar) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/90 backdrop-blur-xl border-b border-[#ede7de] shadow-[0_4px_24px_-4px_rgba(29,27,22,0.05)]">
        <div className="h-16 w-full max-w-7xl mx-auto px-margin flex items-center justify-between gap-gutter">
          {/* Logo & PIN Pill */}
          <div className="flex items-center gap-space-lg">
            <Link href="/" className="flex items-center gap-space-sm group">
              <img
                alt="QUIZLY"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgDEsPLQBloC1SCsTjeMY8iNfAntP-gtvWG7vrtWlb0wHUwicLrhHmojhzyqRWIYO35NkBi3uMb_akJemMNbzLSEFN7mU0bDfz8EePPJ_eW_PUC10ZZeJz1eM-5YG5Ml4g3N_KUgQzBOj9xL31lbZA6NRoD66cQUZ2v2JboFw6zc4Eu5HkYc0In59NmCtV8lOEt3gQrCKxHkFHFeQn3BqD1ru9s18jHp_gw4KE9KtOpiPBnUWhmBU"
              />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold group-hover:text-primary transition-colors">
                QUIZLY
              </span>
            </Link>

            <div className="flex items-center bg-[#f3ede4]/90 border border-[#e2dacd] rounded-full pl-space-md pr-space-xs py-1.5 shadow-[0_2px_8px_rgba(49,122,99,0.06)]">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#317a63] font-bold">
                Room PIN
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-wider ml-space-sm font-mono select-all">
                {pinHidden ? "••• •••" : formattedPin}
              </span>
              <button
                className="ml-space-sm w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-[#e8f5ee] text-[#317a63] transition-all active:scale-95 shadow-sm border border-[#ede7de] cursor-pointer"
                onClick={handleCopyPin}
                title="Copy PIN"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  content_copy
                </span>
              </button>
            </div>
          </div>

          {/* Center Navigation (Only agreed functional view) */}
          <nav className="hidden lg:flex items-center gap-space-xs bg-[#f3ede4] backdrop-blur-md p-1 rounded-full border border-[#ede7de]">
            <span className="px-space-md py-1.5 transition-colors bg-white text-[#317a63] font-bold rounded-full shadow-sm select-none">
              Lobby
            </span>
          </nav>

          {/* Right Controls: Player Count, Leave, Profile */}
          <div className="flex items-center gap-space-md">
            {/* Live Player Count */}
            <div className="flex items-center gap-space-xs bg-[#ffffff] border border-[#ede7de] px-space-md py-1.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-[#317a63]">
                group
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold tabular-nums">
                {playerCount}/{maxCapacity} Players
              </span>
              <span className="w-2 h-2 rounded-full bg-[#317a63] animate-pulse ml-0.5"></span>
            </div>

            {/* Leave Lobby Button */}
            <button
              onClick={handleLeave}
              disabled={leaveRoom.isPending}
              className="flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-[#fbeae7] hover:bg-[#f8ded8] text-[#9f2b1d] border border-[#f4c8c0] transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
              title="Leave Lobby"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="font-label-md text-label-md hidden sm:inline font-semibold">
                {leaveRoom.isPending ? "Leaving..." : "Leave"}
              </span>
            </button>

            {/* User Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#317a63] flex items-center justify-center text-white shadow-sm shadow-[#317a63]/25 overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-white text-[18px]">
                  person
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Lounge Body */}
      <main className="w-full pt-16 min-h-screen">
        <div className="flex flex-col w-full">
          {/* Disconnect Warning Banner */}
          {opponentDisconnected && (
            <div className="max-w-5xl mx-auto w-full px-margin-sm md:px-margin mt-4">
              <div className="flex items-center gap-2.5 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-700 text-sm font-semibold animate-pulse">
                <WifiOff className="h-5 w-5 shrink-0 text-amber-600" />
                <span>
                  A player temporarily disconnected. Waiting for them to reconnect...
                </span>
              </div>
            </div>
          )}

          {/* Lounge Container */}
          <div className="w-full py-space-xl px-margin-sm md:px-margin relative flex flex-col items-center justify-start">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-space-xl relative z-10">
              {/* SECTION 1: Room Information & Invitation Banner */}
              <section className="w-full bg-[#ffffff] backdrop-blur-xl rounded-[28px] p-space-lg md:p-space-xl border border-[#ede7de] shadow-[0_8px_32px_0_rgba(49,122,99,0.04),0_1px_2px_0_rgba(29,27,22,0.03)] flex flex-col lg:flex-row items-center justify-between gap-space-lg relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#e8f5ee]/50 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-[#f9f3ea]/60 rounded-full blur-3xl pointer-events-none"></div>

                {/* Left: Dynamic Join URL & Copy Button */}
                <div className="flex-1 w-full flex flex-col items-start gap-space-sm relative z-10">
                  <div className="flex items-center gap-space-xs text-[#317a63] uppercase tracking-wider font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    <span>Join at</span>
                  </div>
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <img
                      alt="QUIZLY"
                      className="h-9 w-auto object-contain bg-white p-1.5 rounded-xl border border-[#ede7de] shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgDEsPLQBloC1SCsTjeMY8iNfAntP-gtvWG7vrtWlb0wHUwicLrhHmojhzyqRWIYO35NkBi3uMb_akJemMNbzLSEFN7mU0bDfz8EePPJ_eW_PUC10ZZeJz1eM-5YG5Ml4g3N_KUgQzBOj9xL31lbZA6NRoD66cQUZ2v2JboFw6zc4Eu5HkYc0In59NmCtV8lOEt3gQrCKxHkFHFeQn3BqD1ru9s18jHp_gw4KE9KtOpiPBnUWhmBU"
                    />
                    <span className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">
                      {typeof window !== "undefined" ? window.location.host : "quizly"}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                    Open on any mobile browser or desktop to jump straight into this
                    quiz.
                  </p>
                  <button
                    className="mt-space-xs flex items-center gap-space-xs px-space-md py-2 bg-[#f9f3ea] hover:bg-[#f3ede4] text-[#317a63] rounded-full font-label-md text-label-md transition-all active:scale-95 shadow-sm border border-[#ede7de] cursor-pointer font-semibold"
                    onClick={handleCopyInviteLink}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      open_in_new
                    </span>
                    <span>Copy invite link</span>
                  </button>
                </div>

                {/* Center: Real Room PIN Showcase */}
                <div className="flex-1 w-full flex flex-col items-center text-center px-space-lg py-space-md bg-[#faf7f2] border border-[#ede7de] rounded-2xl relative z-10 shadow-inner">
                  <span className="text-on-surface-variant uppercase tracking-widest font-label-sm text-label-sm font-bold">
                    Game PIN code
                  </span>
                  <div className="my-space-xs flex items-center justify-center">
                    <span
                      className="font-display-lg text-display-lg font-extrabold text-[#317a63] tracking-widest tabular-nums select-all drop-shadow-sm font-mono"
                      id="pin-display"
                    >
                      {pinHidden ? "••• •••" : formattedPin}
                    </span>
                  </div>
                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-space-sm mt-space-xs">
                    <button
                      className="flex items-center gap-1.5 px-space-md py-1.5 bg-white hover:bg-[#f3ede4] text-on-surface rounded-full font-label-sm text-label-sm transition-all active:scale-95 shadow-sm border border-[#ede7de] font-semibold cursor-pointer"
                      onClick={handleCopyPin}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#317a63]">
                        content_copy
                      </span>
                      <span>Copy PIN</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-space-md py-1.5 bg-white hover:bg-[#f3ede4] text-on-surface rounded-full font-label-sm text-label-sm transition-all active:scale-95 shadow-sm border border-[#ede7de] font-semibold cursor-pointer"
                      onClick={togglePinVisibility}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#317a63]">
                        {pinHidden ? "visibility_off" : "visibility"}
                      </span>
                      <span>{pinHidden ? "Show PIN" : "Hide PIN"}</span>
                    </button>
                  </div>
                </div>

                {/* Right: Real Scannable QR Code */}
                <div className="w-full lg:w-auto flex flex-col items-center justify-center relative z-10">
                  <div className="bg-white p-space-md rounded-2xl shadow-[0_4px_20px_-2px_rgba(49,122,99,0.06)] border border-[#ede7de] flex flex-col items-center gap-space-xs text-on-surface">
                    <img
                      src={qrCodeUrl}
                      alt={`Scan QR code to join room ${roomCode}`}
                      className="w-28 h-28 object-contain rounded-lg"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-tight text-center">
                      Scan with camera
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Player Roster & Waiting Lounge */}
              <section className="w-full bg-[#fcfaf7] backdrop-blur-xl rounded-[28px] p-space-lg md:p-space-xl border border-[#ede7de] shadow-[0_8px_32px_0_rgba(49,122,99,0.04),0_1px_2px_0_rgba(29,27,22,0.03)] flex flex-col gap-space-lg">
                {/* Header & Instructions */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                  <div className="flex flex-col gap-space-xs">
                    <div className="inline-flex items-center gap-space-xs w-fit px-space-md py-0.5 rounded-full bg-[#e8f5ee] border border-[#d2eadc] text-[#317a63] font-label-sm text-label-sm font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#317a63] animate-ping"></span>
                      Live Room Roster
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                      {playerCount >= maxCapacity
                        ? "Full Party Assembled!"
                        : isHost && playerCount === 1
                        ? "You are ready to start (or wait for others)..."
                        : "Waiting for players..."}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Share the PIN or QR code with friends to join the arena.
                    </p>
                  </div>
                  {/* Lobby Slot Count Status Pill */}
                  <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-white border border-[#ede7de] text-on-surface font-label-md text-label-md self-start sm:self-auto shadow-sm">
                    <span className="material-symbols-outlined text-[18px] text-[#317a63]">
                      group
                    </span>
                    <span className="font-bold text-[#317a63]">
                      {playerCount} of {maxCapacity}
                    </span>
                    <span className="text-on-surface-variant">Slots Filled</span>
                  </div>
                </div>

                {/* 4-Card Responsive Grid Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md w-full">
                  {/* Connected Players */}
                  {players.map((player, index) => {
                    const isPlayerHost =
                      player.isHost ||
                      (player.user?._id && player.user._id.toString() === hostId?.toString());
                    const name =
                      player.user?.displayName || player.user?.username || `Player ${index + 1}`;
                    const style = SLOT_STYLES[index % SLOT_STYLES.length];

                    return (
                      <div
                        key={player.user?._id || `player-${index}`}
                        className="relative bg-white rounded-[24px] p-space-lg flex flex-col items-center text-center shadow-[0_4px_20px_-2px_rgba(49,122,99,0.06)] border border-[#ede7de] hover:border-[#317a63]/40 transition-all transform hover:-translate-y-1 min-h-[220px]"
                      >
                        {/* Host Crown Badge */}
                        {isPlayerHost && (
                          <div className="absolute -top-3.5 px-space-md py-0.5 bg-[#fef7ea] border border-[#fae2ba] text-[#8a5b00] font-label-sm text-label-sm rounded-full shadow-sm flex items-center gap-1 font-bold">
                            <span>👑</span>
                            <span>HOST</span>
                          </div>
                        )}

                        {/* Avatar Container */}
                        <div
                          className={`w-20 h-20 rounded-full ${style.bg} ${style.text} flex items-center justify-center shadow-inner mt-space-xs mb-space-sm border ${style.border} overflow-hidden`}
                        >
                          {player.user?.avatar ? (
                            <img
                              src={player.user.avatar}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[44px]">
                              {style.icon}
                            </span>
                          )}
                        </div>

                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate max-w-full">
                          {name}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                          {isPlayerHost ? "Room Admin" : `Player #${index + 1}`}
                        </span>

                        <div className="mt-auto inline-flex items-center gap-1.5 px-space-md py-1 bg-[#e8f5ee] text-[#317a63] border border-[#d2eadc] font-label-sm text-label-sm rounded-full font-bold">
                          <span className="w-2 h-2 rounded-full bg-[#317a63]"></span>
                          READY
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Waiting Slots (Up to 4 slots total) */}
                  {Array.from({ length: emptySlotsCount }).map((_, i) => {
                    const slotNum = playerCount + i + 1;
                    return (
                      <div
                        key={`empty-slot-${slotNum}`}
                        className="relative bg-[#f9f3ea]/70 border-2 border-dashed border-[#d8d0c4] rounded-[24px] p-space-lg flex flex-col items-center justify-center text-center min-h-[220px]"
                      >
                        <div className="w-16 h-16 rounded-full bg-white text-[#317a63] flex items-center justify-center mb-space-sm animate-pulse border border-[#ede7de]">
                          <span className="material-symbols-outlined text-[32px]">
                            person_add
                          </span>
                        </div>
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold max-w-[150px]">
                          Waiting for next player...
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Slot #{slotNum} of {maxCapacity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Remaining Slots Footer */}
                <div className="w-full flex items-center justify-center gap-space-xs pt-space-xs">
                  {emptySlotsCount > 0 ? (
                    <>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Plus {emptySlotsCount} more empty slot{emptySlotsCount > 1 ? "s" : ""} open for friends
                      </span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#317a63]"></span>
                      <span className="font-body-sm text-body-sm text-[#317a63] font-semibold">
                        Ready for party
                      </span>
                    </>
                  ) : (
                    <span className="font-body-sm text-body-sm text-[#317a63] font-bold">
                      Full 4-player party assembled! Ready for quiz.
                    </span>
                  )}
                </div>
              </section>

              {/* SECTION 3: Host Game Controls & Quick Settings */}
              <section className="w-full flex flex-col items-center justify-center gap-space-md pb-space-lg">
                {/* Start Game Primary Action Button */}
                <button
                  onClick={handleStartGame}
                  disabled={!isHost || isStarting}
                  className="w-full sm:w-auto px-12 py-4 bg-[#317a63] hover:bg-[#25604e] text-white rounded-full font-headline-sm text-headline-sm font-extrabold shadow-[0_8px_24px_-4px_rgba(49,122,99,0.35)] hover:shadow-[0_12px_32px_-4px_rgba(49,122,99,0.45)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-space-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#317a63]"
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                  <span>{isStarting ? "Launching Quiz Arena..." : "Start Quiz"}</span>
                </button>

                {/* Host Permission Notice */}
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-[#317a63]">
                    {isHost ? "check_circle" : "lock"}
                  </span>
                  <span>
                    {isHost ? (
                      <>
                        You are the room host. Ready to start whenever you want!
                      </>
                    ) : (
                      <>
                        Only the room host (
                        <strong className="text-on-surface font-bold">
                          {hostDisplayName}
                        </strong>
                        ) can start the quiz
                      </>
                    )}
                  </span>
                </div>

                {/* Quick Settings Indicators Bar */}
                <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-xs bg-white/90 backdrop-blur-md border border-[#ede7de] px-space-lg py-space-sm rounded-full text-on-surface-variant font-label-md text-label-md shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#317a63]">
                      category
                    </span>
                    <span>
                      Category:{" "}
                      <strong className="text-on-surface capitalize">
                        {room.settings?.categoryId || room.settings?.topic || "General"}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[#d8d0c4] hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#317a63]">
                      subject
                    </span>
                    <span>
                      Subject:{" "}
                      <strong className="text-on-surface capitalize">
                        {room.settings?.isMixedCategory
                          ? "Mixed Category Pool"
                          : room.settings?.subjectId || "Standard Mix"}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[#d8d0c4] hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#317a63]">
                      quiz
                    </span>
                    <span>
                      Questions:{" "}
                      <strong className="text-on-surface">
                        {room.settings?.questionCount || 10} Questions
                      </strong>
                    </span>
                  </div>
                  <span className="text-[#d8d0c4] hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#317a63]">
                      timer
                    </span>
                    <span>
                      Timer:{" "}
                      <strong className="text-on-surface">
                        {room.settings?.timeLimit || (room as any).timePerQuestion || 30}s / question
                      </strong>
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/70 backdrop-blur-xl border-t border-[#ede7de] py-space-xl mt-space-2xl">
        <div className="max-w-7xl mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm font-bold text-[#317a63]">
              QUIZLY
            </span>
            <span className="font-body-sm text-body-sm">
              • Social trivia made tactical &amp; ambient
            </span>
          </div>
          <div className="font-body-sm text-body-sm">
            © 2025 Quizly Multiplayer. Waiting Room Protocol.
          </div>
        </div>
      </footer>
    </div>
  );
}
