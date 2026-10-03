"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Timer, Trophy, Swords, RefreshCw, Zap } from "lucide-react";

interface SampleQuestion {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: 1,
    topic: "Data Structures",
    difficulty: "Easy",
    question: "Which data structure operates strictly on a Last In, First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
    correctIndex: 1,
    explanation: "Stacks insert and remove elements from the same end (top), establishing a LIFO order.",
  },
  {
    id: 2,
    topic: "Algorithms",
    difficulty: "Medium",
    question: "What is the average time complexity of searching an item in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctIndex: 2,
    explanation: "Each comparison in a balanced BST halves the remaining search space, resulting in logarithmic O(log n) performance.",
  },
  {
    id: 3,
    topic: "JavaScript",
    difficulty: "Medium",
    question: "What will `console.log(typeof NaN)` output in JavaScript?",
    options: ["'undefined'", "'number'", "'NaN'", "'object'"],
    correctIndex: 1,
    explanation: "In IEEE 754 floating-point specification and ECMAScript standard, NaN is categorized under the 'number' type.",
  },
];

export function InteractiveBattlePreview() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [myScore, setMyScore] = useState(140);
  const [timer, setTimer] = useState(24);

  const currentQ = SAMPLE_QUESTIONS[questionIndex];

  // Timer simulation tick
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);
    if (idx === currentQ.correctIndex) {
      setMyScore((prev) => prev + 15);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setTimer(30);
    setQuestionIndex((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6 shadow-2xl relative overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background">
            <Swords className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            LIVE ARENA DEMO
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
            {currentQ.topic} • {currentQ.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary border border-border font-mono text-xs font-bold text-foreground">
            <Timer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>00:{timer < 10 ? `0${timer}` : timer}s</span>
          </div>
        </div>
      </div>

      {/* 1v1 Players Status Bar */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Player 1 (You) */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-foreground/30 bg-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background font-mono font-bold text-xs">
              YOU
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Challenger</p>
              <p className="text-[10px] text-muted-foreground font-mono">Q3 of 10</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-mono font-black text-foreground flex items-center gap-1 justify-end">
              <Trophy className="h-3 w-3 text-muted-foreground" />
              {myScore}
            </p>
            <p className="text-[9px] font-mono text-muted-foreground uppercase">PTS</p>
          </div>
        </div>

        {/* Player 2 (Opponent) */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground font-mono font-bold text-xs border border-border">
              RIVAL
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Opponent</p>
              <p className="text-[10px] text-muted-foreground font-mono">Q3 of 10</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-mono font-black text-muted-foreground flex items-center gap-1 justify-end">
              <Trophy className="h-3 w-3 text-muted-foreground" />
              110
            </p>
            <p className="text-[9px] font-mono text-muted-foreground uppercase">PTS</p>
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-5 space-y-1.5">
        <p className="text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">
          Question {questionIndex + 1}
        </p>
        <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* Interactive MCQ Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {currentQ.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;
          const letter = ["A", "B", "C", "D"][idx];

          let stateStyles = "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40";
          if (isSubmitted) {
            if (isCorrect) {
              stateStyles = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-semibold";
            } else if (isSelected && !isCorrect) {
              stateStyles = "border-rose-500/50 bg-rose-500/10 text-rose-400";
            } else {
              stateStyles = "border-border/40 bg-background/50 opacity-40";
            }
          } else if (isSelected) {
            stateStyles = "border-foreground bg-secondary text-foreground font-semibold";
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleSelect(idx)}
              className={`flex items-center justify-between p-3.5 rounded-lg border text-left text-xs transition-all duration-150 cursor-pointer ${stateStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono font-bold text-[11px] ${
                  isSubmitted && isCorrect
                    ? "bg-emerald-500 text-white"
                    : isSubmitted && isSelected && !isCorrect
                    ? "bg-rose-500 text-white"
                    : "bg-secondary text-foreground border border-border"
                }`}>
                  {letter}
                </span>
                <span className="font-medium">{optionText}</span>
              </div>

              {isSubmitted && isCorrect && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
              {isSubmitted && isSelected && !isCorrect && <X className="h-4 w-4 text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Feedback & Reset Box */}
      {isSubmitted ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-lg border border-border bg-secondary/40 font-mono text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className={`font-bold ${selectedOption === currentQ.correctIndex ? "text-emerald-400" : "text-rose-400"}`}>
              {selectedOption === currentQ.correctIndex ? "✓ ANSWER VERIFIED (+15 PTS)" : "✗ INCORRECT RESPONSE"}
            </p>
            <p className="text-[11px] text-muted-foreground font-sans">
              {currentQ.explanation}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-foreground text-background font-bold hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Next Demo Question
          </button>
        </div>
      ) : (
        <p className="text-center text-[11px] font-mono text-muted-foreground">
          ↑ Click any option above to test the real-time submission response
        </p>
      )}
    </div>
  );
}

export default InteractiveBattlePreview;
