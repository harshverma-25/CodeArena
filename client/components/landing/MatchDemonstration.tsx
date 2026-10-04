"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, RotateCcw, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoQuestion {
  id: string;
  topic: string;
  categoryBadge: string;
  question: string;
  codeHtml?: React.ReactNode;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: "js-runtime",
    topic: "JavaScript",
    categoryBadge: "EVENT LOOP // V8",
    question: "What is the exact execution order logged to the console?",
    codeHtml: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed">
        <div><span className="text-[#a1a1aa]">console</span>.<span className="text-[#7c5cff]">log</span>(<span className="text-[#10b981]">&apos;1&apos;</span>);</div>
        <div><span className="text-[#7c5cff]">setTimeout</span>(() =&gt; <span className="text-[#a1a1aa]">console</span>.<span className="text-[#7c5cff]">log</span>(<span className="text-[#10b981]">&apos;2&apos;</span>), <span className="text-[#f59e0b]">0</span>);</div>
        <div><span className="text-[#7c5cff]">Promise</span>.<span className="text-[#7c5cff]">resolve</span>().<span className="text-[#7c5cff]">then</span>(() =&gt; <span className="text-[#a1a1aa]">console</span>.<span className="text-[#7c5cff]">log</span>(<span className="text-[#10b981]">&apos;3&apos;</span>));</div>
        <div><span className="text-[#a1a1aa]">console</span>.<span className="text-[#7c5cff]">log</span>(<span className="text-[#10b981]">&apos;4&apos;</span>);</div>
      </div>
    ),
    options: [
      "1, 4, 2, 3",
      "1, 4, 3, 2",
      "1, 3, 4, 2",
      "1, 2, 3, 4",
    ],
    correctIndex: 1,
    explanation:
      "Synchronous code logs '1' and '4' first. Microtasks (Promise.then) drain immediately after the current script turn, before any macrotasks (setTimeout) execute. Hence '3' logs before '2'.",
  },
  {
    id: "dsa-tree",
    topic: "Algorithms",
    categoryBadge: "COMPLEXITY // BST",
    question: "What is the worst-case search complexity in a strictly balanced AVL Tree with N elements?",
    codeHtml: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed">
        <div><span className="text-[#737373]">{"// Self-balancing AVL node lookup"}</span></div>
        <div><span className="text-[#7c5cff]">function</span> <span className="text-[#ededed]">lookup</span>(node, key) &#123;</div>
        <div className="pl-4"><span className="text-[#7c5cff]">if</span> (!node || node.key === key) <span className="text-[#7c5cff]">return</span> node;</div>
        <div className="pl-4"><span className="text-[#7c5cff]">return</span> key &lt; node.key ? lookup(node.left, key) : lookup(node.right, key);</div>
        <div>&#125;</div>
      </div>
    ),
    options: [
      "O(1) constant",
      "O(log N) logarithmic",
      "O(N) linear",
      "O(N log N) linearithmic",
    ],
    correctIndex: 1,
    explanation:
      "Because AVL trees maintain a strict balance factor (height diff <= 1), the tree height is guaranteed to never exceed 1.44 * log2(N). Search is strictly bounded by O(log N).",
  },
  {
    id: "dbms-acid",
    topic: "Databases",
    categoryBadge: "SQL // ISOLATION",
    question: "Which ANSI SQL isolation level prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
    codeHtml: (
      <div className="font-mono text-xs sm:text-sm leading-relaxed">
        <div><span className="text-[#7c5cff]">SET TRANSACTION ISOLATION LEVEL</span> <span className="text-[#f59e0b]">???</span>;</div>
        <div><span className="text-[#7c5cff]">BEGIN TRANSACTION</span>;</div>
        <div className="pl-4"><span className="text-[#a1a1aa]">SELECT</span> * <span className="text-[#a1a1aa]">FROM</span> accounts <span className="text-[#a1a1aa]">WHERE</span> tier = <span className="text-[#10b981]">&apos;enterprise&apos;</span>;</div>
        <div><span className="text-[#7c5cff]">COMMIT</span>;</div>
      </div>
    ),
    options: [
      "Read Committed",
      "Repeatable Read",
      "Serializable",
      "Read Uncommitted",
    ],
    correctIndex: 2,
    explanation:
      "Serializable is the strictest isolation level. It guarantees full serializability, preventing phantom rows through predicate range locks or Serializable Snapshot Isolation (SSI).",
  },
];

