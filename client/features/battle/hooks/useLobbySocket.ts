"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { socketManager } from "@/lib/socket";
import { Room, RoomPlayer, RoomSettings, BattleInitPayload, RoomStatusType } from "@/types";
import { useBattleStore } from "@/store/battleStore";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";

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
    questionCount?: number;
  };
  status: RoomStatusType;
}


export function useLobbySocket(roomCode: string, initialRoomData?: Room | null) {
  const router = useRouter();
  const setBattleInitData = useBattleStore((state) => state.setBattleInitData);

  const [room, setRoom] = useState<Room | null>(initialRoomData || null);
  const [isConnected, setIsConnected] = useState(() => socketManager.getSocket()?.connected ?? false);
  const [isStarting, setIsStarting] = useState(false);

  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigatedRef = useRef(false);

  // Helper to map socket payload to Client Room interface
  const mapPayloadToRoom = useCallback((payload: SocketRoomPayload): Room => {
    const mappedPlayers: RoomPlayer[] = (payload.players || []).map((p) => ({
      user: {
        _id: p.userId,
        username: p.username,
        displayName: p.displayName || p.username,
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
        questionCount: payload.settings.questionCount || 10,
      },
      topic: payload.settings.topic,
      difficulty: payload.settings.difficulty,
      duration: payload.settings.duration,
      questionCount: payload.settings.questionCount || 10,
      status: payload.status,
    };
  }, []);

  // Navigate to live battle

  const navigateToBattle = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    router.push(`/battle/${roomCode.toUpperCase()}`);
  }, [router, roomCode]);

  // 1. Connection & Join logic
  useEffect(() => {
    const hasAuth = isNativeAuthActive() || isGuestSessionActive();
    if (!hasAuth || !roomCode) return;

    let active = true;
    const socket = socketManager.getSocket();

    const handleConnect = () => {
      if (!active) return;
      setIsConnected(true);
      setError(null);
      socketManager.emit("room:join", { roomCode: roomCode.toUpperCase() });
    };

    const handleDisconnect = () => {
      if (!active) return;
      setIsConnected(false);
    };

    const handleConnectError = () => {
      if (!active) return;
      setError("Connecting to live arena server...");
    };

    const handleRoomUpdate = (payload: SocketRoomPayload) => {
      if (!active) return;
      try {
        const parsed = mapPayloadToRoom(payload);
        setRoom(parsed);

        // If status became IN_PROGRESS, navigate to battle page
        if (
          parsed.status === "IN_PROGRESS" ||
          parsed.status === "active" ||
          parsed.status === "starting"
        ) {
          setIsStarting(true);
          setTimeout(() => {
            navigateToBattle();
          }, 800);
        }
      } catch (err) {
        console.error("Failed to parse room socket update:", err);
      }
    };

    const handleBattleInit = (payload: BattleInitPayload) => {
      if (!active) return;
      setBattleInitData(payload);
      setIsStarting(true);
      setTimeout(() => {
        navigateToBattle();
      }, 500);
    };

    const handlePlayerDisconnected = () => {
      if (!active) return;
      setOpponentDisconnected(true);
    };

    const handlePlayerReconnected = () => {
      if (!active) return;
      setOpponentDisconnected(false);
    };

    const handleSocketError = (payload: { message: string }) => {
      if (!active) return;
      setError(payload.message || "An error occurred in the room.");
      setIsStarting(false);
    };

    if (socket) {
      if (socket.connected) {
        socketManager.emit("room:join", { roomCode: roomCode.toUpperCase() });
      }


      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("room:update", handleRoomUpdate);
      socket.on("battle:init", handleBattleInit);
      socket.on("player:disconnected", handlePlayerDisconnected);
      socket.on("player:reconnected", handlePlayerReconnected);
      socket.on("error", handleSocketError);
    }

    return () => {
      active = false;
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.off("room:update", handleRoomUpdate);
        socket.off("battle:init", handleBattleInit);
        socket.off("player:disconnected", handlePlayerDisconnected);
        socket.off("player:reconnected", handlePlayerReconnected);
        socket.off("error", handleSocketError);
      }
    };
  }, [roomCode, mapPayloadToRoom, navigateToBattle, setBattleInitData]);

  // Actions
  const toggleReady = useCallback(
    (isReady: boolean) => {
      setError(null);
      socketManager.emit("room:ready", { roomCode: roomCode.toUpperCase(), isReady });
    },
    [roomCode]
  );

  const updateLobbySettings = useCallback(
    (settings: RoomSettings) => {
      setError(null);
      socketManager.emit("room:update", {
        roomCode: roomCode.toUpperCase(),
        settings,
      });
    },
    [roomCode]
  );

  const startBattle = useCallback(() => {
    setError(null);
    setIsStarting(true);
    socketManager.emit("room:start_battle", { roomCode: roomCode.toUpperCase() });
  }, [roomCode]);

  return {
    room: room || initialRoomData || null,

    isConnected,
    isStarting,
    opponentDisconnected,
    error,
    toggleReady,
    updateLobbySettings,
    startBattle,
    clearError: () => setError(null),
  };
}
export default useLobbySocket;
