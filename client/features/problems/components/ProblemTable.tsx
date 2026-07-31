"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Code } from "lucide-react";
import { Problem } from "@/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { buttonVariants } from "@/components/ui/button";

interface ProblemTableProps {
  problems: Problem[];
}

export function ProblemTable({ problems }: ProblemTableProps) {
  // Human readable format for topic string
  const formatTopic = (topic: string) => {
    if (!topic) return "";
    return topic.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Problem Title
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Topic
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Difficulty
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Reward Points
              </th>
              <th className="p-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-card/40">
            {problems.map((problem) => (
              <tr
                key={problem._id}
                className="hover:bg-muted/10 transition-colors group"
              >
                {/* Title */}
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href={`/problems/${problem.slug}`}
                      className="font-bold text-foreground hover:text-primary transition-colors text-sm sm:text-base"
                    >
                      {problem.title}
                    </Link>
                    <span className="text-xs text-muted-foreground font-mono">
                      points: {problem.points || 10} • time: {problem.timeLimit || 2}s
                    </span>
                  </div>
                </td>

                {/* Topic */}
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-sm text-foreground/80 font-medium bg-secondary/30 px-2.5 py-1 rounded-md border border-border/40">
                    <Code className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatTopic(problem.topic)}
                  </span>
                </td>

                {/* Difficulty */}
                <td className="p-4">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>

                {/* Reward Points */}
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-foreground/90 font-mono text-sm font-semibold">
                    <Trophy className="h-4 w-4 text-orange-500" />
                    {problem.points || 10} pts
                  </div>
                </td>

                {/* Action Solve Link */}
                <td className="p-4 text-right">
                  <Link
                    href={`/problems/${problem.slug}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "border border-border text-xs gap-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 cursor-pointer",
                    })}
                  >
                    Solve
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProblemTable;
