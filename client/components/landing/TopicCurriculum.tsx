"use client";

import React, { useState } from "react";
import { Binary, Code2, Database, Cpu, Network, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumTopic {
  id: string;
  name: string;
  shortCode: string;
  icon: React.ElementType;
  difficulty: "Easy" | "Medium" | "Hard";
  focusAreas: string[];
  sampleTitle: string;
  sampleQuestion: string;
  sampleSolutionExcerpt: string;
}

const TOPICS: CurriculumTopic[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortCode: "DSA // CORE",
    icon: Binary,
    difficulty: "Hard",
    focusAreas: [
      "Balanced BSTs (AVL, Red-Black)",
      "Amortized Complexity Bounds",
      "Graph Topological Ordering",
      "Dynamic Programming Invariants",
    ],
    sampleTitle: "Worst-case Tree Traversal Bounds",
    sampleQuestion:
      "Given an AVL tree with height h, what is the maximum number of structural rotations required to rebalance after a single deletion operation?",
    sampleSolutionExcerpt:
      "Unlike insertion which requires at most two rotations (O(1)), a single deletion in an AVL tree may propagate imbalance up to the root, requiring O(log N) rotations in the worst case.",
  },
  {
    id: "js",
    name: "JavaScript & Web Runtimes",
    shortCode: "JS // V8 ENGINE",
    icon: Code2,
    difficulty: "Medium",
    focusAreas: [
      "V8 Microtask Queue Drain Phase",
      "Lexical Closures & Scope Chains",
      "Prototype Delegation & V8 Hidden Classes",
      "Event Loop Macrotask Turn Timing",
    ],
    sampleTitle: "Microtask Queue Drain Sequencing",
    sampleQuestion:
      "In what exact sequence does the V8 runtime process pending Promise microtasks relative to requestAnimationFrame and setImmediate?",
    sampleSolutionExcerpt:
      "Microtasks drain immediately when the active JavaScript execution stack empties, before any subsequent animation frame callbacks or timer macrotasks are processed.",
  },
  {
    id: "dbms",
    name: "Database Systems & SQL",
    shortCode: "DBMS // STORAGE",
    icon: Database,
    difficulty: "Hard",
    focusAreas: [
      "ACID Isolation Levels & Anomalies",
      "B+Tree Leaf Fanout & Depth",
      "Write-Ahead Logging (WAL) & ARIES",
      "Index Scan vs Index Seek Costing",
    ],
    sampleTitle: "MVCC Phantom Record Suppression",
    sampleQuestion:
      "Under PostgreSQL Multi-Version Concurrency Control (MVCC), why does Repeatable Read still prevent non-repeatable reads but not serialization failures?",
    sampleSolutionExcerpt:
      "Repeatable Read takes a snapshot at query start. Concurrent updates to the same row cause transaction abortion under first-committer-wins rules.",
  },
  {
    id: "os",
    name: "Operating Systems & Concurrency",
    shortCode: "OS // KERNEL",
    icon: Cpu,
    difficulty: "Hard",
    focusAreas: [
      "Virtual Memory & TLB Invalidation",
      "Mutex Inversion & Spinlocks",
      "Process Scheduling Quantum Bounds",
      "Page Replacement (LRU, Clock)",
    ],
    sampleTitle: "Translation Lookaside Buffer Invalidation",
    sampleQuestion:
      "What hardware/kernel event mandates a full flush of the TLB across all CPU cores?",
    sampleSolutionExcerpt:
      "A context switch between distinct address spaces (processes) or modifying page table entries without ASID (Address Space Identifier) tagging mandates a TLB shootdown across cores.",
  },
  {
    id: "cn",
    name: "Computer Networks & Protocols",
    shortCode: "NET // TRANSPORT",
    icon: Network,
    difficulty: "Medium",
    focusAreas: [
      "TCP 3-Way Handshake & TIME_WAIT",
      "TLS 1.3 0-RTT Handshake Invariants",
      "Congestion Control (CUBIC, BBR)",
      "DNS Recursion & TTL Caching",
    ],
    sampleTitle: "TCP TIME_WAIT State Duration",
    sampleQuestion:
      "What is the core RFC 793 rationale for maintaining a TCP socket in TIME_WAIT for 2MSL (Maximum Segment Lifetime)?",
    sampleSolutionExcerpt:
      "To ensure lingering duplicate segments from the closed connection are fully absorbed by the network before the same IP/port tuple can be reused by a new connection.",
  },
];

export function TopicCurriculum() {
  const [selectedTopicId, setSelectedTopicId] = useState("dsa");
  const activeTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  return (
    <section id="curriculum" className="w-full py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl space-y-2 pb-12 border-b border-border">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span>Curated Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            High-yield computer science topics.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Questions are crafted specifically to assess conceptual rigor, deep runtime understanding, and problem-solving speed under pressure.
          </p>
        </div>

        {/* Curriculum Layout: Left tabs, Right preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 items-start">
          {/* Left Topic Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-2 font-mono">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isActive = topic.id === selectedTopicId;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-md border text-left transition-all cursor-pointer",
                    isActive
                      ? "border-foreground bg-surface-elevated text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <div>
                      <div className="font-bold text-sm tracking-tight text-foreground">{topic.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{topic.shortCode}</div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-border bg-background">
                    {topic.difficulty}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Topic Detail Preview Card */}
          <div className="lg:col-span-7 rounded-lg border border-border bg-surface p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border font-mono text-xs">
              <span className="text-foreground font-bold tracking-wider uppercase">
                {activeTopic.shortCode}
              </span>
              <span className="text-muted-foreground">
                Verified Question Bank // Production-Level
              </span>
            </div>

            {/* Core Focus Areas */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Primary Assessment Focus Areas
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {activeTopic.focusAreas.map((area, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded border border-border bg-background text-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Question Excerpt */}
            <div className="space-y-3 pt-2">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Sample Challenge Excerpt
              </div>
              <div className="p-4 rounded border border-border bg-background space-y-2">
                <div className="font-bold text-foreground text-sm leading-snug">
                  {activeTopic.sampleQuestion}
                </div>
                <div className="pt-2 border-t border-border font-mono text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold">Solution Preview: </span>
                  {activeTopic.sampleSolutionExcerpt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default TopicCurriculum;
