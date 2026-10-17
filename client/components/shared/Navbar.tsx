"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  ChevronDown,
  Home as HomeIcon,
  ShieldCheck,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getGuestUser, clearGuestSession, PlayAsGuestModal, isGuestSessionActive } from "@/features/auth";
import { clearNativeSession, getNativeUser, isNativeAuthActive } from "@/features/auth/nativeAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { User } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

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

  const hasAuth = Boolean(nativeUser || guestUser || isNativeAuthActive() || isGuestSessionActive());
  const activeUser = mounted && hasAuth ? (currentUser || nativeUser || guestUser) : null;
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
    queryClient.clear();
    setNativeUser(null);
    setGuestUser(null);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
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
    { href: "/", label: "Home", icon: HomeIcon, isHome: true },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 w-full border-b-[2.5px] border-black bg-[#FAF7EE] shadow-[0_3px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-3 sm:px-6 lg:px-8 xl:px-12 gap-2 sm:gap-4">
          
          {/* LEFT: QUIZZY LOGO & NAVIGATION PILL */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Logo matching screenshot arcade aesthetic */}
            <Link href="/" className="flex items-center hover:scale-105 transition-transform" title="Quizzy Home">
              <div className="relative flex items-center">
                <Image
                  src="/quizzy-wordmark.svg"
                  alt="Quizzy"
                  width={132}
                  height={44}
                  priority
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
            </Link>

            {/* NAV LINKS PILL: Home, Leaderboard, History, Profile */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#F4EFE6] rounded-full border-2 border-black shadow-[2px_2px_0px_#000]">
              {navLinks.map((link) => {
                const isHome = link.isHome;
                const isActive = isHome ? pathname === "/" : pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/");
                
                if (isHome && isActive) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      <HomeIcon className="h-3.5 w-3.5 fill-black stroke-black" />
                      Home
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all",
                      isActive
                        ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        : "text-stone-800 hover:text-black hover:bg-stone-200/60"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: INLINE SEARCH & USER PROFILE / AUTH */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* INLINE SEARCH INPUT FIELD */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-[#FFFDF5] border-2 border-black rounded-full px-3 py-1.5 shadow-[2px_2px_0px_#000] focus-within:ring-2 focus-within:ring-[#FFE600] transition-all"
            >
              <Search className="w-3.5 h-3.5 text-stone-700 shrink-0 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search quizzes..."
                className="w-24 xs:w-32 sm:w-44 md:w-56 bg-transparent text-xs text-black placeholder:text-stone-400 focus:outline-none font-bold"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="text-stone-400 hover:text-black cursor-pointer p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </form>

            {/* PROFILE SECTION / UNIFIED AUTH CONTROLS */}
            <div className="relative" ref={profileMenuRef}>
              {!mounted ? (
                <div className="h-9 w-24 rounded-full bg-stone-200 border-2 border-black animate-pulse" />
              ) : activeUser ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center bg-[#F4EFE6] border-2 border-black rounded-full p-0.5 shadow-[2px_2px_0px_#000]">
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-white border border-stone-200 rounded-full hover:bg-stone-50 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#8B5CF6] border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {activeUser.avatar ? (
                          <img
                            src={activeUser.avatar}
                            alt={displayName}
                            width={28}
                            height={28}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-black leading-none font-black truncate max-w-[80px] sm:max-w-[110px]">
                          {displayName}
                        </span>
                        <span className="text-[9px] text-[#DC2626] font-black uppercase tracking-wider leading-none mt-0.5">
                          {isGuest ? "GUEST" : "ONLINE"}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-700 stroke-[2.5]" />
                    </button>

                    {isGuest && (
                      <>
                        <div className="w-[1.5px] h-3.5 bg-stone-300 mx-1" />
                        <Link
                          href="/login"
                          className="px-3 py-1 rounded-full text-xs font-black bg-[#FFE600] text-black border border-black hover:bg-[#FACC15] shadow-[1px_1px_0px_#000] transition-all"
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Subtle Guest / Log In Capsule with Login button inside */}
                  <div className="flex items-center bg-[#F4EFE6] border-2 border-black rounded-full p-0.5 shadow-[2px_2px_0px_#000]">
                    <button
                      type="button"
                      onClick={() => setIsGuestModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-stone-700 hover:text-black hover:bg-white/90 transition-all cursor-pointer"
                      title="Play as Guest without creating an account"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-stone-600 stroke-[2.5]" />
                      <span>Guest</span>
                    </button>
                    <div className="w-[1.5px] h-3.5 bg-stone-300 mx-0.5" />
                    <Link
                      href="/login"
                      className="px-3 py-1 rounded-full text-xs font-black bg-white text-stone-900 border border-stone-300 hover:border-black hover:bg-stone-50 shadow-[1px_1px_0px_rgba(0,0,0,0.08)] transition-all"
                    >
                      Login
                    </Link>
                  </div>

                  {/* Primary High-Impact Sign Up CTA Button */}
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#FACC15] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0"
                  >
                    <span>Sign Up</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              )}

              {/* Profile Dropdown Popover */}
              {isProfileMenuOpen && activeUser && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] py-2 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b-2 border-stone-200">
                    <p className="text-xs font-black text-black truncate">{displayName}</p>
                    <p className="text-[10px] text-stone-500 font-bold truncate">
                      {!isGuest ? activeUser.email || "Registered Player" : "Guest Mode"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-black hover:bg-[#FFE600]/30 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-black" />
                      My Profile
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-black hover:bg-[#FFE600]/30 transition-colors"
                    >
                      <HistoryIcon className="w-4 h-4 text-black" />
                      Match History
                    </Link>
                    <Link
                      href="/leaderboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-black hover:bg-[#FFE600]/30 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-black" />
                      Leaderboard
                    </Link>
                    {activeUser.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-black text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors border-t border-b border-amber-200"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700 stroke-[2.5]" />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t-2 border-stone-200">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {isGuest ? "Exit Guest Mode" : "Log Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="lg:hidden relative" ref={mobileMenuRef}>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-stone-100 transition-colors shadow-[2px_2px_0px_#000] cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-4 h-4 stroke-[2.5]" />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FAF7EE] border-2 border-black shadow-[4px_4px_0px_#000] p-3 z-50 animate-in fade-in duration-100">
                  <div className="space-y-1.5 mb-3">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = link.isHome ? pathname === "/" : pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black border-2 transition-all",
                            isActive
                              ? "bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]"
                              : "text-black border-transparent hover:border-black hover:bg-white"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                    {activeUser?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black border-2 bg-amber-300 text-black border-black shadow-[2px_2px_0px_#000]"
                      >
                        <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  {/* Mobile PIN Form */}
                  <form onSubmit={handleJoinPin} className="p-2.5 bg-white border-2 border-black rounded-xl mb-2 shadow-[2px_2px_0px_#000]">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-1">
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
                          "w-full px-2 py-1 bg-stone-50 rounded-lg text-xs font-black text-center tracking-wider uppercase border-2 focus:outline-none transition-all",
                          pinError
                            ? "border-red-500 text-red-600 bg-red-50"
                            : "border-black focus:border-amber-600"
                        )}
                      />
                      <button
                        type="submit"
                        className="px-3 bg-[#0D9488] text-white rounded-lg text-xs font-black border-2 border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                      >
                        Join
                      </button>
                    </div>
                  </form>

                  {/* Mobile Auth Actions when unauthenticated */}
                  {!activeUser && (
                    <div className="pt-2 border-t-2 border-stone-200 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsGuestModalOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black bg-stone-100 text-stone-900 border-2 border-black hover:bg-stone-200 transition-colors shadow-[1px_1px_0px_#000]"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        Play as Guest
                      </button>
                      <div className="flex gap-2">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex-1 text-center py-2 rounded-xl text-xs font-black bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        >
                          Log In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex-1 text-center py-2 rounded-xl text-xs font-black bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )}
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
