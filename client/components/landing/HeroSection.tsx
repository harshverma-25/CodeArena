"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function HeroSection() {
  const { data: currentUser } = useCurrentUser();
  const isSignedIn = Boolean(currentUser);

  return (
    <section className="relative w-full border-b border-border bg-background pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-surface font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span>Engine v2.4 // Real-Time 1v1 MCQ Arena</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.08] sm:leading-[1.06]">
              Two engineers.
              <br />
              Ten technical MCQs.
              <br />
              <span className="text-muted-foreground">Thirty seconds on the clock.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              CodeArena is a live, competitive battleground where developers duel in real time. 
              Synchronized question timers, server-authoritative scoring, and instant solution breakdowns across core computer science subjects.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                    "font-mono text-xs uppercase tracking-wider justify-center gap-2 h-12 px-6"
                  )}
                >
                  <span>Launch Arena Hub</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant: "primary", size: "lg" }),
                      "font-mono text-xs uppercase tracking-wider justify-center gap-2 h-12 px-6"
                    )}
                  >
                    <span>Start Battling Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "font-mono text-xs uppercase tracking-wider justify-center h-12 px-6"
                    )}
                  >
                    <span>Sign In</span>
                  </Link>
                </>
              )}

              <a
                href="#demo"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "font-mono text-xs uppercase tracking-wider justify-center text-muted-foreground hover:text-foreground h-12 px-5"
                )}
              >
                <span>Try Demo Below</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border font-mono text-xs">
              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Clock</div>
                <div className="font-bold text-foreground">Server-Synced</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Delivery</div>
                <div className="font-bold text-foreground">Blind Payloads</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Scoring</div>
                <div className="font-bold text-foreground">Velocity Bonus</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Dissection</div>
                <div className="font-bold text-foreground">Instant Proofs</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="ml-2 text-foreground font-semibold">arena_gateway.sh</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase">WS_PORT: 5000</span>
              </div>

              <div className="p-5 font-mono text-xs text-foreground space-y-3 leading-relaxed">
                <div className="text-muted-foreground">
                  $ codearena duel --room CA-8492 --mode 1v1
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground/80">
                    [00:00.01] Initializing WebSocket handshake... <span className="text-emerald-400 font-bold">CONNECTED</span>
                  </p>
                  <p className="text-muted-foreground/80">
                    [00:00.04] Allocating duel instance in room <span className="text-foreground font-bold">CA-8492</span>
                  </p>
                  <p className="text-muted-foreground/80">
                    [00:01.12] Challenger matched: <span className="text-foreground font-bold">@sarah.ts</span> (Rating: 1460)
                  </p>
                  <p className="text-muted-foreground/80">
                    [00:01.40] Curriculum: <span className="text-foreground font-bold">Algorithms // AVL Trees</span>
                  </p>
                  <p className="text-muted-foreground/80">
                    [00:02.00] Blind questions verified. Synchronizing countdown timer: <span className="text-foreground font-bold">30.0s</span>
                  </p>
                </div>

                <div className="mt-4 p-3 rounded border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-foreground">ROUND 01 // IN PROGRESS</span>
                    <span className="text-emerald-400">00:24 REMAINING</span>
                  </div>
                  <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-foreground w-4/5" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>YOU: 320 PTS (LOCKED)</span>
                    <span>OPPONENT: 280 PTS</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Real-time channel active. Zero packet loss detected.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
