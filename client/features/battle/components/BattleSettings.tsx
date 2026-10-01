"use client";

import React, { useState } from "react";

import { Sliders, BookOpen, ShieldAlert, Check, Hash } from "lucide-react";
import { RoomSettings } from "@/types";
import { useBattleMutations } from "../hooks/useBattleMutations";

const TOPICS = [
  { value: "random", label: "Any Topic (Random Mix)" },
  { value: "DSA", label: "Data Structures & Algorithms (DSA)" },
  { value: "DBMS", label: "Database Management Systems (DBMS)" },
  { value: "JavaScript", label: "JavaScript & Web Fundamentals" },
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

interface BattleSettingsProps {
  roomCode: string;
  settings: RoomSettings;
  isHost: boolean;
  onUpdate?: (settings: RoomSettings) => void;
}

export function BattleSettings({ roomCode, settings, isHost, onUpdate }: BattleSettingsProps) {
  const { updateSettings } = useBattleMutations();

  const [userTopic, setTopic] = useState<string | null>(null);
  const [userDifficulty, setDifficulty] = useState<string | null>(null);
  const [userQuestionCount, setQuestionCount] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const topic = userTopic ?? settings?.topic ?? "random";
  const difficulty = userDifficulty ?? settings?.difficulty ?? "random";
  const questionCount = userQuestionCount ?? settings?.questionCount ?? 10;


  const handleUpdate = async (newTopic: string, newDiff: string, newCount: number) => {
    if (!isHost) return;
    setError("");
    setFeedback("");

    const newSettings: RoomSettings = {
      topic: newTopic,
      difficulty: newDiff,
      duration: 30,
      questionCount: newCount,
    };

    if (onUpdate) {
      onUpdate(newSettings);
      return;
    }

    try {
      await updateSettings.mutateAsync({
        roomCode,
        settings: newSettings,
      });
      setFeedback("Settings saved.");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update room settings.";
      setError(message);
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

  const getTopicLabel = (val: string) => {
    const item = TOPICS.find((t) => t.value === val);
    return item ? item.label : val;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="text-base tracking-tight">Battle Settings</h2>
        </div>
        {isHost ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            Host Controls
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Host Controlled
          </span>
        )}
      </div>

      {feedback && (
        <div className="flex items-center gap-1.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-500 font-mono">
          <Check className="h-4 w-4" />
          {feedback}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-xs font-semibold text-destructive font-mono">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
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
                handleUpdate(val, difficulty, questionCount);
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
            <div className="grid grid-cols-4 gap-1.5">
              {DIFFICULTIES.map((d) => {
                const isActive = difficulty === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => {
                      setDifficulty(d.value);
                      handleUpdate(topic, d.value, questionCount);
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                        : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" />
              Question Count
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUESTION_COUNTS.map((count) => {
                const isActive = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setQuestionCount(count);
                      handleUpdate(topic, difficulty, count);
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                        : "bg-background border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {count} Qs
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Guest Read-Only view */
        <div className="space-y-3 pt-1 font-mono text-xs">
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Topic
            </span>
            <span className="font-bold text-foreground bg-secondary/40 px-2 py-0.5 rounded border border-border text-right max-w-[200px] truncate">
              {getTopicLabel(topic)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <span className="text-muted-foreground">Difficulty</span>
            <span className={`px-2 py-0.5 rounded border font-bold uppercase text-[10px] ${getDifficultyColor(difficulty)}`}>
              {difficulty === "random" ? "Any" : difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-primary" /> Questions
            </span>
            <span className="font-bold text-foreground bg-secondary/40 px-2 py-0.5 rounded border border-border">
              {questionCount} Questions
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
export default BattleSettings;
