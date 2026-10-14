"use client";

import React from "react";
import { Check, Clock } from "lucide-react";
import { ArcadeCrownIcon } from "@/components/ui/ArcadeIcons";
import { LiveBattlePlayer } from "@/features/battle/hooks/useLiveBattle";

export interface PlayerCardTheme {
  bg: string;
  bookmarkBg: string;
}

interface PlayerRosterItemProps {
  player: LiveBattlePlayer & { rank: number };
  isMe: boolean;
  theme: PlayerCardTheme;
  avatarRenderer: (p: LiveBattlePlayer) => React.ReactNode;
}

/**
 * Isolated, memoized player row in the multiplayer roster.
 * Avoids re-rendering when parent timers tick.
 */
export const PlayerRosterItem = React.memo(function PlayerRosterItem({
  player,
  isMe,
  theme,
  avatarRenderer,
}: PlayerRosterItemProps) {
  return (
    <div
      className={`relative rounded-2xl border-[2.5px] border-black p-2.5 sm:p-3 shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3 ${theme.bg} ${
        isMe ? "ring-2 ring-black" : ""
      }`}
    >
      {/* Rank Bookmark Tag (#1, #2, #3, #4) */}
      <div className="absolute -top-2.5 -left-2 z-10">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md border-2 border-black font-black text-xs shadow-[1px_1px_0px_#000] ${theme.bookmarkBg} text-black`}
        >
          #{player.rank}
          {player.rank === 1 && <ArcadeCrownIcon className="w-3.5 h-3 inline-block" />}
        </span>
      </div>

      {/* Left: Avatar + Name + Answer State */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Circular Avatar */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_#000] shrink-0">
          {avatarRenderer(player)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-black truncate leading-tight">
              {player.displayName || player.username}
            </span>
          </div>
          <span className="text-[11px] font-bold text-stone-700 leading-tight block">
            {isMe ? "You" : player.isHost ? "Host" : "Guest"}
          </span>

          {/* Answer Status Badge & Response Latency */}
          <div className="mt-1 flex items-center gap-1.5">
            {player.hasAnswered ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D1FAE5] border border-black font-black text-[10px] text-[#065F46]">
                <Check className="w-3 h-3 stroke-[3]" />
                Answered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#CFFAFE] border border-black font-black text-[10px] text-[#0369A1]">
                <Clock className="w-2.5 h-2.5 stroke-[2.5]" />
                Thinking...
              </span>
            )}

            {/* Ping / Latency metric */}
            <span className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  player.hasAnswered ? "bg-emerald-500" : "bg-sky-500"
                }`}
              />
              {player.timeTakenMs ? `${player.timeTakenMs}ms` : "Live"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Authoritative Player Score */}
      <div className="shrink-0 text-right">
        <span className="font-black text-lg sm:text-xl text-black font-mono">
          {(player.score || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
});
