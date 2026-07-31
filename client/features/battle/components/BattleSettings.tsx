"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Timer, BookOpen, ShieldAlert, Check } from "lucide-react";
import { RoomSettings } from "@/types";
import { useBattleMutations } from "../hooks/useBattleMutations";

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

interface BattleSettingsProps {
  roomCode: string;
  settings: RoomSettings;
  isHost: boolean;
}

export function BattleSettings({ roomCode, settings, isHost }: BattleSettingsProps) {
  const { updateSettings } = useBattleMutations();

  const [topic, setTopic] = useState(settings?.topic || "Arrays");
  const [difficulty, setDifficulty] = useState(settings?.difficulty || "Medium");
  const [duration, setDuration] = useState(settings?.duration || 30);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  // Keep local state in sync when settings poll changes
  useEffect(() => {
    if (settings) {
      setTopic(settings.topic);
      setDifficulty(settings.difficulty);
      setDuration(settings.duration);
    }
  }, [settings]);

  const handleUpdate = async (newTopic: string, newDiff: string, newDur: number) => {
    if (!isHost) return;
    setError("");
    setFeedback("");

    try {
      await updateSettings.mutateAsync({
        roomCode,
        settings: {
          topic: newTopic,
          difficulty: newDiff,
          duration: newDur,
        },
      });
      setFeedback("Settings saved successfully.");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to update room settings.");
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
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

  const formatTopic = (top: string) => {
    if (!top) return "";
    return top.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="text-base tracking-tight">Battle Settings</h2>
        </div>
        {isHost && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
            Host Controls Enabled
          </span>
        )}
      </div>

      {feedback && (
        <div className="flex items-center gap-1.5 p-3 rounded-xl border border-success/20 bg-success/5 text-xs font-semibold text-success font-mono">
          <Check className="h-4 w-4" />
          {feedback}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-xs font-semibold text-destructive font-mono">
          <ShieldAlert className="h-4 w-4" />
          {error}
        </div>
      )}

      {isHost ? (
        /* Host Form Inputs */
        <div className="space-y-4 pt-1">
          {/* Topic */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Category
            </label>
            <select
              value={topic}
              onChange={(e) => {
                const val = e.target.value;
                setTopic(val);
                handleUpdate(val, difficulty, duration);
              }}
              className="w-full pl-3 pr-8 h-10 bg-background border border-border text-foreground rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
            >
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => {
                const isActive = difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDifficulty(d);
                      handleUpdate(topic, d, duration);
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                        : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((dur) => {
                const isActive = duration === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setDuration(dur);
                      handleUpdate(topic, difficulty, dur);
                    }}
                    className={`py-2 px-0.5 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer font-mono ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                        : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {dur}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Guest Read-Only view */
        <div className="space-y-4 pt-1 font-mono text-xs">
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <span className="text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" /> Topic
            </span>
            <span className="font-bold text-foreground bg-secondary/40 px-2 py-0.5 rounded border border-border">
              {formatTopic(topic)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <span className="text-muted-foreground">Difficulty</span>
            <span className={`px-2 py-0.5 rounded border font-bold uppercase text-[10px] ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <Timer className="h-3.5 w-3.5 text-muted-foreground" /> Timer Duration
            </span>
            <span className="font-bold text-foreground bg-secondary/40 px-2 py-0.5 rounded border border-border">
              {duration} Minutes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
export default BattleSettings;
