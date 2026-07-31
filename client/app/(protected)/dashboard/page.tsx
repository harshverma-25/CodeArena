"use client";

import React from "react";
import { WelcomeHeader, StatsOverview, QuickActions, RecentBattles } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Personalized Welcome Header */}
      <WelcomeHeader />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Left Side: Stats & Actions */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Section: Metrics overview */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight text-muted-foreground uppercase font-mono text-xs">
              Performance Indicators
            </h2>
            <StatsOverview />
          </div>

          {/* Section: Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight text-muted-foreground uppercase font-mono text-xs">
              Quick Operations
            </h2>
            <QuickActions />
          </div>
        </div>

        {/* Right Side: Activity history */}
        <div className="lg:col-span-1 h-full">
          <RecentBattles />
        </div>
      </div>
    </div>
  );
}
