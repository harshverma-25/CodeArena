"use client";

import React from "react";
import Link from "next/link";
import { Swords } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full bg-background border-t border-border font-mono text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-foreground font-bold tracking-tight">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background">
                <Swords className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-extrabold tracking-tighter">CODEARENA</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm font-sans">
              Real-time competitive 1v1 quiz battles for computer science engineers and students.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Arena Hub
            </Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/history" className="hover:text-foreground transition-colors">
              Battle History
            </Link>
            <Link href="/profile" className="hover:text-foreground transition-colors">
              Profile
            </Link>
            <a href="#demo" className="hover:text-foreground transition-colors">
              Live Demo
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-foreground font-semibold">Real-Time WebSocket Gateway:</span>
            <span>All Systems Operational</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} CodeArena. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
export default LandingFooter;
