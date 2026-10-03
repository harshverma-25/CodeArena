"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useBattleStore } from "@/store/battleStore";
import { cn } from "@/lib/utils";
import { Shield, Trophy, Activity, History as HistoryIcon, Layers, User as UserIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isSocketConnected = useBattleStore((state) => state.isSocketConnected);

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

          {/* Auth Actions */}
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 rounded-md border border-border hover:opacity-90 transition-opacity",
                  },
                }}
              />
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
