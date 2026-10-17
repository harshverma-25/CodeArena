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
  const [pendingPin, setPendingPin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

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

  // Resume pending room join after guest login
  useEffect(() => {
    if (activeUser && pendingPin) {
      const pin = pendingPin;
      setPendingPin(null);
      router.push(`/lobby/${pin}`);
    }
  }, [activeUser, pendingPin, router]);

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
      setPendingPin(cleanPin);
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
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 w-full border-b-[2.5px] border-black bg-[#FAF7EE] shadow-[0_3px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-3 sm:px-6 lg:px-8 xl:px-12 gap-2 sm:gap-4">
          
          {/* LEFT: QUIZZY LOGO & NAVIGATION PILL */}
          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            {/* Logo matching arcade aesthetic */}
            <Link href="/" className="flex items-center hover:scale-105 transition-transform" title="Quizzy Home">
              <div className="relative flex items-center">
                <Image
                  src="/quizzy-wordmark.svg"
                  alt="Quizzy"
                  width={132}
                  height={44}
                  priority
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </div>
            </Link>

            {/* NAV LINKS PILL: Home, Leaderboard, History, Profile (Desktop Only) */}
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

          {/* RIGHT: SEARCH & USER PROFILE / AUTH & MOBILE CONTROLS */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* DESKTOP INLINE SEARCH INPUT FIELD */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex items-center gap-2 bg-[#FFFDF5] border-2 border-black rounded-full px-3 py-1.5 shadow-[2px_2px_0px_#000] focus-within:ring-2 focus-within:ring-[#FFE600] transition-all"
            >
              <Search className="w-3.5 h-3.5 text-stone-700 shrink-0 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search quizzes..."
                className="w-28 sm:w-44 md:w-56 bg-transparent text-xs text-black placeholder:text-stone-400 focus:outline-none font-bold"
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

            {/* MOBILE SEARCH TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((prev) => !prev);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                if (isProfileMenuOpen) setIsProfileMenuOpen(false);
              }}
              className={cn(
                "sm:hidden h-8 w-8 rounded-full border-2 border-black flex items-center justify-center transition-all shadow-[2px_2px_0px_#000] cursor-pointer",
                isMobileSearchOpen ? "bg-[#FFE600] text-black" : "bg-white text-stone-800 hover:bg-stone-100"
              )}
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? (
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>

            {/* PROFILE SECTION / AUTH CONTROLS */}
            <div className="relative" ref={profileMenuRef}>
              {!mounted ? (
                <div className="h-8 w-8 sm:h-9 sm:w-24 rounded-full bg-stone-200 border-2 border-black animate-pulse" />
              ) : activeUser ? (
                <>
                  {/* Desktop Profile Pill */}
                  <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center bg-[#F4EFE6] border-2 border-black rounded-full p-0.5 shadow-[2px_2px_0px_#000]">
                      <button
                        type="button"
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-white border border-stone-200 rounded-full hover:bg-stone-50 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#8B5CF6] border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
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

                  {/* Mobile Profile Avatar Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen((prev) => !prev);
                      if (isMobileSearchOpen) setIsMobileSearchOpen(false);
                    }}
                    className="sm:hidden h-8 w-8 rounded-full bg-[#8B5CF6] border-2 border-black flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_#000] cursor-pointer"
                    aria-label="User Profile"
                  >
                    {activeUser.avatar ? (
                      <img
                        src={activeUser.avatar}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-white" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Desktop Guest / Log In / Sign Up */}
                  <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
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

                    <Link
                      href="/register"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#FACC15] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0"
                    >
                      <span>Sign Up</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  </div>

                  {/* Mobile Login Button */}
                  <Link
                    href="/login"
                    className="sm:hidden px-2.5 py-1 rounded-full text-xs font-black bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0"
                  >
                    Login
                  </Link>
                </>
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
                onClick={() => {
                  setIsMobileMenuOpen((prev) => !prev);
                  if (isMobileSearchOpen) setIsMobileSearchOpen(false);
                  if (isProfileMenuOpen) setIsProfileMenuOpen(false);
                }}
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-black flex items-center justify-center transition-all shadow-[2px_2px_0px_#000] cursor-pointer",
                  isMobileMenuOpen ? "bg-[#FFE600] text-black" : "bg-white text-stone-800 hover:bg-stone-100"
                )}
                aria-label="Open mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Menu className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>

              {isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />

                  {/* Dropdown Menu Container */}
                  <div className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-72 rounded-2xl bg-[#FAF7EE] border-2 border-black shadow-[4px_4px_0px_#000] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-80px)] overflow-y-auto">
                    {/* Active User Card (if logged in) */}
                    {activeUser && (
                      <div className="flex items-center gap-2.5 p-2 bg-white border-2 border-black rounded-xl mb-3 shadow-[2px_2px_0px_#000]">
                        <div className="w-9 h-9 rounded-full bg-[#8B5CF6] border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                          {activeUser.avatar ? (
                            <img
                              src={activeUser.avatar}
                              alt={displayName}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-black truncate">{displayName}</p>
                          <span
                            className={cn(
                              "inline-block px-1.5 py-0.5 text-[9px] font-black uppercase rounded tracking-wider mt-0.5",
                              isGuest
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            )}
                          >
                            {isGuest ? "Guest Mode" : "Online"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Navigation Links */}
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
                    <form onSubmit={handleJoinPin} className="p-2.5 bg-white border-2 border-black rounded-xl mb-3 shadow-[2px_2px_0px_#000]">
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

                    {/* Auth Actions */}
                    {!activeUser ? (
                      <div className="pt-2 border-t-2 border-stone-200 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsGuestModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black bg-stone-100 text-stone-900 border-2 border-black hover:bg-stone-200 transition-colors shadow-[1px_1px_0px_#000] cursor-pointer"
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
                    ) : (
                      <div className="pt-2 border-t-2 border-stone-200 space-y-1.5">
                        {isGuest && (
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                          >
                            Log In to Save Progress
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black text-red-600 bg-red-50 border-2 border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {isGuest ? "Exit Guest Mode" : "Log Out"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* MOBILE SLIDE-DOWN SEARCH BAR */}
        {isMobileSearchOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 border-b-2 border-black bg-[#FAF7EE] px-3 py-2 shadow-[0_4px_0px_rgba(0,0,0,0.08)] z-40 animate-in slide-in-from-top-1 duration-150">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-[#FFFDF5] border-2 border-black rounded-full px-3 py-1.5 shadow-[2px_2px_0px_#000] focus-within:ring-2 focus-within:ring-[#FFE600]"
            >
              <Search className="w-3.5 h-3.5 text-stone-700 shrink-0 stroke-[2.5]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search quizzes, categories..."
                className="w-full bg-transparent text-xs text-black placeholder:text-stone-400 focus:outline-none font-bold"
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
          </div>
        )}
      </header>

      {/* Guest Authentication Modal integration */}
      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSuccess={() => {
          setIsGuestModalOpen(false);
          setGuestUser(getGuestUser());
        }}
      />
    </>
  );
}

export default Navbar;
