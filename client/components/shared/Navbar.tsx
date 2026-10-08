"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBattleStore } from "@/store/battleStore";
import { cn } from "@/lib/utils";
import { Shield, Trophy, Activity, History as HistoryIcon, Layers, User as UserIcon, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getGuestUser, clearGuestSession } from "@/features/auth/guestAuth";
import { clearNativeSession, getNativeUser } from "@/features/auth/nativeAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { User } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const api = useApiClient();
  const { data: currentUser } = useCurrentUser();
  const isSocketConnected = useBattleStore((state) => state.isSocketConnected);

  const [nativeUser, setNativeUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return getNativeUser();
  });

  const [guestUser, setGuestUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return getGuestUser();
  });

  useEffect(() => {
    const handleNativeChange = () => setNativeUser(getNativeUser());
    const handleGuestChange = () => setGuestUser(getGuestUser());

    window.addEventListener("codearena:native-auth-change", handleNativeChange);
    window.addEventListener("codearena:guest-auth-change", handleGuestChange);
    return () => {
      window.removeEventListener("codearena:native-auth-change", handleNativeChange);
      window.removeEventListener("codearena:guest-auth-change", handleGuestChange);
    };
  }, []);

  const activeUser = currentUser || nativeUser || guestUser;
  const isGuest = Boolean(activeUser?.isGuest || (activeUser as any)?.type === "guest");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout errors
    }
    clearNativeSession();
    clearGuestSession();
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Quizzes", icon: Layers, exact: true },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e2d9] bg-[#fff8f0]/90 backdrop-blur-xl shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/images/quizzy-logo.png"
              alt="Quizzy Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="tracking-tight text-[#1d1b16] font-bold text-xl group-hover:text-[#317a63] transition-colors">
              Quizzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#f3ede4] rounded-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 h-8 rounded-full text-xs font-bold transition-all",
                    isActive 
                      ? "bg-[#317a63] text-white shadow-sm" 
                      : "text-[#3f4944] hover:bg-[#e8e2d9]/60 hover:text-[#1d1b16]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Connection State */}
        <div className="flex items-center gap-3">
          {/* Socket Connection Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors",
              isSocketConnected
                ? "bg-[#e8f5ee] text-[#1e6a54] border-[#8cd5ba]/50"
                : "bg-[#fef3c7] text-[#92400e] border-[#fde68a]"
            )}
            title={isSocketConnected ? "Real-time socket server active" : "Connecting to real-time socket server..."}
          >
            <Activity className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">
              {isSocketConnected ? "LIVE" : "SYNC"}
            </span>
          </div>

          {/* Authentication State */}
          {activeUser && !isGuest ? (
            <div className="flex items-center gap-2.5">
              <Link href="/profile" className="flex items-center gap-2 bg-[#ffffff] border border-[#e8e2d9] rounded-full py-1 pl-1 pr-3 shadow-sm hover:border-[#317a63]/50 transition-colors">
                <img
                  src={activeUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.username}`}
                  alt={activeUser.displayName || activeUser.username}
                  className="h-7 w-7 rounded-full border border-[#e8e2d9] object-cover bg-[#f3ede4]"
                />
                <span className="hidden sm:inline-block text-xs font-bold text-[#1d1b16] max-w-[120px] truncate">
                  {activeUser.displayName || activeUser.username}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="h-8 px-2.5 rounded-full text-xs font-bold text-[#9f2b1d] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer inline-flex items-center gap-1"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : activeUser && isGuest ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#fde68a] bg-[#fffbeb] text-[#92400e] text-xs font-semibold shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-pulse" />
                <span className="max-w-[110px] truncate">{activeUser.displayName || activeUser.username}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-[#fde68a] rounded-full text-[#78350f]">Guest</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="h-8 px-2.5 rounded-full text-xs font-bold text-[#9f2b1d] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer inline-flex items-center gap-1"
                title="Exit guest mode"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Exit</span>
              </button>
              <Link
                href="/register"
                className="h-8 px-3.5 rounded-full bg-[#317a63] hover:bg-[#25604e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="h-8 px-3.5 rounded-full text-xs font-bold text-[#1d1b16] hover:bg-[#f3ede4] transition-colors flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="h-8 px-3.5 rounded-full bg-[#317a63] hover:bg-[#25604e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
