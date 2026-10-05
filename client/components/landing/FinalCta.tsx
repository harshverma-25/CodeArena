"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Swords } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function FinalCta() {
  const { data: currentUser } = useCurrentUser();
  const isSignedIn = Boolean(currentUser);

  return (
    <section className="w-full py-24 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-surface p-8 sm:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <Swords className="h-3.5 w-3.5" />
              <span>Challenge Competitors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to test your knowledge against another engineer?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Create a custom room in seconds or share a code with a classmate. Prove your speed, climb the global rankings, and master core computer science.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "font-mono text-xs uppercase tracking-wider justify-center gap-2 h-12 px-6"
                )}
              >
                <span>Enter Arena Hub</span>
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
                  <span>Start a Duel Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/leaderboard"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "font-mono text-xs uppercase tracking-wider justify-center gap-2 h-12 px-6"
                  )}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Rankings</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default FinalCta;
