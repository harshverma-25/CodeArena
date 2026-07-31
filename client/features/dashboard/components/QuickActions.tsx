"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Swords, Plus, PlayCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { JoinBattleModal } from "./JoinBattleModal";

export function QuickActions() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Battle Card */}
        <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 blur-xl pointer-events-none" />
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Create Battle</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Configure a custom room, set rules, invite a challenger, and compete.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Link
              href="/battle/new"
              className={buttonVariants({ variant: "primary", className: "w-full cursor-pointer" })}
            >
              Start Battle Room
            </Link>
          </CardContent>
        </Card>

        {/* Join Battle Card */}
        <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 blur-xl pointer-events-none" />
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Join Battle</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Have a code? Type it in to enter a live lobby and start coding.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <button
              onClick={() => setIsJoinOpen(true)}
              className={buttonVariants({ variant: "secondary", className: "w-full cursor-pointer border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors" })}
            >
              Enter Room Code
            </button>
          </CardContent>
        </Card>

        {/* Practice Card */}
        <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 blur-xl pointer-events-none" />
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Practice Mode</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Solve problems at your own pace without pressure or time limits.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Link
              href="/problems"
              className={buttonVariants({ variant: "ghost", className: "w-full cursor-pointer border border-border bg-transparent hover:bg-secondary/40 text-foreground transition-colors" })}
            >
              Browse Problems
            </Link>
          </CardContent>
        </Card>
      </div>

      <JoinBattleModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </>
  );
}
export default QuickActions;
