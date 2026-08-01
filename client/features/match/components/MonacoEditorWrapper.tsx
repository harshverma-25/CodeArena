"use client";

import React, { useEffect, useState, useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Problem } from "@/types";
import { registerCodeArenaTheme, CODEARENA_THEME_NAME, DEFAULT_MONACO_OPTIONS } from "@/lib/monaco";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Send, CheckCircle } from "lucide-react";

interface MonacoEditorWrapperProps {
  matchId: string;
  problem: Problem | null;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  code: string;
  setCode: (code: string) => void;
  onRunCode: () => void;
  onSubmitSolution: () => void;
  isExecuting: boolean;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

export function MonacoEditorWrapper({
  matchId,
  problem,
  selectedLanguage,
  setSelectedLanguage,
  code,
  setCode,
  onRunCode,
  onSubmitSolution,
  isExecuting,
}: MonacoEditorWrapperProps) {
  const [isSaved, setIsSaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set default starter code or load from localStorage on language change
  useEffect(() => {
    if (!problem) return;

    const cacheKey = `codearena:match:${matchId}:${selectedLanguage}`;
    const cachedCode = localStorage.getItem(cacheKey);

    if (cachedCode) {
      setCode(cachedCode);
    } else {
      // Find matching key in starterCode map/record
      const starterCodeMap = problem.starterCode || {};
      const key = Object.keys(starterCodeMap).find(
        (k) => k.toLowerCase() === selectedLanguage.toLowerCase()
      );
      setCode(key ? starterCodeMap[key] : "");
    }
  }, [selectedLanguage, problem, matchId, setCode]);

  // Handle editor edits with auto-save to localStorage
  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    setIsSaved(false);

    // Cache code to localStorage
    localStorage.setItem(`codearena:match:${matchId}:${selectedLanguage}`, newCode);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setIsSaved(true);
    }, 1000);
  };

  const handleResetCode = () => {
    if (!problem) return;
    const confirmReset = window.confirm("Are you sure you want to reset your code to the template?");
    if (!confirmReset) return;

    const starterCodeMap = problem.starterCode || {};
    const key = Object.keys(starterCodeMap).find(
      (k) => k.toLowerCase() === selectedLanguage.toLowerCase()
    );
    const originalTemplate = key ? starterCodeMap[key] : "";
    setCode(originalTemplate);
    localStorage.setItem(`codearena:match:${matchId}:${selectedLanguage}`, originalTemplate);
    setIsSaved(true);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    registerCodeArenaTheme(monaco);
    monaco.editor.setTheme(CODEARENA_THEME_NAME);
  };

  // Maps display language key to monaco language identifiers
  const getMonacoLanguage = (lang: string): string => {
    switch (lang) {
      case "cpp":
        return "cpp";
      case "python":
        return "python";
      case "java":
        return "java";
      case "typescript":
        return "typescript";
      default:
        return "javascript";
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-border/80 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isExecuting}
            className="h-9 px-3 bg-zinc-950 border border-border/60 text-foreground text-xs font-mono font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Save Status */}
          <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
            <CheckCircle className={`h-3 w-3 ${isSaved ? "text-emerald-400" : "text-zinc-600 animate-pulse"}`} />
            {isSaved ? "Saved" : "Saving..."}
          </div>
        </div>

        {/* Reset Template */}
        <Button
          onClick={handleResetCode}
          disabled={isExecuting || !problem}
          variant="ghost"
          className="h-8 px-2.5 text-zinc-400 hover:text-foreground text-xs hover:bg-zinc-800 rounded-lg gap-1 font-mono"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0 bg-[#09090b]">
        <Editor
          height="100%"
          language={getMonacoLanguage(selectedLanguage)}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={CODEARENA_THEME_NAME}
          options={DEFAULT_MONACO_OPTIONS}
          loading={
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground font-mono text-xs gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              Compiling Editor Assets...
            </div>
          }
        />
      </div>

      {/* Code Execution Control Row */}
      <div className="flex items-center justify-end gap-3 px-4 py-3 bg-zinc-900 border-t border-border/60 shrink-0">
        <Button
          onClick={onRunCode}
          disabled={isExecuting || !problem}
          variant="ghost"
          className="border border-border/80 text-foreground hover:bg-zinc-800 h-10 px-5 gap-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm"
        >
          <Play className="h-4 w-4 fill-current" />
          Run Code
        </Button>

        <Button
          onClick={onSubmitSolution}
          disabled={isExecuting || !problem}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 h-10 px-5 gap-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg"
        >
          <Send className="h-4 w-4" />
          Submit Solution
        </Button>
      </div>
    </div>
  );
}
export default MonacoEditorWrapper;
