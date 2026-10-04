"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";
import { getGuestToken, isGuestSessionActive } from "@/features/auth/guestAuth";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const setSocketConnected = useBattleStore((state) => state.setSocketConnected);
  const [guestActive, setGuestActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isGuestSessionActive();
  });

  useEffect(() => {
    const handleGuestAuthChange = () => {
      setGuestActive(isGuestSessionActive());
    };

    window.addEventListener("codearena:guest-auth-change", handleGuestAuthChange);
    return () => {
      window.removeEventListener("codearena:guest-auth-change", handleGuestAuthChange);
    };
  }, []);
  
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    let active = true;
    const isAuthed = Boolean(isSignedIn || guestActive);

    if (!isAuthed) {
      socketManager.disconnect();
      setSocketConnected(false);
      return;
    }

    const initSocket = async () => {
      try {
        let token: string | null = null;
        if (isSignedIn) {
          token = await getTokenRef.current();
        } else if (guestActive) {
          token = getGuestToken();
        }

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
  }, [isSignedIn, guestActive, setSocketConnected]);

  return <>{children}</>;
}
export default SocketProvider;
