"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useMatch } from "@/features/match/hooks/useMatch";
import { useMatchSocket } from "@/features/match/hooks/useMatchSocket";
import { useSubmission } from "@/features/match/hooks/useSubmission";
import { useBattleStore } from "@/store/battleStore";
import { ProblemPanel } from "@/features/match/components/ProblemPanel";
import { MonacoEditorWrapper } from "@/features/match/components/MonacoEditorWrapper";
import { OutputConsole } from "@/features/match/components/OutputConsole";
import { MatchHeader } from "@/features/match/components/MatchHeader";
import { RefreshCw, ShieldAlert, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchArenaPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { data: dbUser, isLoading: userLoading } = useCurrentUser();
  const { data: match, isLoading: matchLoading, error: matchError } = useMatch(matchId);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");

  const {
    setMatchId,
    setTimeRemaining,
    setStatus,
    setMyUserId,
    resetBattle,
  } = useBattleStore();

  // Socket communication synchronization
  const { isConnected: socketConnected } = useMatchSocket(
    match?.roomCode,
    matchId,
    dbUser?._id
  );

  // Run Code and Submission state hooks
  const {
    runCode,
    submitSolution,
    runResult,
    submitResult,
    activeTab,
    setActiveTab,
    isLoading: executionLoading,
  } = useSubmission(matchId);

  // Sync loaded match information with Battle Store state
  useEffect(() => {
    if (!match || !dbUser) return;

    setMatchId(match._id);
    setMyUserId(dbUser._id);

    // Calculate dynamic time remaining based on startedAt
    const durationSeconds = (match as any).duration || 1800; // default 30 mins
    const elapsedSeconds = Math.round(
      (Date.now() - new Date(match.startedAt).getTime()) / 1000
    );
    const remaining = Math.max(0, durationSeconds - elapsedSeconds);

    setTimeRemaining(remaining);
    setStatus(match.status === "IN_PROGRESS" ? "active" : "completed");

    // Pre-fill preferred language if available
    if (dbUser.preferredLanguage) {
      setSelectedLanguage(dbUser.preferredLanguage.toLowerCase());
    }

    // Pre-fill first example as custom input
    if (match.problem?.examples?.[0]?.input) {
      setCustomInput(match.problem.examples[0].input);
    }
  }, [match, dbUser, setMatchId, setMyUserId, setTimeRemaining, setStatus]);

  const handleRunCode = () => {
    runCode.mutate({
      language: selectedLanguage,
      sourceCode: code,
      customInput,
    });
  };

  const handleSubmitSolution = () => {
    const confirmSubmit = window.confirm("Ready to submit your code against all hidden test cases?");
    if (!confirmSubmit) return;

    submitSolution.mutate({
      language: selectedLanguage,
      sourceCode: code,
    });
  };

  // Loading States
  if (userLoading || matchLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        Preparing competitive match environment...
      </div>
    );
  }

  // Error States
  if (matchError || !match) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-muted-foreground font-mono text-xs gap-4 p-6">
        <ShieldAlert className="h-8 w-8 text-rose-500 animate-pulse" />
        <div className="text-center space-y-1">
          <p className="text-foreground font-extrabold text-sm uppercase">Failed to retrieve match session</p>
          <p className="text-[10px] text-zinc-500">The battle room might have expired or you are unauthorized.</p>
        </div>
        <Button
          onClick={() => {
            resetBattle();
            router.push("/dashboard");
          }}
          className="bg-zinc-900 border border-border/80 text-foreground hover:bg-zinc-800 gap-1.5 font-mono text-xs"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    );
  }

  const opponent = match.players.find((p) => p.user?._id !== dbUser?._id)?.user;
  const opponentName = opponent?.displayName || opponent?.username || "Opponent";
  const opponentAvatar = opponent?.avatar || "";

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-foreground overflow-hidden">
      {/* Global Sync Header */}
      <MatchHeader
        matchId={matchId}
        opponentName={opponentName}
        opponentAvatar={opponentAvatar}
      />

      {/* Main split dashboard */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Column: Problem details */}
        <div className="w-full lg:w-[45%] h-1/2 lg:h-full min-h-0 shrink-0">
          <ProblemPanel problem={match.problem} />
        </div>

        {/* Right Column: Code Editor & Console */}
        <div className="flex-1 h-1/2 lg:h-full flex flex-col gap-4 min-h-0">
          {/* Monaco Editor Wrapper */}
          <div className="flex-[6_6_0%] min-h-0">
            <MonacoEditorWrapper
              matchId={matchId}
              problem={match.problem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              onRunCode={handleRunCode}
              onSubmitSolution={handleSubmitSolution}
              isExecuting={executionLoading}
            />
          </div>

          {/* Output Console Panel */}
          <div className="flex-[4_4_0%] min-h-0">
            <OutputConsole
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              customInput={customInput}
              setCustomInput={setCustomInput}
              runResult={runResult}
              submitResult={submitResult}
              isLoading={executionLoading}
              examples={match.problem?.examples || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
