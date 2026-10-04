"use client";

import React, { useState, useEffect } from "react";
import { Check, X, RotateCcw, Clock, Swords, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoRound {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  codeSnippet?: string[];
  options: { label: string; text: string }[];
  correctIndex: number;
  explanation: string;
  opponentChoiceIndex: number;
  opponentDelayMs: number;
}

const DEMO_ROUNDS: DemoRound[] = [
  {
    id: "js-v8-loop",
    topic: "JavaScript Runtime",
    difficulty: "Medium",
    question: "What is the exact execution order logged to stdout?",
    codeSnippet: [
      "console.log('1');",
      "setTimeout(() => console.log('2'), 0);",
      "Promise.resolve().then(() => console.log('3'));",
      "console.log('4');",
    ],
    options: [
      { label: "A", text: "1, 2, 3, 4" },
      { label: "B", text: "1, 4, 3, 2" },
      { label: "C", text: "1, 4, 2, 3" },
      { label: "D", text: "1, 3, 4, 2" },
    ],
    correctIndex: 1, // B
    explanation:
      "Synchronous statements ('1' and '4') execute on the call stack first. Microtasks (Promise.then) drain immediately after the current turn before any macrotasks (setTimeout) execute. Hence '3' precedes '2'.",
    opponentChoiceIndex: 1,
    opponentDelayMs: 2400,
  },
  {
    id: "dsa-bst",
    topic: "Data Structures",
    difficulty: "Hard",
    question: "What is the tightest worst-case search complexity in a strictly balanced AVL Tree with N nodes?",
    codeSnippet: [
      "// Height invariant: |balanceFactor(node)| <= 1",
      "function search(node, key) {",
      "  if (!node || node.key === key) return node;",
      "  return key < node.key ? search(node.left, key) : search(node.right, key);",
      "}",
    ],
    options: [
      { label: "A", text: "O(1) constant" },
      { label: "B", text: "O(log N) logarithmic" },
      { label: "C", text: "O(N) linear" },
      { label: "D", text: "O(N log N) linearithmic" },
    ],
    correctIndex: 1, // B
    explanation:
      "Because AVL trees rebalance via rotations upon insertion and deletion, tree height is strictly bound to ~1.44 log2(N). Therefore lookup is guaranteed O(log N) worst-case.",
    opponentChoiceIndex: 2, // Opponent guessed C (wrong)
    opponentDelayMs: 3100,
  },
  {
    id: "dbms-isolation",
    topic: "Database Systems",
    difficulty: "Hard",
    question: "Which ANSI SQL transaction isolation level guarantees complete prevention of Phantom Reads?",
    codeSnippet: [
      "BEGIN TRANSACTION ISOLATION LEVEL ???;",
      "SELECT * FROM accounts WHERE balance > 10000; -- T1",
      "-- Concurrent T2 inserts new row with balance = 15000 and commits",
      "SELECT * FROM accounts WHERE balance > 10000; -- T1 re-query",
    ],
    options: [
      { label: "A", text: "Read Committed" },
      { label: "B", text: "Repeatable Read" },
      { label: "C", text: "Serializable" },
      { label: "D", text: "Snapshot Isolation" },
    ],
    correctIndex: 2, // C
    explanation:
      "Under ANSI SQL standards, Serializable is the only isolation level requiring protection against phantom records via predicate locks, index-range locks, or Serializable Snapshot Isolation (SSI).",
    opponentChoiceIndex: 2,
    opponentDelayMs: 1800,
  },
];

export function InteractiveBattleDemo() {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userScore, setUserScore] = useState(320);
  const [opponentScore, setOpponentScore] = useState(280);
  const [opponentStatus, setOpponentStatus] = useState<"thinking" | "locked">("thinking");
  const [secondsRemaining, setSecondsRemaining] = useState(24);
  const [showExplanation, setShowExplanation] = useState(false);

  const round = DEMO_ROUNDS[currentRoundIdx];

  // Timer countdown simulation
  useEffect(() => {
    if (selectedOption !== null) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedOption, currentRoundIdx]);

  // Opponent answer simulation
  useEffect(() => {
    if (selectedOption === null) return;

    const timer = setTimeout(() => {
      setOpponentStatus("locked");
      if (round.opponentChoiceIndex === round.correctIndex) {
        setOpponentScore((prev) => prev + 90);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [selectedOption, round]);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === round.correctIndex) {
      // Award points scaled by speed
      const awarded = Math.max(50, secondsRemaining * 4);
      setUserScore((prev) => prev + awarded);
    }
  };

  const handleNextRound = () => {
    const nextIdx = (currentRoundIdx + 1) % DEMO_ROUNDS.length;
    setCurrentRoundIdx(nextIdx);
    setSelectedOption(null);
    setOpponentStatus("thinking");
    setSecondsRemaining(28);
    setShowExplanation(false);
  };

  const handleReset = () => {
    setCurrentRoundIdx(0);
    setSelectedOption(null);
    setUserScore(320);
    setOpponentScore(280);
    setOpponentStatus("thinking");
    setSecondsRemaining(24);
    setShowExplanation(false);
  };

  return (
    <section id="demo" className="w-full py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span>Interactive Duel Demonstration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Experience an active 1v1 battle round.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Click an option below to simulate locking in your answer. Both contenders see questions simultaneously; points decay with every second that ticks down.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              Sample Question {currentRoundIdx + 1} of {DEMO_ROUNDS.length}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* The Live Arena HUD Container */}
        <div className="mt-8 rounded-lg border border-border bg-surface overflow-hidden">
          {/* Match HUD Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border bg-surface-elevated font-mono text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Swords className="h-3.5 w-3.5" />
                ROOM: CA-8492
              </span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground uppercase">{round.topic}</span>
              <span className="text-border">|</span>
              <span className="px-2 py-0.5 rounded border border-border bg-surface text-[10px] uppercase font-bold text-muted-foreground">
                {round.difficulty}
              </span>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-bold text-foreground">00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}</span>
              <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-foreground transition-all duration-1000"
                  style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dual Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-surface">
            {/* Player 1 (You) */}
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-mono font-bold text-foreground text-sm">you.dev</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border border-border bg-surface-elevated text-muted-foreground">
                    YOU
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  Status:{" "}
                  {selectedOption !== null ? (
                    <span className="text-foreground font-bold">Answer Submitted</span>
                  ) : (
                    "Reading question..."
                  )}
                </p>
              </div>
              <div className="text-right font-mono">
                <div className="text-2xl font-black text-foreground">{userScore}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Points</div>
              </div>
            </div>

            {/* Player 2 (Challenger) */}
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-mono font-bold text-foreground text-sm">challenger.io</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border border-border bg-surface-elevated text-muted-foreground">
                    OPPONENT
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  Status:{" "}
                  {opponentStatus === "locked" ? (
                    <span className="text-foreground font-bold">Locked in</span>
                  ) : (
                    "Deliberating..."
                  )}
                </p>
              </div>
              <div className="text-right font-mono">
                <div className="text-2xl font-black text-foreground">{opponentScore}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Points</div>
              </div>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Question 0{currentRoundIdx + 1} of 10
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                {round.question}
              </h3>
            </div>

            {/* Code Snippet Box (if available) */}
            {round.codeSnippet && (
              <div className="rounded border border-border bg-background p-4 font-mono text-xs sm:text-sm text-foreground space-y-1 overflow-x-auto">
                {round.codeSnippet.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 select-none text-muted-foreground/60">{i + 1}</span>
                    <span className="text-foreground/90">{line}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {round.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === round.correctIndex;
                const isAnswered = selectedOption !== null;

                let stateClasses = "border-border bg-surface hover:border-foreground/50 hover:bg-surface-elevated text-foreground";

                if (isAnswered) {
                  if (isSelected && isCorrect) {
                    stateClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                  } else if (isSelected && !isCorrect) {
                    stateClasses = "border-destructive bg-destructive/10 text-destructive";
                  } else if (isCorrect) {
                    stateClasses = "border-emerald-500/60 bg-surface-elevated text-emerald-400";
                  } else {
                    stateClasses = "border-border/60 bg-surface opacity-50";
                  }
                }

                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      "flex items-start gap-3.5 p-4 rounded-md border text-left font-mono transition-all",
                      stateClasses,
                      !isAnswered && "cursor-pointer active:scale-[0.99]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded border text-xs font-bold",
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-surface-elevated text-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm font-medium pt-0.5 leading-snug">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Solution Breakdown Drawer after Selection */}
            {showExplanation && (
              <div className="mt-6 rounded-md border border-border bg-surface-elevated p-5 space-y-3 font-mono text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    {selectedOption === round.correctIndex ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Check className="h-4 w-4" /> Correct Answer Locked In (+{secondsRemaining * 4} pts)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-destructive">
                        <X className="h-4 w-4" /> Incorrect Selection (+0 pts)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-foreground bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
                  >
                    <span>Next Demonstration Round</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <p className="text-muted-foreground leading-relaxed pt-1">
                  <strong className="text-foreground">Solution Analysis: </strong>
                  {round.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default InteractiveBattleDemo;
