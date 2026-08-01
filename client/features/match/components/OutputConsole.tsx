"use client";

import React from "react";
import { Submission, Example } from "@/types";
import { RunCodeResult } from "../hooks/useSubmission";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, AlertCircle, CheckCircle, Clock, Cpu } from "lucide-react";

interface OutputConsoleProps {
  activeTab: "testcases" | "output";
  setActiveTab: (tab: "testcases" | "output") => void;
  customInput: string;
  setCustomInput: (input: string) => void;
  runResult: RunCodeResult | null;
  submitResult: Submission | null;
  isLoading: boolean;
  examples: Example[];
}

export function OutputConsole({
  activeTab,
  setActiveTab,
  customInput,
  setCustomInput,
  runResult,
  submitResult,
  isLoading,
  examples,
}: OutputConsoleProps) {
  const handleUseExample = (exInput: string) => {
    setCustomInput(exInput);
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "ACCEPTED":
      case "Accepted":
        return "text-emerald-400 border-emerald-500/35 bg-emerald-500/10";
      case "WRONG_ANSWER":
      case "Wrong Answer":
        return "text-rose-400 border-rose-500/35 bg-rose-500/10";
      case "TIME_LIMIT_EXCEEDED":
      case "Time Limit Exceeded":
        return "text-amber-400 border-amber-500/35 bg-amber-500/10";
      case "COMPILATION_ERROR":
      case "Compilation Error":
        return "text-purple-400 border-purple-500/35 bg-purple-500/10";
      default:
        return "text-rose-400 border-rose-500/35 bg-rose-500/10";
    }
  };

  const isAccepted = (verdict: string) => {
    return verdict === "ACCEPTED" || verdict === "Accepted" || verdict === "success";
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-border/80 rounded-xl overflow-hidden shadow-xl">
      {/* Console Tabs */}
      <div className="flex items-center justify-between px-4 bg-zinc-900 border-b border-border/60 shrink-0">
        <div className="flex gap-1.5 py-2">
          <button
            onClick={() => setActiveTab("testcases")}
            className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border transition-all ${
              activeTab === "testcases"
                ? "bg-zinc-950 text-foreground border-border/80 shadow-inner"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            Test Cases
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border transition-all ${
              activeTab === "output"
                ? "bg-zinc-950 text-foreground border-border/80 shadow-inner"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            Console Output
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Executing...
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin">
        {activeTab === "testcases" && (
          <div className="space-y-4 h-full flex flex-col">
            {/* Quick Example Loader */}
            {examples && examples.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                  Quick Examples
                </span>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleUseExample(ex.input)}
                      variant="ghost"
                      size="sm"
                      className="text-xs bg-zinc-900 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-800 rounded-lg font-mono py-1 h-8"
                    >
                      Use Example {idx + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Input Box */}
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                Custom Input (stdin)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Provide standard inputs here..."
                className="w-full flex-1 min-h-[120px] p-3 bg-zinc-950 border border-border/75 text-foreground font-mono text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder:text-zinc-600"
              />
            </div>
          </div>
        )}

        {activeTab === "output" && (
          <div className="space-y-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500 text-xs font-mono gap-3 animate-pulse">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                Compiling and running code against target environment...
              </div>
            )}

            {!isLoading && !runResult && !submitResult && (
              <div className="flex items-center justify-center py-12 text-zinc-600 text-xs font-mono gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Run or Submit code to see execution reports.
              </div>
            )}

            {/* Run Code Result */}
            {!isLoading && runResult && (
              <div className="space-y-4">
                <div className={`p-4 border rounded-xl flex items-center justify-between ${getVerdictStyles(runResult.status.description)}`}>
                  <div className="flex items-center gap-2">
                    {isAccepted(runResult.status.description) ? (
                      <CheckCircle className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span className="font-mono text-sm font-bold uppercase tracking-wider">
                      {runResult.status.description}
                    </span>
                  </div>

                  <div className="flex gap-4 font-mono text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {runResult.time !== null ? `${runResult.time.toFixed(0)} ms` : "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5" />
                      {runResult.memory !== null ? `${runResult.memory.toFixed(2)} MB` : "N/A"}
                    </span>
                  </div>
                </div>

                {runResult.compileOutput && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                      Compile Errors
                    </span>
                    <pre className="p-3 bg-purple-950/15 border border-purple-500/20 text-purple-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {runResult.compileOutput}
                    </pre>
                  </div>
                )}

                {runResult.stderr && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-rose-400 uppercase font-mono tracking-wider">
                      Runtime Errors
                    </span>
                    <pre className="p-3 bg-rose-950/15 border border-rose-500/20 text-rose-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {runResult.stderr}
                    </pre>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                    Standard Output (stdout)
                  </span>
                  <pre className="p-3 bg-zinc-950 border border-border/80 text-foreground rounded-xl font-mono text-xs overflow-x-auto min-h-[60px]">
                    {runResult.stdout || <span className="text-zinc-600 font-semibold italic">No output received</span>}
                  </pre>
                </div>
              </div>
            )}

            {/* Submit Solution Result */}
            {!isLoading && submitResult && (
              <div className="space-y-4">
                <div className={`p-4 border rounded-xl flex flex-wrap items-center justify-between gap-4 ${getVerdictStyles(submitResult.verdict)}`}>
                  <div className="flex items-center gap-2">
                    {isAccepted(submitResult.verdict) ? (
                      <CheckCircle className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <div className="space-y-0.5">
                      <span className="font-mono text-sm font-bold uppercase tracking-wider block">
                        {submitResult.verdict.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] opacity-80 font-semibold font-mono block">
                        Passed {submitResult.passedTestCases} / {submitResult.totalTestCases} Test Cases
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 font-mono text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {submitResult.executionTime} ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5" />
                      {submitResult.memoryUsed.toFixed(2)} MB
                    </span>
                  </div>
                </div>

                {submitResult.compileOutput && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                      Compile Output
                    </span>
                    <pre className="p-3 bg-purple-950/15 border border-purple-500/20 text-purple-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {submitResult.compileOutput}
                    </pre>
                  </div>
                )}

                {submitResult.stderr && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-rose-400 uppercase font-mono tracking-wider">
                      Standard Error
                    </span>
                    <pre className="p-3 bg-rose-950/15 border border-rose-500/20 text-rose-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {submitResult.stderr}
                    </pre>
                  </div>
                )}

                {submitResult.stdout && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                      Standard Output
                    </span>
                    <pre className="p-3 bg-zinc-950 border border-border/80 text-foreground rounded-xl font-mono text-xs overflow-x-auto">
                      {submitResult.stdout}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputConsole;
