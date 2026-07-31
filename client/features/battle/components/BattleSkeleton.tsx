import React from "react";

export function BattleSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-secondary" />
          <div className="h-8 w-64 rounded bg-secondary" />
        </div>
        <div className="h-10 w-28 rounded bg-secondary" />
      </div>

      {/* Status Alert Skeleton */}
      <div className="h-24 rounded-2xl border border-border bg-card p-6" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Col (2 cards) */}
        <div className="md:col-span-2 space-y-6">
          {/* Player list skeleton */}
          <div className="h-64 rounded-2xl border border-border bg-card p-6" />
        </div>

        {/* Right Col (2 cards) */}
        <div className="md:col-span-1 space-y-6">
          {/* Invite Code card */}
          <div className="h-48 rounded-2xl border border-border bg-card p-6" />
          {/* Settings card */}
          <div className="h-56 rounded-2xl border border-border bg-card p-6" />
        </div>
      </div>
    </div>
  );
}
export default BattleSkeleton;
