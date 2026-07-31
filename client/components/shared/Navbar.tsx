"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useBattleStore } from "@/store/battleStore";
import { cn } from "@/lib/utils";
import { Terminal, Shield, Trophy, Activity, History as HistoryIcon, Layers } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isSocketConnected = useBattleStore((state) => state.isSocketConnected);

  const navLinks = [
    { href: "/dashboard", label: "Arena", icon: Layers },
    { href: "/problems", label: "Problems", icon: Terminal },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/profile", label: "Profile", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
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
                    "flex items-center gap-2 px-3  h-9 rounded-md text-sm font-medium transition-colors hover:text-foreground",
                    isActive 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:bg-secondary/40"
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
        <div className="flex items-center gap-4">
          {/* Socket Connection Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors",
              isSocketConnected
                ? "bg-success/10 text-success border-success/20"
                : "bg-warning/10 text-warning border-warning/20 animate-pulse"
            )}
            title={isSocketConnected ? "Connected to real-time servers" : "Connecting to real-time servers..."}
          >
            <Activity className={cn("h-3 w-3", isSocketConnected && "animate-pulse")} />
            <span className="hidden sm:inline">
              {isSocketConnected ? "Live" : "Connecting"}
            </span>
          </div>

          {/* Clerk Auth Integration */}
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
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "primary", size: "sm" })}
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
