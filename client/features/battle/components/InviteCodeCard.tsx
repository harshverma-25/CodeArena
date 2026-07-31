"use client";

import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteCodeCardProps {
  roomCode: string;
}

export function InviteCodeCard({ roomCode }: InviteCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Share2 className="h-4.5 w-4.5" />
          <span className="text-xs uppercase tracking-wider font-mono">Invite Competitors</span>
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-foreground">Share this Room Code</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Other engineers can join this lobby by entering the code below into their Join Room fields.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {/* Room Code Card Display */}
        <div className="flex-1 flex items-center justify-center bg-background border border-border/80 rounded-xl px-4 py-3 font-mono font-black text-2xl tracking-widest text-primary shadow-inner select-all">
          {roomCode}
        </div>

        {/* Copy Trigger */}
        <Button
          onClick={handleCopy}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-border hover:bg-secondary/80 text-foreground transition-colors p-0 cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <Check className="h-5 w-5 text-success animate-in fade-in zoom-in duration-200" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
export default InviteCodeCard;
