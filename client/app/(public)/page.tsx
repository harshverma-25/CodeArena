"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Terminal, Trophy, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Background glow effects */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-orange-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          {/* Version badge */}
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <span className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/20">
              <span>CodeArena v0.1</span>
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-sans">
            Prove your speed.
            <span className="block bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Dominate the Arena.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A real-time competitive coding platform where you duel 1v1 against other developers. 
            Solve algorithmic challenges, optimize your solutions, and climb the leaderboard.
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "lg", variant: "primary" }), "group")}
              >
                Enter Arena{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "lg", variant: "primary" }), "group")}
                >
                  Start Coding{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({ size: "lg", variant: "ghost" })}
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[32rem]">
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Real-Time Duels</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Match against challengers instantly. See progress, compilation states, and pass rates in real time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Monaco Editor</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A premium, customizable coding interface featuring auto-completion, multi-language support, and dark mode.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Secure Judge</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Isolated, secure execution environment for evaluating solutions against edge cases instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Rankings</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Win battles to improve your rank, build your profile, and showcase your competition statistics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-orange-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
