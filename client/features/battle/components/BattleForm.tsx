"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldAlert, SlidersHorizontal, BookOpen, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBattleMutations } from "../hooks/useBattleMutations";

const TOPICS = [
  { value: "random", label: "Any Topic (Random Mix)" },
  { value: "DSA", label: "Data Structures & Algorithms (DSA)" },
  { value: "DBMS", label: "Database Management Systems (DBMS)" },
  { value: "JavaScript", label: "JavaScript & Web Technologies" },
  { value: "OS", label: "Operating Systems (OS)" },
  { value: "CN", label: "Computer Networks (CN)" },
  { value: "OOP", label: "Object-Oriented Programming (OOP)" },
  { value: "Java", label: "Java Core" },
  { value: "CPP", label: "C++ Programming" },
  { value: "SQL", label: "SQL & Relational Databases" },
];

const DIFFICULTIES = [
  { value: "random", label: "Any" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

const QUESTION_COUNTS = [10, 15, 20];

export function BattleForm({ onSuccess }: { onSuccess?: (roomCode: string) => void }) {
  const router = useRouter();
  const { createRoom } = useBattleMutations();

  const [topic, setTopic] = useState("random");
  const [difficulty, setDifficulty] = useState("random");
  const [questionCount, setQuestionCount] = useState(10);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const room = await createRoom.mutateAsync({
        topic,
        difficulty,
        duration: 30,
        questionCount,
      });

      if (onSuccess) {
        onSuccess(room.roomCode);
      } else {
        router.push(`/lobby/${room.roomCode}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create quiz room. Please try again.";
      setError(message);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm font-semibold text-destructive font-mono">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Select Topic */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-primary" />
          Quiz Topic
        </label>
        <div className="relative">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full pl-4 pr-10 h-12 bg-background border border-border text-foreground rounded-xl text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
          >
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value} className="bg-card text-foreground">
                {t.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-muted-foreground border-l-transparent border-r-transparent" />
        </div>
      </div>

      {/* Select Difficulty */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Difficulty Level
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTIES.map((d) => {
            const isActive = difficulty === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                className={`py-3 px-2 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-102"
                    : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Question Count: 10 / 15 / 20 */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
          <Hash className="h-4 w-4 text-primary" />
          Number of Questions
        </label>
        <div className="grid grid-cols-3 gap-3">
          {QUESTION_COUNTS.map((count) => {
            const isActive = questionCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`py-3.5 px-3 rounded-xl border text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer font-mono flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-102"
                    : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-lg font-black">{count}</span>
                <span className="text-[10px] font-normal uppercase opacity-80">Questions</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={createRoom.isPending}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-2 text-sm font-bold shadow-lg shadow-primary/15 transition-all cursor-pointer"
        >
          <Sparkles className="h-5 w-5" />
          {createRoom.isPending ? "Creating Quiz Room..." : "Create Quiz Room"}
        </Button>
      </div>
    </form>
  );
}
export default BattleForm;
