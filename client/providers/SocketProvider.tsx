"use client";

import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const setSocketConnected = useBattleStore((state) => state.setSocketConnected);

  useEffect(() => {
    let active = true;

    if (!isSignedIn) {
      socketManager.disconnect();
      setSocketConnected(false);
      return;
    }

    const initSocket = async () => {
      try {
        const token = await getToken();
        if (!token || !active) return;

        const socket = socketManager.connect(token);

        const handleConnect = () => {
          if (active) setSocketConnected(true);
        };

        const handleDisconnect = () => {
          if (active) setSocketConnected(false);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        // Sync initial state
        if (socket.connected) {
          setSocketConnected(true);
        }

        return () => {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
        };
      } catch (error) {
        console.error("🔌 Failed to initialize Socket.IO connection:", error);
      }
    };

    let cleanupFn: (() => void) | undefined;
    initSocket().then((cleanup) => {
      if (cleanup) cleanupFn = cleanup;
    });

    return () => {
      active = false;
      if (cleanupFn) {
        cleanupFn();
      }
      socketManager.disconnect();
      setSocketConnected(false);
    };
  }, [isSignedIn, getToken, setSocketConnected]);

  return <>{children}</>;
}
export default SocketProvider;
