"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProblemFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
}

const TOPICS = [
  { value: "all", label: "All Topics" },
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

const DIFFICULTIES = [
  { value: "all", label: "All" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

export function ProblemFilters({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  topic,
  setTopic,
}: ProblemFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search problems by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border text-foreground focus:ring-primary focus:border-primary w-full h-11"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Topic Select */}
          <div className="relative flex items-center min-w-[200px]">
            <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full pl-10 pr-8 h-11 bg-background border border-border text-foreground rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
            >
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value} className="bg-card text-foreground">
                  {t.label}
                </option>
              ))}
            </select>
            {/* Custom select arrow */}
            <div className="absolute right-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-muted-foreground border-l-transparent border-r-transparent" />
          </div>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex items-center gap-2 border-t border-border/40 pt-4 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground uppercase font-mono mr-2">
          Difficulty:
        </span>
        <div className="flex rounded-lg bg-background p-1 border border-border/60">
          {DIFFICULTIES.map((d) => {
            const isActive = difficulty === d.value;
            return (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider cursor-pointer",
                  isActive
                    ? "bg-card text-foreground border border-border/60 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default ProblemFilters;