export function MatchDemonstration() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userScore, setUserScore] = useState(480);
  const [opponentScore, setOpponentScore] = useState(410);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(26);

  const currentQ = DEMO_QUESTIONS[activeTab];

  // Simulated countdown
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnswered]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    const speedBonus = seconds * 2;
    if (isCorrect) {
      setUserScore((prev) => prev + 100 + speedBonus);
    }

    setTimeout(() => {
      setOpponentSubmitted(true);
      if (Math.random() > 0.3) {
        setOpponentScore((prev) => prev + 115);
      }
    }, 400);
  };

  const handleSwitchTab = (newTab: number) => {
    setActiveTab(newTab);
    setSelectedIndex(null);
    setIsAnswered(false);
    setOpponentSubmitted(false);
    setSeconds(26);
  };

  const isCorrect = selectedIndex === currentQ.correctIndex;

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0c0d11] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Subtle violet edge gradient */}
      <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 bg-[#7c5cff]/[0.08] rounded-full blur-[80px]" />

      {/* Top Bar: Topic Switcher & Demo Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#ededed]">
            ARENA COMBAT SANDBOX
          </span>
          <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#737373] border border-white/[0.06]">
            Interactive Demo
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {DEMO_QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSwitchTab(idx)}
              className={cn(
                "px-3 py-1 rounded-md font-mono text-xs transition-all",
                activeTab === idx
                  ? "bg-[#7c5cff] text-white font-medium shadow-[0_0_12px_rgba(124,92,255,0.3)]"
                  : "text-[#a1a1aa] hover:text-[#ededed] hover:bg-white/[0.04]"
              )}
            >
              {q.topic}
            </button>
          ))}
        </div>
      </div>

      {/* 1v1 Scoreboard Bar */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-xl border border-white/[0.06] bg-black/50 p-3 sm:p-4 mb-6">
        {/* Left: You */}
        <div className="flex items-center justify-between pr-3 border-r border-white/[0.06]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-[#ededed]">
                You (Challenger)
              </span>
              <span className="rounded bg-[#10b981]/15 px-1.5 py-0.2 font-mono text-[10px] text-[#10b981]">
                HOST
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#737373]">
              {isAnswered ? (
                <span className="text-[#10b981]">Answer locked</span>
              ) : (
                <span className="text-[#f59e0b] animate-pulse">Thinking...</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">
              {userScore}
            </span>
            <span className="block font-mono text-[9px] text-[#737373] uppercase">PTS</span>
          </div>
        </div>

        {/* Right: Opponent */}
        <div className="flex items-center justify-between pl-1 sm:pl-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-[#a1a1aa]">
                marcus.ts
              </span>
              <span className="rounded bg-white/[0.05] px-1.5 py-0.2 font-mono text-[10px] text-[#737373]">
                OPPONENT
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#737373]">
              {opponentSubmitted ? (
                <span className="text-[#a1a1aa]">Submitted (2.4s)</span>
              ) : (
                <span className="text-[#7c5cff] animate-pulse">Computing...</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#ededed]">
              {opponentScore}
            </span>
            <span className="block font-mono text-[9px] text-[#737373] uppercase">PTS</span>
          </div>
        </div>
      </div>

      {/* Round & Countdown Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/[0.04] px-2.5 py-1 font-mono text-xs font-semibold text-[#ededed] border border-white/[0.06]">
            ROUND 04 / 10
          </span>
          <span className="font-mono text-xs text-[#7c5cff]">
            {currentQ.categoryBadge}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-[#ededed]">
          <Clock className="h-3.5 w-3.5 text-[#7c5cff]" />
          <span className={cn(seconds <= 5 ? "text-[#f43f5e] font-bold animate-pulse" : "")}>
            00:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-3 mb-5">
        <h3 className="text-sm sm:text-base font-medium text-[#ededed] leading-snug">
          {currentQ.question}
        </h3>

        {/* Code Snippet */}
        {currentQ.codeHtml && (
          <div className="rounded-lg border border-white/[0.08] bg-[#07080a] p-3.5 overflow-x-auto shadow-inner">
            {currentQ.codeHtml}
          </div>
        )}
      </div>

      {/* 4 Interactive Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {currentQ.options.map((opt, idx) => {
          const letters = ["A", "B", "C", "D"];
          const isSelected = selectedIndex === idx;
          const isThisCorrect = idx === currentQ.correctIndex;

          let optionStyle =
            "border-white/[0.08] bg-white/[0.02] text-[#ededed] hover:border-white/[0.2] hover:bg-white/[0.04]";

          if (isAnswered) {
            if (isSelected && isThisCorrect) {
              optionStyle = "border-[#10b981] bg-[#10b981]/15 text-white shadow-[0_0_16px_rgba(16,185,129,0.25)]";
            } else if (isSelected && !isThisCorrect) {
              optionStyle = "border-[#f43f5e] bg-[#f43f5e]/15 text-white shadow-[0_0_16px_rgba(244,63,94,0.25)]";
            } else if (isThisCorrect) {
              optionStyle = "border-[#10b981]/60 bg-[#10b981]/5 text-[#ededed]";
            } else {
              optionStyle = "border-white/[0.03] bg-transparent text-[#737373] opacity-40";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all active:scale-[0.99]",
                optionStyle
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-mono font-bold border",
                  isSelected
                    ? "border-current bg-current/20"
                    : "border-white/[0.1] bg-white/[0.04] text-[#a1a1aa]"
                )}
              >
                {letters[idx]}
              </span>
              <span className="font-mono text-xs sm:text-sm text-[#ededed]">
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Answer Explanation Drawer */}
      {isAnswered && (
        <div
          className={cn(
            "rounded-xl border p-4 space-y-2.5 transition-all animate-fade-in-up",
            isCorrect ? "border-[#10b981]/30 bg-[#10b981]/5" : "border-[#f43f5e]/30 bg-[#f43f5e]/5"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <span className="font-mono text-xs font-bold text-[#10b981]">
                    CORRECT CHOICE (+100 PTS + SPEED BONUS)
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-[#f43f5e]" />
                  <span className="font-mono text-xs font-bold text-[#f43f5e]">
                    INCORRECT CHOICE (0 PTS)
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleSwitchTab((activeTab + 1) % DEMO_QUESTIONS.length)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-[#ededed] hover:bg-white/[0.1] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Next Demo Question</span>
            </button>
          </div>

          <p className="text-xs leading-relaxed text-[#a1a1aa] pt-1 border-t border-white/[0.06]">
            <strong className="text-[#ededed]">Mechanism: </strong>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Micro Footer Notice */}
      <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#737373]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#7c5cff]" />
          <span>Real CodeArena duels run 10 server-enforced rounds with full postmortems</span>
        </div>
        <span>SUB-50MS SYNC</span>
      </div>
    </div>
  );
}
