"use client";

import React from "react";
import { Loader2, Swords, CheckCircle2, UserCheck } from "lucide-react";
import { Room } from "@/types";

interface BattleStatusProps {
  room: Room;
  isConnected: boolean;
  socketError: string | null;
}

export function BattleStatus({ room, isConnected, socketError }: BattleStatusProps) {
  const playersCount = room.players?.length || 0;
  const isFull = playersCount >= 2;

  return (
    <div className="space-y-4">
      {/* Network alerts for connection/reconnection */}
      {socketError && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-xs font-semibold text-destructive font-mono animate-pulse">
          <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
          {socketError}
        </div>
      )}

      {!isConnected && !socketError && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs font-semibold text-amber-500 font-mono">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Real-time sync lost. Retrying Socket connection...
        </div>
      )}

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

          {/* Live Status + Connection state indicators */}
          <div className="flex flex-col md:items-end gap-2.5 self-start md:self-auto font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                isFull ? "bg-success animate-pulse" : "bg-primary animate-pulse"
              }`} />
              <span className="font-bold text-muted-foreground uppercase">
                {isFull ? "Ready to Fight" : "Waiting..."}
              </span>
            </div>

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              isConnected
                ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                : "text-amber-500 bg-amber-500/10 border-amber-500/20"
            }`}>
              {isConnected ? "Synced Live" : "Polling Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BattleStatus;
