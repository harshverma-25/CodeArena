import React from "react";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard" | string;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const getColors = () => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-muted-foreground bg-secondary/40 border-border";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
        getColors(),
        className
      )}
    >
      {difficulty}
    </span>
  );
}
export default DifficultyBadge;
