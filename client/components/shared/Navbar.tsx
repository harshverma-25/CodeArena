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
    { href: "/dashboard", label: "Arena", icon: Layers },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-mono text-lg font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
              <Shield className="h-4.5 w-4.5 fill-current" />
            </span>
            <span className="tracking-tight text-foreground font-sans text-xl font-black">
              CodeArena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-secondary text-foreground font-semibold" 
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
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
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono border transition-colors",
              isSocketConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                  src={activeUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.username}`}
                  alt={activeUser.displayName || activeUser.username}
                  className="h-9 w-9 rounded-full border border-border object-cover bg-muted"
                />
                <span className="hidden sm:inline-block text-sm font-semibold max-w-[120px] truncate">
                  {activeUser.displayName || activeUser.username}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </Button>
            </div>
          ) : activeUser && isGuest ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="max-w-[110px] truncate">{activeUser.displayName || activeUser.username}</span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.5 bg-amber-500/20 rounded text-amber-400">Guest</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                title="Exit guest mode"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Exit
              </Button>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "h-8 text-xs font-semibold")}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm", className: "font-mono text-xs" })}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "primary", size: "sm", className: "font-mono text-xs font-semibold" })}
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
