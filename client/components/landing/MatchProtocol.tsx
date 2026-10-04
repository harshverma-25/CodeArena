"use client";

import React from "react";
import { PlusCircle, Radio, Zap, FileCode2 } from "lucide-react";

export function MatchProtocol() {
  const steps = [
    {
      index: "01",
      title: "Room Configuration",
      tag: "PROVISION",
      icon: PlusCircle,
      description:
        "Spin up a custom duel room or enter a 6-character room code. Select your technical discipline (DSA, DBMS, JavaScript, OS, Networks), difficulty level, and question budget (10, 15, or 20 questions).",
    },
    {
      index: "02",
      title: "Synchronous Question Stream",
      tag: "DISPATCH",
      icon: Radio,
      description:
        "Both engineers receive the identical question payload at the exact same millisecond via server-authoritative WebSocket pipes. Answer keys never touch client memory during active gameplay.",
    },
    {
      index: "03",
      title: "Velocity-Weighted Scoring",
      tag: "EXECUTE",
      icon: Zap,
      description:
        "Thirty seconds on the round clock. Answering accurately within the initial 3 seconds awards maximum velocity score. Guessing incorrectly or timing out yields zero points.",
    },
    {
      index: "04",
      title: "Instant Solution Dissection",
      tag: "DEBRIEF",
      icon: FileCode2,
      description:
        "When the final round ends, the server unseals complete algorithmic solutions. Review every question, your selected options, opponent choices, and detailed theoretical proofs.",
    },
  ];

  return (
    <section id="protocol" className="w-full py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl space-y-2 pb-12 border-b border-border">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>The Match Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How a CodeArena duel executes.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Designed for uncompromising fairness, rapid feedback, and deep technical learning between competing students.
          </p>
        </div>

        {/* 4-Step Technical Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.index}
                className="flex flex-col justify-between p-6 rounded-lg border border-border bg-surface hover:border-foreground/30 transition-colors space-y-6"
              >
                <div className="space-y-4">
                  {/* Step Index & Tag */}
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-2xl font-black text-foreground">{step.index}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-border bg-surface-elevated text-muted-foreground">
                      {step.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-foreground font-bold text-lg tracking-tight pt-1">
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <h3>{step.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  Phase Verification: Passed
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default MatchProtocol;
