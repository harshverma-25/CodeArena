"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Plus, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { JoinBattleModal } from "./JoinBattleModal";
import { CreateBattleModal } from "./CreateBattleModal";

export function QuickActions() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
              <CardTitle className="text-xl font-bold text-foreground">Create Quiz</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Configure a custom room, select a subject, invite friends, and play.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className={buttonVariants({ variant: "primary", className: "w-full cursor-pointer font-mono text-xs" })}
            >
              Start Quiz Room
            </button>
          </CardContent>
        </Card>

        {/* Join Battle Card */}
        <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 blur-xl pointer-events-none" />
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Join Room</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Have a code? Enter it to join a live quiz lobby with friends.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <button
              onClick={() => setIsJoinOpen(true)}
              className={buttonVariants({ variant: "secondary", className: "w-full cursor-pointer border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors font-mono text-xs" })}
            >
              Enter Room Code
            </button>
          </CardContent>
        </Card>

        {/* Leaderboard Card */}
        <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 blur-xl pointer-events-none" />
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Leaderboard</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Check global player rankings, track top scores, and see where you stand.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Link
              href="/leaderboard"
              className={buttonVariants({ variant: "ghost", className: "w-full cursor-pointer border border-border bg-transparent hover:bg-secondary/40 text-foreground transition-colors font-mono text-xs" })}
            >
              View Leaderboard
            </Link>
          </CardContent>
        </Card>
      </div>

      <JoinBattleModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <CreateBattleModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
export default QuickActions;
