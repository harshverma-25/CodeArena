"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Swords } from "lucide-react";
import { BattleForm } from "@/features/battle";

export default function CreateBattlePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 pb-12">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors font-mono"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl flex items-center gap-2">
          <Swords className="h-8 w-8 text-primary" />
          Create Battle Arena
        </h1>
        <p className="text-muted-foreground text-sm">
          Set up a custom coding room. Choose a problem category, difficulty level, and duration timer, then invite your challenger.
        </p>
      </div>

      {/* Battle Form Card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative color border top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-orange-400" />
        <BattleForm />
      </div>
    </div>
  );
}
