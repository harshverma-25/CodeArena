"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Shield, Swords, Terminal, Cpu, Trophy, CheckCircle2, Lock, Zap, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveBattlePreview } from "./components/InteractiveBattlePreview";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* ---------------------------------------------------------------- border grid container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">

        {/* ---------------------------------------------------------------- SECTION 1: HERO */}
        <section className="space-y-12">
          {/* Top Status Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-card text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>CODEARENA ARENA ENGINE V2.0</span>
            <span className="text-border">|</span>
            <span className="text-foreground font-semibold uppercase">1v1 Real-Time MCQ Battles</span>
          </div>

          {/* Main Hero Header & CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-foreground font-sans uppercase">
                1v1 Real-Time <br />
                <span className="text-muted-foreground">MCQ Battles.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-sans">
                Challenge fellow developers in synchronized, timed technical duels. 
                10 questions. 30 seconds per round. Immediate answer verification and global rank updates.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "primary" }),
                      "group font-mono text-xs font-bold uppercase tracking-wider px-6 h-12"
                    )}
                  >
                    Enter Arena{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className={cn(
                        buttonVariants({ size: "lg", variant: "primary" }),
                        "group font-mono text-xs font-bold uppercase tracking-wider px-6 h-12"
                      )}
                    >
                      Start Battling{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ size: "lg", variant: "outline" }),
                        "font-mono text-xs font-semibold px-6 h-12 border-border hover:bg-secondary/60"
                      )}
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>

              {/* System Console Command Pill */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-secondary/60 border border-border font-mono text-xs text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5 text-foreground shrink-0" />
                  <span>$ codearena matchmake --topic=all --mode=1v1</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Battle Preview Card */}
            <div className="lg:col-span-5">
              <InteractiveBattlePreview />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- SECTION 2: HOW IT WORKS */}
        <section className="space-y-8 border-t border-border pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                01 // MATCH PROTOCOL
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight uppercase mt-1">
                How CodeArena Works
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground max-w-xs">
              Synchronized 1v1 execution loop from room creation to rank verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-foreground">01</span>
                <span className="px-2 py-0.5 rounded bg-secondary border border-border font-mono text-[10px] text-muted-foreground uppercase">
                  SETUP
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Host or Join Lobby</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create a custom battle room or enter via a 6-digit room code. Select CS topics (Data Structures, Algorithms, JS, DBMS) and difficulty levels.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-foreground">02</span>
                <span className="px-2 py-0.5 rounded bg-secondary border border-border font-mono text-[10px] text-muted-foreground uppercase">
                  DUEL
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Timed 1v1 MCQ Battle</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Answer synchronized multiple-choice questions side-by-side with your challenger. 30 seconds per round. Faster correct answers yield higher points.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-foreground">03</span>
                <span className="px-2 py-0.5 rounded bg-secondary border border-border font-mono text-[10px] text-muted-foreground uppercase">
                  VERDICT
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Detailed Breakdown & Rank</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review question-by-question explanations immediately post-match. Track your win rate, highest win streaks, and global leaderboard rank.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- SECTION 3: TOPICS CURRICULUM */}
        <section className="space-y-8 border-t border-border pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                02 // CURRICULUM
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight uppercase mt-1">
                Core Technical Domains
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground max-w-xs">
              High-yield question banks engineered for technical interviews & computer science exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground border border-border">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Data Structures & Algorithms</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Big-O complexity, binary search trees, graphs, dynamic programming, sorting, and recursion.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground border border-border">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">JavaScript & Web Runtimes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Event loop, closures, prototypes, async execution, promises, and engine execution contexts.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground border border-border">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Database Management (DBMS)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SQL query optimization, indexing, B-trees, ACID properties, transactions, and normalization.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground border border-border">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Systems & Computer Networking</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Memory management, process synchronization, threads, deadlock resolution, and TCP/IP stack.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- SECTION 4: ENGINE INTEGRITY */}
        <section className="space-y-8 border-t border-border pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                03 // ENGINE ARCHITECTURE
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight uppercase mt-1">
                Built for Competitive Integrity
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                <h3 className="text-base font-bold text-foreground">Server-Authoritative Clock</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Round timers are calculated and validated strictly on the server to ensure zero clock manipulation or client latency tampering.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-foreground" />
                <h3 className="text-base font-bold text-foreground">Blind Stream Delivery</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Question payloads are delivered sequentially round-by-round. Future questions and answers are never pre-fetched on the client.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-foreground" />
                <h3 className="text-base font-bold text-foreground">Real-Time Opponent Telemetry</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Socket.IO state sync streams opponent progression status, score ticks, and readiness states instantly without page refreshes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-foreground" />
                <h3 className="text-base font-bold text-foreground">Persistent Player Analytics</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every battle result records individual answer selections, accuracy percentage, time spent per question, and rank updates.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- SECTION 5: CALL TO ACTION */}
        <section className="p-8 sm:p-12 rounded-xl border border-border bg-card text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight font-sans">
              Ready for Your First Match?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-sans">
              Enter room codes, challenge challengers 1v1, and claim your spot on the global leaderboard.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg", variant: "primary" }),
                  "font-mono text-xs font-bold uppercase tracking-wider px-8 h-12"
                )}
              >
                Go to Dashboard Arena
              </Link>
            ) : (
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg", variant: "primary" }),
                  "font-mono text-xs font-bold uppercase tracking-wider px-8 h-12"
                )}
              >
                Create Account & Battle
              </Link>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- SECTION 6: FOOTER */}
        <footer className="border-t border-border pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background">
              <Shield className="h-3.5 w-3.5 fill-current" />
            </span>
            <span>CodeArena</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Arena
            </Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/history" className="hover:text-foreground transition-colors">
              History
            </Link>
            <Link href="/profile" className="hover:text-foreground transition-colors">
              Profile
            </Link>
          </div>

          <div>
            <span>© {new Date().getFullYear()} CodeArena. All rights reserved.</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
