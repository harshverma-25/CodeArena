"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Binary, Code2, Database, HardDrive, Network, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicItem {
  id: string;
  name: string;
  shortTag: string;
  icon: React.ElementType;
  focusAreas: string[];
  challengeTitle: string;
  sampleQuestion: string;
  options: string[];
  correct: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const DISCIPLINES: TopicItem[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortTag: "DSA",
    icon: Binary,
    difficulty: "Medium",
    focusAreas: ["Self-Balancing Trees", "Dynamic Programming", "Graph Topo Sort", "Amortized Bounds"],
    challengeTitle: "Binary Search Tree Invariants",
    sampleQuestion: "What is the tightest worst-case lookup time in a balanced BST containing N elements?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correct: "O(log N) — guaranteed by balanced height bounds.",
  },
  {
    id: "js",
    name: "JavaScript & Web Runtime",
    shortTag: "JavaScript",
    icon: Code2,
    difficulty: "Hard",
    focusAreas: ["V8 Event Loop", "Microtask Queues", "Closure Scopes", "Prototypal Chains"],
    challengeTitle: "Microtask Queue Drain Order",
    sampleQuestion: "In what exact phase do Promise.then microtasks drain relative to process.nextTick and setTimeout?",
    options: ["Before nextTick", "Immediately after current task", "After timer poll phase", "In idle check phase"],
    correct: "Immediately after the current synchronous frame and before next macrotask.",
  },
  {
    id: "dbms",
    name: "Database Systems & SQL",
    shortTag: "DBMS",
    icon: Database,
    difficulty: "Hard",
    focusAreas: ["ACID Isolation Levels", "B+ Tree Fanout", "WAL Logging", "Index Seek vs Scan"],
    challengeTitle: "Transaction Anomalies under MVCC",
    sampleQuestion: "Which ANSI SQL isolation level guarantees elimination of phantom reads?",
    options: ["Read Committed", "Repeatable Read", "Serializable", "Read Uncommitted"],
    correct: "Serializable — prevents phantom rows via range locks or SSI.",
  },
  {
    id: "os",
    name: "Operating Systems & Concurrency",
    shortTag: "OS",
    icon: HardDrive,
    difficulty: "Medium",
    focusAreas: ["Process Scheduling", "Deadlock Prevention", "Virtual Memory & TLB", "Mutex vs Semaphore"],
    challengeTitle: "Memory Hierarchy & Page Faults",
    sampleQuestion: "What hardware component caches recent virtual-to-physical address translations?",
    options: ["L1 Cache", "Translation Lookaside Buffer (TLB)", "Instruction Register", "MMU Controller"],
    correct: "Translation Lookaside Buffer (TLB).",
  },
  {
    id: "cn",
    name: "Computer Networks & Protocols",
    shortTag: "Networks",
    icon: Network,
    difficulty: "Medium",
    focusAreas: ["TCP Handshakes", "CUBIC Congestion", "TLS 1.3 0-RTT", "DNS Propagation"],
    challengeTitle: "TCP Flow & Congestion Control",
    sampleQuestion: "Which TCP event triggers Fast Retransmit without waiting for the retransmission timer?",
    options: ["FIN packet", "3 duplicate ACKs", "RST flag", "SYN-ACK timeout"],
    correct: "Receipt of 3 duplicate ACKs.",
  },
  {
    id: "systems",
    name: "OOP & Systems Engineering",
    shortTag: "OOP / C++ / Java",
    icon: Layers,
    difficulty: "Hard",
    focusAreas: ["Virtual Tables (V-Table)", "RAII & Smart Pointers", "Memory Alignment", "SOLID Patterns"],
    challengeTitle: "Virtual Method Table Overhead",
    sampleQuestion: "Where is the vptr stored for a C++ class instance with virtual methods?",
    options: ["In the heap", "First 8 bytes of object instance", "In the class descriptor", "In the code segment"],
    correct: "First 8 bytes of the object instance memory layout.",
  },
];

export function CurriculumGrid() {
  const [selectedId, setSelectedId] = useState("dsa");
  const activeDiscipline = DISCIPLINES.find((d) => d.id === selectedId) || DISCIPLINES[0];

  return (
    <section id="curriculum" className="py-16 sm:py-20 border-t border-white/[0.06] space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-2.5 py-0.5 font-mono text-[11px] text-[#7c5cff]">
            <span>TECHNICAL SPECIFICATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ededed]">
            Tested on what breaks in production.
          </h2>
          <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            No memorized dictionary trivia. Challenges test real runtime edge cases, algorithmic complexities, and database guarantees.
          </p>
        </div>

        <Link
          href="/battle/new"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#7c5cff] hover:text-[#8f73ff] transition-colors self-start sm:self-auto"
        >
          <span>Pick a topic and duel</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Interactive Two-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Topic Selectors */}
        <div className="lg:col-span-5 space-y-2">
          {DISCIPLINES.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === selectedId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "w-full flex items-center justify-between rounded-xl border p-3.5 sm:p-4 text-left transition-all",
                  isSelected
                    ? "border-[#7c5cff]/60 bg-white/[0.04] shadow-[0_0_20px_rgba(124,92,255,0.12)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border",
                      isSelected
                        ? "border-[#7c5cff]/50 bg-[#7c5cff]/15 text-[#7c5cff]"
                        : "border-white/[0.08] bg-white/[0.04] text-[#a1a1aa]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-[#ededed]">
                      {item.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#737373]">
                      {item.shortTag} • {item.difficulty}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    "font-mono text-xs transition-transform",
                    isSelected ? "text-[#7c5cff] translate-x-0.5" : "text-[#52525b]"
                  )}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* Right 7 Cols: Active Challenge Telemetry Card */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0d11] p-5 sm:p-6 space-y-5">
          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7c5cff]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#ededed]">
                Challenge Sample // {activeDiscipline.shortTag}
              </span>
            </div>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[#a1a1aa] border border-white/[0.06]">
              {activeDiscipline.difficulty} Difficulty
            </span>
          </div>

          {/* Title & Question */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#7c5cff]">
              [{activeDiscipline.challengeTitle}]
            </h4>
            <p className="text-sm sm:text-base font-medium text-[#ededed] leading-relaxed">
              &ldquo;{activeDiscipline.sampleQuestion}&rdquo;
            </p>
          </div>

          {/* Options Display */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {activeDiscipline.options.map((opt, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-[#a1a1aa]"
              >
                <span className="text-[#737373] mr-2">0{i + 1}.</span>
                <span className="text-[#ededed]">{opt}</span>
              </div>
            ))}
          </div>

          {/* Correct Takeaway */}
          <div className="rounded-lg border border-[#10b981]/20 bg-[#10b981]/5 p-3 font-mono text-xs text-[#10b981]">
            <span className="font-bold">Correct Rationale: </span>
            <span className="text-[#ededed]">{activeDiscipline.correct}</span>
          </div>

          {/* Focus Tags */}
          <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[#737373]">KEY CONCEPTS:</span>
            {activeDiscipline.focusAreas.map((tag, i) => (
              <span
                key={i}
                className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#a1a1aa]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
