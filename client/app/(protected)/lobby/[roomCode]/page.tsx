"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { LogOut, RefreshCw, Swords } from "lucide-react";
import {
  useRoom,
  useBattleMutations,
  PlayerList,
  InviteCodeCard,
  BattleSettings,
  BattleStatus,
  BattleSkeleton,
} from "@/features/battle";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  // Hooks
  const { data: currentUser } = useCurrentUser();
  const { data: room, isLoading, isError, error, refetch } = useRoom(roomCode);
  const { leaveRoom } = useBattleMutations();

  const handleLeave = async () => {
    try {
      await leaveRoom.mutateAsync(roomCode);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to leave room", err);
    }
  };

  const isHost = currentUser && room && room.host?._id === currentUser._id;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <BattleSkeleton />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="mx-auto max-w-md text-center p-8 border border-destructive/20 bg-destructive/5 rounded-2xl space-y-4 my-12">
        <Swords className="h-10 w-10 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-foreground">Failed to enter battle lobby</h3>
        <p className="text-sm text-muted-foreground">
          {error?.message || "This room may have been deleted, or the invite code is invalid."}
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

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Swords className="h-3.5 w-3.5" />
            Battle Lobby
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mt-2 font-mono">
            Room: {room.roomCode}
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
      <BattleStatus room={room} />

      {/* Asymmetric Core Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Left Component (Players List) */}
        <div className="md:col-span-2 space-y-6">
          <PlayerList players={room.players} />
        </div>

        {/* Right Components (Share + Configs) */}
        <div className="md:col-span-1 space-y-6">
          <InviteCodeCard roomCode={room.roomCode} />
          
          <BattleSettings
            roomCode={room.roomCode}
            settings={room.settings}
            isHost={!!isHost}
          />
        </div>
      </div>
    </div>
  );
}
