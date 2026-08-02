"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Swords, Plus, ShieldAlert, Timer, SlidersHorizontal, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBattleMutations } from "../hooks/useBattleMutations";
import { useProblemAvailability } from "@/features/problems/hooks/useProblemAvailability";

const TOPICS = [
  { value: "Arrays", label: "Arrays" },
  { value: "Strings", label: "Strings" },
  { value: "Trees", label: "Trees" },
  { value: "LinkedLists", label: "Linked Lists" },
  { value: "DynamicProgramming", label: "Dynamic Programming" },
  { value: "Graphs", label: "Graphs" },
  { value: "Sorting", label: "Sorting" },
  { value: "Searching", label: "Searching" },
  { value: "Math", label: "Math" },
  { value: "StacksQueues", label: "Stacks & Queues" },
  { value: "Heaps", label: "Heaps" },
  { value: "Greedy", label: "Greedy" },
  { value: "Backtracking", label: "Backtracking" },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DURATIONS = [15, 30, 45, 60];

export function BattleForm() {
  const router = useRouter();
  const { createRoom } = useBattleMutations();
  const { data: availability, isLoading } = useProblemAvailability();

  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState("");

  const isAvailable = (t: string, d: string) => {
    if (!availability) return true; // fallback to true during initial load
    return availability[t]?.[d] ?? false;
  };

  // Auto-adjust selections if the current combination is unavailable
  React.useEffect(() => {
    if (!availability) return;
    
    if (!isAvailable(topic, difficulty)) {
      // Find first available difficulty for current topic
      const availableDiff = DIFFICULTIES.find((d) => isAvailable(topic, d));
      if (availableDiff) {
        setDifficulty(availableDiff);
      } else {
        // Find first topic that has at least one available difficulty
        const availableTopic = TOPICS.find((t) =>
          DIFFICULTIES.some((d) => isAvailable(t.value, d))
        );
        if (availableTopic) {
          setTopic(availableTopic.value);
          const firstDiff = DIFFICULTIES.find((d) => isAvailable(availableTopic.value, d));
          if (firstDiff) {
            setDifficulty(firstDiff);
          }
        }
      }
    }
  }, [availability, topic, difficulty]);

  const currentCombinationAvailable = isAvailable(topic, difficulty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentCombinationAvailable) {
      setError("This Topic & Difficulty combination has no available published problems.");
      return;
    }

    try {
      const room = await createRoom.mutateAsync({
        topic,
        difficulty,
        duration,
      });
      // Redirect to the newly created lobby
      router.push(`/lobby/${room.roomCode}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create battle room. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm font-semibold text-destructive font-mono">
          <ShieldAlert className="h-4.5 w-4.5" />
          {error}
        </div>
      )}

      {/* Select Topic */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          Select Challenge Category
        </label>
        <div className="relative">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full pl-4 pr-10 h-12 bg-background border border-border text-foreground rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
          >
            {TOPICS.map((t) => {
              const hasAnyDifficulty = DIFFICULTIES.some((d) => isAvailable(t.value, d));
              return (
                <option
                  key={t.value}
                  value={t.value}
                  disabled={!hasAnyDifficulty && !isLoading}
                  className="bg-card text-foreground"
                >
                  {t.label} {!hasAnyDifficulty && !isLoading ? "(Unavailable)" : ""}
                </option>
              );
            })}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-muted-foreground border-l-transparent border-r-transparent" />
        </div>
      </div>

      {/* Select Difficulty */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4" />
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((d) => {
            const isActive = difficulty === d;
            const available = isAvailable(topic, d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => available && setDifficulty(d)}
                disabled={!available && !isLoading}
                className={`py-3 px-4 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                  !available && !isLoading
                    ? "opacity-30 cursor-not-allowed bg-background border-dashed border-border text-muted-foreground"
                    : isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-102 cursor-pointer"
                    : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Duration */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
          <Timer className="h-4 w-4" />
          Duration Limit (Minutes)
        </label>
        <div className="grid grid-cols-4 gap-3">
          {DURATIONS.map((dur) => {
            const isActive = duration === dur;
            return (
              <button
                key={dur}
                type="button"
                onClick={() => setDuration(dur)}
                className={`py-3 px-2 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer font-mono ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-102"
                    : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {dur}m
              </button>
            );
          })}
        </div>
      </div>

      {/* Unavailable combination alert */}
      {!isLoading && !currentCombinationAvailable && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-sm font-semibold text-yellow-500 font-mono">
          <AlertTriangle className="h-4.5 w-4.5" />
          No published problems are currently available for {topic} ({difficulty}).
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={createRoom.isPending || (!currentCombinationAvailable && !isLoading)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-2 text-sm font-bold shadow-lg shadow-primary/10 transition-colors"
        >
          <Swords className="h-5 w-5" />
          {createRoom.isPending ? "Configuring Room..." : "Create Battle Room"}
        </Button>
      </div>
    </form>
  );
}
export default BattleForm;
