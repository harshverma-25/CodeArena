"use client";

import React from "react";
import { Problem } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, Hash, Info } from "lucide-react";

interface ProblemPanelProps {
  problem: Problem | null;
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  if (!problem) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-8">
        <Info className="h-5 w-5 mr-2 animate-pulse" />
        No problem description loaded.
      </div>
    );
  }

  const difficultyColors = {
    Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    Medium: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    Hard: "text-rose-400 bg-rose-500/10 border-rose-500/25",
  };

  return (
    <Card className="h-full flex flex-col bg-card/65 border-border rounded-xl shadow-lg overflow-hidden backdrop-blur-md">
      <CardHeader className="border-b border-border/80 px-6 py-4 flex flex-row items-center justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded border border-border/50">
              <Hash className="h-3 w-3" />
              {problem.topic}
            </span>
          </div>
          <CardTitle className="text-xl font-extrabold text-foreground tracking-tight font-mono">
            {problem.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold font-mono bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          <Award className="h-4 w-4" />
          {problem.points} PTS
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
        {/* Description */}
        <div className="prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {problem.description}
        </div>

        {/* Input Format */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase font-mono">Input Format</h3>
          <div className="p-3 bg-secondary/25 border border-border/60 rounded-xl text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
            {problem.inputFormat}
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase font-mono">Output Format</h3>
          <div className="p-3 bg-secondary/25 border border-border/60 rounded-xl text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
            {problem.outputFormat}
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground tracking-wider uppercase font-mono">Constraints</h3>
          <div className="p-3 bg-secondary/25 border border-border/60 rounded-xl text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
            {problem.constraints}
          </div>
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground tracking-wider uppercase font-mono">Examples</h3>
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="space-y-2 border-l-2 border-primary/40 pl-3">
                <h4 className="text-xs font-bold text-primary font-mono">Example {idx + 1}</h4>
                <div className="space-y-2 bg-secondary/20 border border-border/50 rounded-xl p-3.5 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground font-semibold">Input:</span>
                    <pre className="mt-1 p-2 bg-black/35 rounded border border-border/40 text-foreground overflow-x-auto">{ex.input}</pre>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold">Output:</span>
                    <pre className="mt-1 p-2 bg-black/35 rounded border border-border/40 text-foreground overflow-x-auto">{ex.output}</pre>
                  </div>
                  {ex.explanation && (
                    <div className="text-muted-foreground/80 leading-relaxed pt-1">
                      <span className="font-semibold text-muted-foreground">Explanation:</span> {ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default ProblemPanel;
