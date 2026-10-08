"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBattleStore } from "@/store/battleStore";
import { cn } from "@/lib/utils";
import {
  Trophy,
  History as HistoryIcon,
  User as UserIcon,
  LogOut,
  Gamepad2,
  ArrowRight,
  Search,
  X,
  Activity,
  Menu,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getGuestUser, clearGuestSession, PlayAsGuestModal } from "@/features/auth";
import { clearNativeSession, getNativeUser } from "@/features/auth/nativeAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { User } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const api = useApiClient();
  const { data: currentUser } = useCurrentUser();
  const isSocketConnected = useBattleStore((state) => state.isSocketConnected);

  const [mounted, setMounted] = useState(false);
  const [nativeUser, setNativeUser] = useState<User | null>(null);
  const [guestUser, setGuestUser] = useState<User | null>(null);

  // UI state
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setNativeUser(getNativeUser());
    setGuestUser(getGuestUser());

    const handleNativeChange = () => setNativeUser(getNativeUser());
    const handleGuestChange = () => setGuestUser(getGuestUser());

    window.addEventListener("codearena:native-auth-change", handleNativeChange);
    window.addEventListener("codearena:guest-auth-change", handleGuestChange);
    return () => {
      window.removeEventListener("codearena:native-auth-change", handleNativeChange);
      window.removeEventListener("codearena:guest-auth-change", handleGuestChange);
    };
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeUser = mounted ? (currentUser || nativeUser || guestUser) : null;
  const isGuest = Boolean(activeUser?.isGuest || (activeUser as any)?.type === "guest");
  const displayName = activeUser
    ? activeUser.displayName || activeUser.username || "Player"
    : "Player";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore errors
    }
    clearNativeSession();
    clearGuestSession();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleJoinPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinValue.trim().toUpperCase();
    if (!cleanPin) return;

    if (cleanPin.length !== 6 || !/^[A-Z0-9]{6}$/.test(cleanPin)) {
      setPinError("PIN must be 6 alphanumeric characters");
      setTimeout(() => setPinError(null), 3000);
      return;
    }

    if (!activeUser) {
      setIsGuestModalOpen(true);
      return;
    }

    setPinError(null);
    router.push(`/lobby/${cleanPin}`);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("quizzy:search", { detail: val }));
    }
    if (pathname !== "/" && val.trim()) {
      router.push(`/?search=${encodeURIComponent(val.trim())}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 w-full border-b border-[#ede7de] bg-[#fff8f0]/95 backdrop-blur-xl shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4">
          
          {/* LEFT: 1. QUIZZY LOGO (IMAGE ONLY, NO TEXT NEXT TO IT) */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity" title="Quizzy Home">
              <img
                src="/images/quizzy-logo.png"
                alt="Quizzy"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>

            {/* 2. DIV WITH: LEADERBOARD, HISTORY, PROFILE (QUIZZES REMOVED) */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-[#f3ede4] rounded-full border border-[#ede7de]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all",
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

          {/* CENTER: 3. JOIN ROOM (PIN INPUT INTERFACE) */}
          <div className="hidden lg:flex items-center justify-center max-w-[320px] flex-1">
            <form
              onSubmit={handleJoinPin}
              className="flex items-center justify-between bg-[#fbf6ee] border border-[#ebd8c5] rounded-full pl-3.5 pr-1.5 py-1.5 shadow-[0_2px_6px_-2px_rgba(60,52,42,0.04)]"
            >
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <Gamepad2 className="w-4 h-4 text-[#d97706] shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#92400e] leading-none uppercase tracking-wider font-bold">
                    Join Room
                  </span>
                  <span className="text-[11px] text-[#1d1b16] leading-tight font-semibold">
                    Enter PIN
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  className={cn(
                    "w-20 px-2 py-0.5 bg-white rounded-full text-xs text-[#1d1b16] placeholder:text-[#9e9587] text-center tracking-wider focus:outline-none focus:ring-2 shadow-inner border uppercase font-bold transition-all",
                    pinError
                      ? "border-red-500 focus:ring-red-400 text-red-600 bg-red-50"
                      : "border-[#ede7de] focus:ring-[#317a63]"
                  )}
                  maxLength={6}
                  placeholder="123 456"
                  type="text"
                  value={pinValue}
                  onChange={(e) => {
                    setPinValue(e.target.value);
                    if (pinError) setPinError(null);
                  }}
                  title={pinError || "Enter 6-character room PIN"}
                />
                <button
                  aria-label="Join Room by PIN"
                  className="h-7 w-7 rounded-full bg-[#317a63] hover:bg-[#25604e] text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                  type="submit"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: 4. SEARCH & 5. PROFILE SECTION */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Socket Status Dot */}
            <div
              className={cn(
                "hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border",
                isSocketConnected
                  ? "bg-[#e8f5ee] text-[#1e6a54] border-[#8cd5ba]/50"
                  : "bg-[#fef3c7] text-[#92400e] border-[#fde68a]"
              )}
              title={isSocketConnected ? "Real-time socket connected" : "Syncing with real-time socket..."}
            >
              <Activity className="h-2.5 w-2.5 shrink-0" />
              <span>{isSocketConnected ? "LIVE" : "SYNC"}</span>
            </div>

            {/* 4. SEARCH BUTTON / EXPANDABLE INPUT */}
            {isSearchActive ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-1.5 bg-white border border-[#317a63]/50 rounded-full px-3 py-1 shadow-sm transition-all animate-in fade-in duration-150"
              >
                <Search className="w-3.5 h-3.5 text-[#317a63] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search quizzes..."
                  className="w-28 sm:w-40 bg-transparent text-xs text-[#1d1b16] focus:outline-none font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    handleSearchChange("");
                    setIsSearchActive(false);
                  }}
                  className="text-[#7d7568] hover:text-[#1d1b16] cursor-pointer p-0.5"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                aria-label="Search quizzes"
                onClick={() => setIsSearchActive(true)}
                className="h-9 w-9 rounded-full bg-white border border-[#ede7de] flex items-center justify-center text-[#7d7568] hover:text-[#1d1b16] hover:border-[#317a63]/40 transition-colors cursor-pointer shadow-sm"
                type="button"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* 5. PROFILE SECTION (DROPDOWN / AUTH BUTTONS) */}
            <div className="relative" ref={profileMenuRef}>
              {!mounted ? (
                <div className="h-9 w-20 rounded-full bg-[#f3ede4] animate-pulse" />
              ) : activeUser ? (
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-[#ede7de] rounded-full shadow-sm cursor-pointer hover:border-[#317a63]/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#317a63] flex items-center justify-center overflow-hidden">
                    {activeUser.avatar ? (
                      <img
                        src={activeUser.avatar}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-xs text-[#1d1b16] leading-none font-bold truncate max-w-[110px]">
                      {displayName}
                    </span>
                    {isGuest && (
                      <span className="text-[9px] text-[#d97706] font-extrabold uppercase tracking-wider mt-0.5">
                        Guest
                      </span>
                    )}
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGuestModalOpen(true)}
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-bold text-[#7d7568] hover:text-[#1d1b16] hover:bg-[#f3ede4] transition-colors cursor-pointer"
                  >
                    Guest
                  </button>
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1d1b16] hover:bg-[#f3ede4] transition-colors flex items-center justify-center border border-[#ede7de]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 rounded-full bg-[#317a63] hover:bg-[#25604e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Profile Dropdown Popover */}
              {isProfileMenuOpen && activeUser && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#ede7de] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#ede7de]">
                    <p className="text-xs font-bold text-[#1d1b16] truncate">{displayName}</p>
                    <p className="text-[11px] text-[#7d7568] truncate">
                      {!isGuest ? activeUser.email || "Registered Player" : "Temporary Guest Session"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1d1b16] hover:bg-[#f9f3ea] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#317a63]" />
                      My Profile
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1d1b16] hover:bg-[#f9f3ea] transition-colors"
                    >
                      <HistoryIcon className="w-4 h-4 text-[#317a63]" />
                      Match History
                    </Link>
                    <Link
                      href="/leaderboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1d1b16] hover:bg-[#f9f3ea] transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-[#317a63]" />
                      Leaderboard
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[#ede7de]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#9f2b1d] hover:bg-[#ffdad6]/40 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {isGuest ? "Exit Guest Mode" : "Log Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full bg-white border border-[#ede7de] flex items-center justify-center text-[#1d1b16] hover:bg-[#f3ede4] transition-colors shadow-sm cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#ede7de] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1 mb-3">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                            isActive
                              ? "bg-[#317a63] text-white"
                              : "text-[#1d1b16] hover:bg-[#f9f3ea]"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile PIN Form */}
                  <form onSubmit={handleJoinPin} className="p-2 bg-[#f9f3ea] rounded-xl mb-2">
                    <span className="text-[10px] font-bold text-[#92400e] uppercase tracking-wider block mb-1">
                      Join Room by PIN
                    </span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123 456"
                        value={pinValue}
                        onChange={(e) => {
                          setPinValue(e.target.value);
                          if (pinError) setPinError(null);
                        }}
                        className={cn(
                          "w-full px-2 py-1 bg-white rounded-lg text-xs font-bold text-center tracking-wider uppercase border focus:outline-none transition-all",
                          pinError
                            ? "border-red-500 focus:border-red-500 text-red-600 bg-red-50"
                            : "border-[#ede7de] focus:border-[#317a63]"
                        )}
                      />
                      <button
                        type="submit"
                        className="px-3 bg-[#317a63] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Join
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Guest Authentication Modal integration */}
      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
