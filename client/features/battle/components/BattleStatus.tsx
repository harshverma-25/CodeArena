"use client";

import React from "react";
import { Loader2, Swords, CheckCircle2, UserCheck } from "lucide-react";
import { Room } from "@/types";

interface BattleStatusProps {
  room: Room;
}

export function BattleStatus({ room }: BattleStatusProps) {
  const playersCount = room.players?.length || 0;
  const isFull = playersCount >= 2;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
      {/* Background glow matching status */}
      <div className={`absolute top-0 right-0 -translate-y-8 translate-x-8 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
        isFull ? "bg-success/5" : "bg-primary/5"
      }`} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
            isFull 
              ? "bg-success/10 border-success/20 text-success" 
              : "bg-primary/10 border-primary/20 text-primary"
          }`}>
            {isFull ? (
              <UserCheck className="h-6 w-6" />
            ) : (
              <Loader2 className="h-6 w-6 animate-spin" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {isFull ? "Challenger Connected" : "Awaiting Competitor"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              {isFull 
                ? "Lobby is full! The host will configure rules and start the match when ready." 
                : "Invite another programmer using the room code. The Arena will activate once two players enter."}
            </p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
          <span className={`h-2.5 w-2.5 rounded-full ${
            isFull ? "bg-success animate-pulse" : "bg-primary animate-pulse"
          }`} />
          <span className="font-bold text-muted-foreground uppercase">
            {isFull ? "Ready to Fight" : "Waiting..."}
          </span>
        </div>
      </div>
    </div>
  );
}
export default BattleStatus;
