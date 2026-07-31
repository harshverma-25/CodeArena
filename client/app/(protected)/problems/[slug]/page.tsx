"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Trophy, Clock, Cpu, Award, PlayCircle, Swords, BookOpen, AlertCircle } from "lucide-react";
import { useProblemBySlug, DifficultyBadge } from "@/features/problems";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProblemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: problem, isLoading, isError, error, refetch } = useProblemBySlug(slug);

  const formatTopic = (topic: string) => {
    if (!topic) return "";
    return topic.replace(/([A-Z])/g, " $1").trim();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
        {/* Back Link */}
        <div className="h-4 w-28 rounded bg-secondary" />
        
        {/* Title Block */}
        <div className="space-y-3">
          <div className="h-8 w-2/3 rounded bg-secondary" />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-secondary" />
            <div className="h-5 w-24 rounded-full bg-secondary" />
          </div>
        </div>

        {/* Spec blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-border bg-card" />
          ))}
        </div>

        {/* Description block */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="h-4 w-1/4 rounded bg-secondary" />
          <div className="h-4 w-full rounded bg-secondary" />
          <div className="h-4 w-full rounded bg-secondary" />
          <div className="h-4 w-4/5 rounded bg-secondary" />
        </div>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="mx-auto max-w-xl text-center p-8 border border-destructive/20 bg-destructive/5 rounded-2xl space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-foreground">Failed to load problem details</h3>
        <p className="text-sm text-muted-foreground">
          {error?.message || "We encountered an issue fetching this coding challenge specifications."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/problems"
            className={buttonVariants({ variant: "ghost", className: "border border-border text-foreground" })}
          >
            Back to Arena
          </Link>
          <Button onClick={() => refetch()} className="bg-primary text-primary-foreground">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Back Link Navigation */}
      <Link
        href="/problems"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors font-mono"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Arena
      </Link>

      {/* Title & Badge Metadata */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {problem.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-secondary/50 px-2.5 py-0.5 rounded border border-border">
            <BookOpen className="h-3.5 w-3.5" />
            {formatTopic(problem.topic)}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            points: {problem.points || 10}
          </span>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Stat item: Points */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between shadow-md">
          <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
            Reward Score
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-foreground font-mono font-bold text-lg">
            <Award className="h-4.5 w-4.5 text-orange-500" />
            {problem.points || 10} pts
          </div>
        </div>

        {/* Stat item: Time Limit */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between shadow-md">
          <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
            Time Limit
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-foreground font-mono font-bold text-lg">
            <Clock className="h-4.5 w-4.5 text-primary" />
            {problem.timeLimit || 2}s
          </div>
        </div>

        {/* Stat item: Memory Limit */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between shadow-md">
          <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
            Memory Limit
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-foreground font-mono font-bold text-lg">
            <Cpu className="h-4.5 w-4.5 text-blue-500" />
            {problem.memoryLimit || 256} MB
          </div>
        </div>

        {/* Stat item: Submissions */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between shadow-md">
          <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
            Status
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-foreground font-mono font-bold text-lg text-emerald-500">
            <Trophy className="h-4.5 w-4.5" />
            Active
          </div>
        </div>
      </div>

      {/* Main Specifications Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Description Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-foreground border-b border-border/40 pb-2">
            Problem Statement
          </h2>
          <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {problem.description}
          </div>
        </div>

        {/* Input/Output Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Input Format
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {problem.inputFormat || "Standard inputs are loaded sequentially."}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Output Format
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {problem.outputFormat || "Expect standard return formats."}
            </p>
          </div>
        </div>

        {/* Constraints */}
        {problem.constraints && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Constraints
            </h3>
            <div className="text-sm text-foreground/80 font-mono bg-secondary/20 p-3 rounded-lg border border-border/40 whitespace-pre-wrap">
              {problem.constraints}
            </div>
          </div>
        )}

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Examples</h3>
            <div className="space-y-4">
              {problem.examples.map((example, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3">
                  <h4 className="text-sm font-bold text-foreground">Example {i + 1}</h4>
                  <div className="space-y-2 font-mono text-xs text-foreground bg-background border border-border/60 p-4 rounded-xl">
                    <div>
                      <span className="text-primary font-bold">Input:</span>{" "}
                      <span className="break-all">{example.input}</span>
                    </div>
                    <div>
                      <span className="text-success font-bold">Output:</span>{" "}
                      <span className="break-all">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div className="mt-2 pt-2 border-t border-border/45 text-muted-foreground">
                        <span className="font-bold text-foreground/80">Explanation:</span>{" "}
                        {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Tags:
            </span>
            <div className="flex gap-2 flex-wrap">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded bg-secondary/50 text-foreground/80 border border-border/45 text-xs font-medium font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 border-t border-border/40 pt-6">
          <Link
            href={`/problems/${problem.slug}/solve`}
            className={cn(
              buttonVariants({ variant: "primary", className: "flex-1 cursor-pointer gap-2 h-12 text-sm" })
            )}
          >
            <PlayCircle className="h-5 w-5" />
            Practice Solution
          </Link>
          <Link
            href={`/battle/new?problemId=${problem._id}`}
            className={cn(
              buttonVariants({ variant: "ghost", className: "flex-1 cursor-pointer gap-2 h-12 text-sm border border-border bg-card hover:bg-secondary/45 text-foreground" })
            )}
          >
            <Swords className="h-5 w-5 text-primary" />
            Challenge with Battle Room
          </Link>
        </div>
      </div>
    </div>
  );
}
