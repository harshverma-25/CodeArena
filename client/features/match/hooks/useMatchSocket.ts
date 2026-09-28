"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";

export function useMatchSocket(roomCode: string | undefined, _matchId: string, myUserId: string | undefined) {
  const { isLoaded, isSignedIn } = useAuth();
  
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setSocketConnected,
  } = useBattleStore();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !roomCode || !myUserId) return;

    let active = true;
    const socket = socketManager.getSocket();

    const handleConnect = () => {
      if (!active) return;
      setIsConnected(true);
      setError(null);
      setSocketConnected(true);
      // Join room to receive match status events
      socketManager.emit("room:join", { roomCode });
    };

    const handleDisconnect = () => {
      if (!active) return;
      setIsConnected(false);
      setSocketConnected(false);
    };

    const handleConnectError = (_err: Error) => {
      if (!active) return;
      setError("Socket connection failed. Attempting to reconnect...");
    };

    // Bind listeners
    if (socket) {
      setIsConnected(socket.connected);
      setSocketConnected(socket.connected);

      if (socket.connected) {
        socketManager.emit("room:join", { roomCode });
      }

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
    }

    return () => {
      active = false;
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
      }
    };
  }, [
    isLoaded,
    isSignedIn,
    roomCode,
    myUserId,
    setSocketConnected,
  ]);

  return {
    isConnected,
    error,
  };
}
export default useMatchSocket;
