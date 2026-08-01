"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LogOut, RefreshCw, Swords, Play, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRoom } from "@/features/battle/hooks/useRoom";
import { useBattleMutations } from "@/features/battle/hooks/useBattleMutations";
import { useLobbySocket } from "@/features/battle/hooks/useLobbySocket";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { PlayerList } from "@/features/battle/components/PlayerList";
import { InviteCodeCard } from "@/features/battle/components/InviteCodeCard";
import { BattleSettings } from "@/features/battle/components/BattleSettings";
import { BattleStatus } from "@/features/battle/components/BattleStatus";
import { BattleSkeleton } from "@/features/battle/components/BattleSkeleton";
import { Button } from "@/components/ui/button";

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  // 1. Fetch initial DB values
  const { data: currentUser } = useCurrentUser();
  const { data: initialRoom, isLoading: isRestLoading, isError: isRestError, error: restError, refetch } = useRoom(roomCode);
  const { leaveRoom, startMatch } = useBattleMutations();

  // 2. Bind Socket synchronization
  const {
    room: socketRoom,
    isConnected,
    countdown,
    error: socketError,
    toggleReady,
    updateLobbySettings,
  } = useLobbySocket(roomCode, initialRoom);

  // Fallback to REST initial data if socket sync is still loading
  const room = socketRoom || initialRoom;

  const handleLeave = async () => {
    try {
      await leaveRoom.mutateAsync(roomCode);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to leave room", err);
    }
  };

  const handleStartMatch = async () => {
    try {
      await startMatch.mutateAsync(roomCode);
    } catch (err) {
      console.error("Failed to start match", err);
    }
  };

  if (isRestLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <BattleSkeleton />
      </div>
    );
  }

  if (isRestError || !room) {
    return (
      <div className="mx-auto max-w-md text-center p-8 border border-destructive/20 bg-destructive/5 rounded-2xl space-y-4 my-12 animate-in fade-in slide-in-from-bottom-3 duration-250">
        <Swords className="h-10 w-10 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-foreground">Failed to enter battle lobby</h3>
        <p className="text-sm text-muted-foreground">
          {restError?.message || "This room may have been deleted, or the invite code is invalid."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="border border-border text-foreground hover:bg-secondary/45"
          >
            Dashboard
          </Button>
          <Button onClick={() => refetch()} className="bg-primary text-primary-foreground">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const isHost = currentUser && room.host?._id === currentUser._id;
  const myPlayer = room.players.find((p) => p.user?._id === currentUser?._id);
  const isMyReady = myPlayer?.isReady || false;

  const opponent = room.players.find((p) => p.user?._id !== currentUser?._id);
  
  const isLobbyFull = room.players.length === 2;
  const allPlayersReady = room.players.length === 2 && room.players.every((p) => p.isReady);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12 relative">
      {/* 5-second countdown overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="text-center space-y-6 max-w-md px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary font-mono tracking-wide uppercase animate-pulse">
              <Swords className="h-4 w-4" />
              Loading Arena Specifications
            </div>
            
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight md:text-4xl">
              Match Commencing
            </h2>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prepare yourself. Loading challenge description, test configuration metrics, and editor container assets...
            </p>

            <div className="relative flex items-center justify-center">
              {/* Outer pulsing glow */}
              <div className="absolute w-36 h-36 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="h-28 w-28 rounded-full border-2 border-primary/40 bg-card flex items-center justify-center font-mono font-black text-6xl text-primary shadow-2xl relative z-10">
                {countdown}
              </div>
            </div>

            <div className="text-xs text-muted-foreground/60 font-mono tracking-wider">
              {countdown > 2 ? "INITIALIZING SANDBOX..." : "INJECTING SOURCE TEMPLATES..."}
            </div>
          </div>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Swords className="h-3.5 w-3.5 animate-pulse" />
            Battle Lobby
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mt-2 font-mono">
            RoomCode: {room.roomCode}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="ghost"
            className="border border-border hover:bg-secondary/45 text-foreground transition-colors gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleLeave}
            disabled={leaveRoom.isPending}
            variant="ghost"
            className="border border-destructive/25 text-destructive hover:bg-destructive/10 transition-colors gap-1.5 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {leaveRoom.isPending ? "Exiting..." : "Leave Lobby"}
          </Button>
        </div>
      </div>

      {/* Connection State Panel */}
      <BattleStatus
        room={room}
        isConnected={isConnected}
        socketError={socketError}
      />

      {/* Asymmetric Core Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Left Component (Players List + Actions) */}
        <div className="md:col-span-2 space-y-6">
          <PlayerList players={room.players} />

          {/* Action Row: Ready and Start Buttons */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
            
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-foreground">Lobby Actions</h3>
              <p className="text-xs text-muted-foreground">
                {!isLobbyFull
                  ? "Waiting for a competitor to join before starting."
                  : !allPlayersReady
                  ? "Both competitors must toggle Ready to begin."
                  : isHost
                  ? "Lobby is locked and loaded. Initiate the match!"
                  : "Waiting for the lobby host to initiate match."}
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {/* Ready/Unready Toggle */}
              <Button
                onClick={() => toggleReady(!isMyReady)}
                className={`flex-1 sm:flex-initial h-11 px-6 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isMyReady
                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/25"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                }`}
              >
                {isMyReady ? "Not Ready" : "Toggle Ready"}
              </Button>

              {/* Host Start Match Button */}
              {isHost && (
                <Button
                  onClick={handleStartMatch}
                  disabled={!allPlayersReady || startMatch.isPending}
                  className="flex-1 sm:flex-initial bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary h-11 px-6 gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-primary/10 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {startMatch.isPending ? "Starting..." : "Start Match"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Components (Share + Configs) */}
        <div className="md:col-span-1 space-y-6">
          <InviteCodeCard roomCode={room.roomCode} />
          
          <BattleSettings
            roomCode={room.roomCode}
            settings={room.settings}
            isHost={!!isHost}
            onUpdate={isHost ? updateLobbySettings : undefined}
          />
        </div>
      </div>
    </div>
  );
}
