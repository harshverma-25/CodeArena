"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, X, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinBattleModal({ isOpen, onClose }: JoinBattleModalProps) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCode = roomCode.trim().toUpperCase();
    
    if (!trimmedCode) {
      setError("Room code is required");
      return;
    }

    if (trimmedCode.length < 4 || trimmedCode.length > 8) {
      setError("Room code must be between 4 and 8 characters");
      return;
    }

    if (!/^[A-Z0-9]+$/.test(trimmedCode)) {
      setError("Room code can only contain letters and numbers");
      return;
    }

    setIsSubmitting(true);
    // Navigate to the lobby page
    router.push(`/lobby/${trimmedCode}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-orange-400" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/40 p-1.5 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Title & Description */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Swords className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Join Battle Room
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter the room code shared by the host to join the battle lobby.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="room-code" className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Room Code
            </label>
            <Input
              id="room-code"
              type="text"
              placeholder="E.g. AB12"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                if (error) setError("");
              }}
              className="bg-background text-foreground border-border focus:ring-primary focus:border-primary tracking-widest text-center uppercase font-mono font-bold text-lg h-12"
              maxLength={8}
              autoFocus
              disabled={isSubmitting}
            />
            {error && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1.5 font-medium">
                <ShieldAlert className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="border border-border hover:bg-secondary/40 text-foreground transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Enter Lobby
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default JoinBattleModal;
