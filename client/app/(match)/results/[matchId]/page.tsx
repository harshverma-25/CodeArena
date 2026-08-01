"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useMatch } from "@/features/match/hooks/useMatch";
import { useMatchSubmissions } from "@/features/match/hooks/useMatchSubmissions";
import { useBattleStore } from "@/store/battleStore";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { registerCodeArenaTheme, CODEARENA_THEME_NAME, DEFAULT_MONACO_OPTIONS } from "@/lib/monaco";
import { Trophy, Frown, Award, Clock, Code, Home, RefreshCw, BarChart2, BookOpen } from "lucide-react";

export default function MatchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { data: dbUser, isLoading: userLoading } = useCurrentUser();
  const { data: match, isLoading: matchLoading } = useMatch(matchId);
  const { data: submissions = [], isLoading: subsLoading } = useMatchSubmissions(matchId);

  const { resetBattle } = useBattleStore();
  const [activeCodeTab, setActiveCodeTab] = useState<"me" | "opponent">("me");

  useEffect(() => {
    // Reset store states when visiting results to clear lobby connections
    resetBattle();
  }, [resetBattle]);

  if (userLoading || matchLoading || subsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        Generating battle report cards...
      </div>
    );
  }

  if (!match || !dbUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-4">
        <Frown className="h-8 w-8 text-rose-500" />
        <span>Match result not found or expired.</span>
        <Button onClick={() => router.push("/dashboard")} className="font-mono text-xs">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const opponent = match.players.find((p) => p.user?._id !== dbUser._id)?.user;
  const opponentName = opponent?.displayName || opponent?.username || "Opponent";

  // Submissions calculation
  const mySubs = submissions.filter((s) => s.userId?._id === dbUser._id);
  const oppSubs = submissions.filter((s) => s.userId?._id === opponent?._id);

  // Final code templates
  const myLastAccepted = mySubs.find((s) => s.verdict === "ACCEPTED");
  const myFinalCode = myLastAccepted?.sourceCode || mySubs[mySubs.length - 1]?.sourceCode || "";
  const myFinalLang = myLastAccepted?.language || mySubs[mySubs.length - 1]?.language || "javascript";

  const oppLastAccepted = oppSubs.find((s) => s.verdict === "ACCEPTED");
  const oppFinalCode = oppLastAccepted?.sourceCode || oppSubs[oppSubs.length - 1]?.sourceCode || "";
  const oppFinalLang = oppLastAccepted?.language || oppSubs[oppSubs.length - 1]?.language || "javascript";

  // Match outcome definition
  let outcome: "victory" | "defeat" | "draw" = "draw";
  if (match.winner) {
    outcome = match.winner._id === dbUser._id ? "victory" : "defeat";
  }

  const outcomeDetails = {
    victory: {
      title: "Victory",
      desc: "You outcoded the arena! Keep the streak hot.",
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/35 shadow-amber-500/5",
      icon: <Trophy className="h-12 w-12 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />,
    },
    defeat: {
      title: "Defeat",
      desc: "An honorable battle. Analyze your code templates to improve.",
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/35 shadow-rose-500/5",
      icon: <Frown className="h-12 w-12 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />,
    },
    draw: {
      title: "Draw",
      desc: "Time expired without an accepted submission from either competitor.",
      colorClass: "text-zinc-400 bg-zinc-500/10 border-zinc-500/35 shadow-zinc-500/5",
      icon: <Award className="h-12 w-12 text-zinc-400" />,
    },
  };

  const currentOutcome = outcomeDetails[outcome];

  const handleEditorDidMount = (editor: any, monaco: any) => {
    registerCodeArenaTheme(monaco);
    monaco.editor.setTheme(CODEARENA_THEME_NAME);
  };

  const getMonacoLanguage = (lang: string): string => {
    const formatted = lang.toLowerCase();
    if (formatted === "cpp") return "cpp";
    if (formatted === "python") return "python";
    if (formatted === "java") return "java";
    if (formatted === "typescript") return "typescript";
    return "javascript";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground p-6 md:p-10 flex flex-col items-center overflow-y-auto scrollbar-thin">
      <div className="w-full max-w-5xl space-y-8 flex-1 flex flex-col">
        {/* Outcome Card */}
        <div className={`p-8 border rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-2xl backdrop-blur-md shrink-0 ${currentOutcome.colorClass}`}>
          <div className="shrink-0">{currentOutcome.icon}</div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h1 className="text-3xl font-black font-mono uppercase tracking-wider">
              {currentOutcome.title}
            </h1>
            <p className="text-sm opacity-85 leading-relaxed max-w-xl">
              {currentOutcome.desc}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-zinc-900 border border-border/80 text-foreground hover:bg-zinc-800 font-mono text-xs uppercase tracking-wider gap-1.5 h-10 px-5 rounded-lg shadow-sm"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <div className="bg-zinc-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col font-mono text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Assigned Problem</span>
              <span className="font-black text-foreground mt-0.5 max-w-[200px] truncate">
                {match.problem?.title || "N/A"}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col font-mono text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Total Duration</span>
              <span className="font-black text-foreground mt-0.5">
                {match.duration ? `${Math.floor(match.duration / 60)}m ${match.duration % 60}s` : "Time Expired"}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col font-mono text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Topic</span>
              <span className="font-black text-foreground mt-0.5 uppercase">
                {match.problem?.topic || "Algorithm"}
              </span>
            </div>
          </div>
        </div>

        {/* Code Comparison Workspace */}
        <div className="flex-1 flex flex-col bg-zinc-900/60 border border-border/60 rounded-2xl shadow-xl overflow-hidden min-h-[450px]">
          {/* Header Panel */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-border/60 bg-zinc-900 shrink-0">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">
                Submission Workspace Code
              </span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 border border-border/50 rounded-lg">
              <button
                onClick={() => setActiveCodeTab("me")}
                className={`px-3 py-1 text-[10px] font-bold font-mono uppercase rounded-md transition-all ${
                  activeCodeTab === "me" ? "bg-zinc-800 text-foreground" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                My Solution ({mySubs.length} attempts)
              </button>
              <button
                onClick={() => setActiveCodeTab("opponent")}
                className={`px-3 py-1 text-[10px] font-bold font-mono uppercase rounded-md transition-all ${
                  activeCodeTab === "opponent" ? "bg-zinc-800 text-foreground" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {opponentName}&apos;s Solution ({oppSubs.length} attempts)
              </button>
            </div>
          </div>

          {/* Editor Workspace */}
          <div className="flex-1 min-h-0 bg-[#09090b]">
            {activeCodeTab === "me" && (
              myFinalCode ? (
                <Editor
                  height="100%"
                  language={getMonacoLanguage(myFinalLang)}
                  value={myFinalCode}
                  onMount={handleEditorDidMount}
                  theme={CODEARENA_THEME_NAME}
                  options={{ ...DEFAULT_MONACO_OPTIONS, readOnly: true, lineNumbers: "on" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs">
                  No submissions recorded for your user.
                </div>
              )
            )}

            {activeCodeTab === "opponent" && (
              oppFinalCode ? (
                <Editor
                  height="100%"
                  language={getMonacoLanguage(oppFinalLang)}
                  value={oppFinalCode}
                  onMount={handleEditorDidMount}
                  theme={CODEARENA_THEME_NAME}
                  options={{ ...DEFAULT_MONACO_OPTIONS, readOnly: true, lineNumbers: "on" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs">
                  No submissions recorded for {opponentName}.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
