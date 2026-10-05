"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { BattleForm } from "@/features/battle/components/BattleForm";

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBattleModal({ isOpen, onClose }: CreateBattleModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSuccess = (roomCode: string) => {
    onClose();
    router.push(`/lobby/${roomCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl backdrop-blur-md">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-orange-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/40 p-1.5 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Create Quiz Room
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure your quiz topic, subject, and question count.
            </p>
          </div>
        </div>

        {/* Battle Form */}
        <BattleForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
export default CreateBattleModal;
