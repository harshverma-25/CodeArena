"use client";

import React from "react";
import { Trophy, Percent, Terminal, Flame, Swords } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function StatsOverview() {
  const { stats, isLoading } = useDashboardStats();

  const statsItems = [
    {
      label: "Battles Played",
      value: stats.matchesPlayed,
      icon: Swords,
      colorClass: "text-purple-500",
      bgClass: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Wins",
      value: stats.wins,
      icon: Trophy,
      colorClass: "text-orange-500",
      bgClass: "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Win Rate",
      value: `${stats.winRate}%`,
      icon: Percent,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Problems Solved",
      value: stats.problemsSolved,
      icon: Terminal,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-border bg-card p-5 flex flex-col justify-between animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-secondary" />
              <div className="h-8 w-8 rounded-lg bg-secondary" />
            </div>
            <div className="h-6 w-16 rounded bg-secondary" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-md hover:border-border/80 transition-all duration-300"
          >
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-16 h-16 rounded-full bg-primary/5 group-hover:scale-125 transition-transform duration-300 blur-md pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase font-mono tracking-wider">
                {item.label}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.bgClass} ${item.colorClass}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default StatsOverview;
