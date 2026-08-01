"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { socketManager } from "@/lib/socket";
import { Room, RoomPlayer, RoomSettings } from "@/types";

interface SocketRoomPayload {
  roomCode: string;
  hostId: string;
  players: Array<{
    userId: string;
    username: string;
    displayName: string;
    avatar: string;
    isHost: boolean;
    isReady: boolean;
  }>;
  settings: {
    topic: string;
    difficulty: string;
    duration: number;
  };
  status: "waiting" | "full" | "starting" | "active" | "finished";
}

export function useLobbySocket(roomCode: string, initialRoomData?: Room | null) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  
  const [room, setRoom] = useState<Room | null>(initialRoomData || null);
  const [isConnected, setIsConnected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to map socket payload to Client Room interface
  const mapPayloadToRoom = useCallback((payload: SocketRoomPayload): Room => {
    const mappedPlayers: RoomPlayer[] = payload.players.map((p) => ({
      user: {
        _id: p.userId,
        username: p.username,
        displayName: p.displayName,
        avatar: p.avatar,
      },
      isHost: p.isHost,
      isReady: p.isReady,
    }));

    const hostPlayer = mappedPlayers.find((p) => p.isHost);

    return {
      roomCode: payload.roomCode,
      host: hostPlayer ? hostPlayer.user : null,
      players: mappedPlayers,
      settings: {
        topic: payload.settings.topic,
        difficulty: payload.settings.difficulty,
        duration: payload.settings.duration,
      },
      topic: payload.settings.topic,
      difficulty: payload.settings.difficulty,
      duration: payload.settings.duration,
      status: payload.status,
    };
  }, []);

  // 1. Connection & Join logic
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !roomCode) return;

    let active = true;
    const socket = socketManager.getSocket();

    const handleConnect = () => {
      if (!active) return;
      setIsConnected(true);
      setError(null);
      // Emit room join on connect
      socketManager.emit("room:join", { roomCode });
    };

    const handleDisconnect = () => {
      if (!active) return;
      setIsConnected(false);
    };

    const handleConnectError = (err: Error) => {
      if (!active) return;
      setError("Socket connection failed. Attempting to reconnect...");
    };

    const handleRoomUpdate = (payload: SocketRoomPayload) => {
      if (!active) return;
      try {
        const parsed = mapPayloadToRoom(payload);
        setRoom(parsed);
      } catch (err) {
        console.error("Failed to parse room socket update:", err);
      }
    };

    const handleMatchStart = (payload: { matchId: string; roomCode: string }) => {
      if (!active) return;
      setMatchId(payload.matchId);
      setCountdown(5); // Start 5 second countdown
    };

    const handleSocketError = (payload: { message: string }) => {
      if (!active) return;
      setError(payload.message || "An error occurred in the room.");
    };

    // Bind listeners
    if (socket) {
      setIsConnected(socket.connected);
      
      // If already connected, join room directly
      if (socket.connected) {
        socketManager.emit("room:join", { roomCode });
      }

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("room:update", handleRoomUpdate);
      socket.on("match:start", handleMatchStart);
      socket.on("error", handleSocketError);
    }

    return () => {
      active = false;
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.off("room:update", handleRoomUpdate);
        socket.off("match:start", handleMatchStart);
        socket.off("error", handleSocketError);
      }
    };
  }, [isLoaded, isSignedIn, roomCode, mapPayloadToRoom]);

  // 2. Countdown Timer logic
  useEffect(() => {
    if (countdown === null || !matchId) return;

    if (countdown === 0) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      // Navigate to match page
      router.push(`/match/${matchId}`);
      return;
    }

    countdownIntervalRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearTimeout(countdownIntervalRef.current);
      }
    };
  }, [countdown, matchId, router]);

  // 3. Socket actions
  const toggleReady = useCallback((isReady: boolean) => {
    socketManager.emit("room:ready", { roomCode, isReady });
  }, [roomCode]);

  const updateLobbySettings = useCallback((settings: RoomSettings) => {
    socketManager.emit("room:update", { roomCode, settings });
  }, [roomCode]);

  return {
    room,
    isConnected,
    countdown,
    error,
    toggleReady,
    updateLobbySettings,
    clearError: () => setError(null),
  };
}
export default useLobbySocket;
