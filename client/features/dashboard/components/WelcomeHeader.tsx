"use client";

import React from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Terminal } from "lucide-react";

export function WelcomeHeader() {
  const { data: user } = useCurrentUser();

  // Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.displayName || user?.username || "Challenger";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Terminal className="h-3.5 w-3.5" />
            Arena Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {getGreeting()}, <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">{displayName}</span>!
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Welcome to the CodeArena dashboard. Face off against other engineers, test your algorithmic speed, and claim your place on the leaderboard.
          </p>
        </div>

        {/* Dynamic quote or simple stats summary */}
        <div className="flex items-center gap-4 rounded-xl bg-background/50 border border-border p-4 backdrop-blur-sm self-start md:self-auto font-mono text-xs text-muted-foreground">
          <div>
            <span className="text-primary font-bold">STREAK: </span>
            <span>{user?.highestWinStreak || 0} Wins max</span>
          </div>
          <div className="h-4 w-[1px] bg-border" />
          <div>
            <span className="text-success font-bold">LANG: </span>
            <span className="capitalize">{user?.preferredLanguage || "JavaScript"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WelcomeHeader;
