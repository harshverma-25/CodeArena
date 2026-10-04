"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ArrowUpRight, Menu, X, Swords } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#demo", label: "Interactive Demo" },
    { href: "#protocol", label: "How It Works" },
    { href: "#curriculum", label: "Curriculum" },
    { href: "#architecture", label: "Anti-Cheat" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-mono text-base font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
              <Swords className="h-4 w-4" />
            </span>
            <span className="tracking-tighter font-extrabold text-lg">CODEARENA</span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-surface">
              1v1 MCQ
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User / Auth Operations */}
        <div className="hidden sm:flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "font-mono text-xs uppercase tracking-wider gap-1.5"
                )}
              >
                <span>Enter Arena</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 rounded-md border border-border",
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                )}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "font-mono text-xs uppercase tracking-wider gap-1"
                )}
              >
                <span>Start Battling</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          {isSignedIn && (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "font-mono text-xs uppercase tracking-wider"
              )}
            >
              Arena
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-elevated transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-surface px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 font-mono text-xs uppercase tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "w-full justify-center font-mono text-xs uppercase tracking-wider"
                )}
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "flex-1 justify-center font-mono text-xs uppercase tracking-wider"
                  )}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "sm" }),
                    "flex-1 justify-center font-mono text-xs uppercase tracking-wider"
                  )}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
export default LandingNavbar;
