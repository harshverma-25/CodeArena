"use client";

import React, { useEffect, useState } from "react";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";
import { getGuestToken, isGuestSessionActive } from "@/features/auth/guestAuth";
import { getAccessToken, isNativeAuthActive } from "@/features/auth/nativeAuth";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const setSocketConnected = useBattleStore((state) => state.setSocketConnected);
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isNativeAuthActive() || isGuestSessionActive();
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthed(isNativeAuthActive() || isGuestSessionActive());
    };

    window.addEventListener("codearena:native-auth-change", handleAuthChange);
    window.addEventListener("codearena:guest-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("codearena:native-auth-change", handleAuthChange);
      window.removeEventListener("codearena:guest-auth-change", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!authed) {
      socketManager.disconnect();
      setSocketConnected(false);
      return;
    }

    const token = getAccessToken() || getGuestToken();
    if (!token) return;

    const socket = socketManager.connect(token);

    const handleConnect = () => {
      if (active) setSocketConnected(true);
    };

    const handleDisconnect = () => {
      if (active) setSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      active = false;
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socketManager.disconnect();
      setSocketConnected(false);
    };
  }, [authed, setSocketConnected]);

  return <>{children}</>;
}
export default SocketProvider;
