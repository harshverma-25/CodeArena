"use client";

import React from "react";
import { Clock, EyeOff, Network, Award } from "lucide-react";

export function AntiCheatSpecs() {
  const specs = [
    {
      title: "Server-Authoritative Timing",
      icon: Clock,
      tag: "NTP_CLOCK",
      body: "Timers are managed entirely by Node.js backend intervals. Pausing browser tabs, throttling CPU threads, or executing local debugger pauses triggers automatic server timeout forfeit.",
    },
    {
      title: "Blind Payload Transmission",
      icon: EyeOff,
      tag: "ZERO_LEAK",
      body: "Answer keys and algorithmic explanations are stripped before questions enter the WebSocket stream. Inspecting network packets or client memory state reveals zero solution data.",
    },
    {
      title: "Velocity-Weighted Score Degradation",
      icon: Award,
      tag: "ALGO_METRIC",
      body: "Rapid precision is rewarded exponentially. A correct answer within 3 seconds awards up to 100 points, whereas guessing blindly in the final seconds yields negligible score gains.",
    },
    {
      title: "Automated Reconnect Validation",
      icon: Network,
      tag: "STATE_RESILIENCE",
      body: "If a competitor drops connection mid-duel, the server preserves the round state for a strict 15-second grace window before awarding an automatic default victory to the active challenger.",
    },
  ];

  return (
    <section id="architecture" className="w-full py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl space-y-2 pb-12 border-b border-border">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>Architectural Integrity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for fair, tamper-proof duels.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Competitive assessments only matter when execution is rigorously fair. CodeArena ensures every student competes on an uncompromised playing field.
          </p>
        </div>

        {/* 4 Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
          {specs.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-lg border border-border bg-surface hover:border-foreground/30 transition-colors space-y-4"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base tracking-tight">{item.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-border bg-surface-elevated text-muted-foreground">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default AntiCheatSpecs;
