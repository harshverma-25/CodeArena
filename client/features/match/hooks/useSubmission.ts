"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Submission } from "@/types";

export interface RunCodeResult {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  time: number | null; // in ms
  memory: number | null; // in MB
  status: {
    id: number;
    description: string;
  };
}

export function useSubmission(matchId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const [runResult, setRunResult] = useState<RunCodeResult | null>(null);
  const [submitResult, setSubmitResult] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<"testcases" | "output">("testcases");

  const runCode = useMutation<RunCodeResult, Error, { language: string; sourceCode: string; customInput?: string }>({
    mutationFn: async ({ language, sourceCode, customInput }) => {
      setSubmitResult(null);
      setRunResult(null);
      setActiveTab("output");
      
      const res = await api.post<{ success: boolean; data: RunCodeResult }>("/submissions/run", {
        matchId,
        language,
        sourceCode,
        customInput,
      });
      const responseData = res as unknown as { success: boolean; data: RunCodeResult };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to run code.");
      }
      return responseData.data;
    },
    onSuccess: (data) => {
      setRunResult(data);
    },
  });

  const submitSolution = useMutation<Submission, Error, { language: string; sourceCode: string }>({
    mutationFn: async ({ language, sourceCode }) => {
      setRunResult(null);
      setSubmitResult(null);
      setActiveTab("output");

      const res = await api.post<{ success: boolean; data: Submission }>("/submissions", {
        matchId,
        language,
        sourceCode,
      });
      const responseData = res as unknown as { success: boolean; data: Submission };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to submit solution.");
      }
      return responseData.data;
    },
    onSuccess: (data) => {
      setSubmitResult(data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["submissions", matchId] });
    },
  });

  return {
    runCode,
    submitSolution,
    runResult,
    submitResult,
    activeTab,
    setActiveTab,
    isLoading: runCode.isPending || submitSolution.isPending,
  };
}
export default useSubmission;
