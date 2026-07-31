import React from "react";

export function ProblemsSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
      <div className="border-b border-border bg-muted/40 p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5 h-4 w-28 rounded bg-secondary animate-pulse" />
          <div className="col-span-3 h-4 w-20 rounded bg-secondary animate-pulse" />
          <div className="col-span-2 h-4 w-16 rounded bg-secondary animate-pulse" />
          <div className="col-span-2 h-4 w-14 rounded bg-secondary animate-pulse" />
        </div>
      </div>
      <div className="divide-y divide-border/40 p-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 items-center p-4">
            <div className="col-span-5 space-y-2">
              <div className="h-4.5 w-2/3 rounded bg-secondary animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-secondary/60 animate-pulse" />
            </div>
            <div className="col-span-3">
              <div className="h-4 w-20 rounded-full bg-secondary animate-pulse" />
            </div>
            <div className="col-span-2">
              <div className="h-4 w-12 rounded bg-secondary animate-pulse" />
            </div>
            <div className="col-span-2 flex justify-end">
              <div className="h-8 w-20 rounded bg-secondary animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ProblemsSkeleton;
