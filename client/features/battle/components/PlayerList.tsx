"use client";

import React from "react";
import { Swords, User as UserIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { RoomPlayer } from "@/types";

interface PlayerListProps {
  players: RoomPlayer[];
}

export function PlayerList({ players }: PlayerListProps) {
  // Pad the array to show 2 total slots
  const filledSlots = players || [];
  const emptySlotsCount = Math.max(0, 2 - filledSlots.length);
  const slots = [...filledSlots, ...Array(emptySlotsCount).fill(null)];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/40 pb-3">
        <Swords className="h-5 w-5 text-primary animate-pulse" />
        <h2 className="text-base tracking-tight">Active Challengers ({filledSlots.length}/2)</h2>
      </div>

      <div className="space-y-3 pt-1">
        {slots.map((player, i) => {
          if (!player) {
            return (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border bg-background/20 text-muted-foreground text-xs font-medium"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 border border-border/60">
                    <UserIcon className="h-4 w-4 opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-muted-foreground/60 tracking-wider">WAITING FOR PLAYER...</p>
                    <p className="text-[10px] text-muted-foreground/40 font-mono">SLOT AVAILABLE</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/40 font-mono">
                  Open
                </span>
              </div>
            );
          }

          const user = player.user;
          const name = user?.displayName || user?.username || "Guest Challenger";
          const avatar = user?.avatar;

          return (
            <div
              key={user?._id || `player-${i}`}
              className={`flex items-center justify-between p-4 rounded-xl border bg-background/40 hover:bg-background/80 transition-all duration-200 ${
                player.isHost ? "border-primary/30" : "border-border/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="h-10 w-10 rounded-full border border-border bg-card object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground font-mono font-black border border-border">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-0.5">
                  <p className="text-sm font-extrabold text-foreground">{name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    @{user?.username || "guest"}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                {player.isHost ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase font-mono tracking-wider">
                    Host
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-secondary border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                    Guest
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default PlayerList;
