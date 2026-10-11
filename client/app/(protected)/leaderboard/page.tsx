"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#FAF7EE] border-[2.5px] border-black rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
              <Trophy className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Global Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-bold text-stone-600 pl-0 sm:pl-[50px]">
            Rankings of competitive quiz contenders based on wins, battles, and accuracy.
          </p>
        </div>
        <div className="sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A7F3D0] border-2 border-black text-black font-black text-xs shadow-[2px_2px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Live Rankings
          </span>
        </div>
      </div>

      <LeaderboardTable />
    </div>
  );
}
