"use client";

import React from "react";
import { MatchHistoryTable } from "@/features/history";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
          Battle History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your past matches, code solutions, and challenge results.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
        <MatchHistoryTable />
      </div>
    </div>
  );
}
