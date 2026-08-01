"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";
import { useApiClient } from "@/hooks/useApiClient";
import { Submission } from "@/types";

export function useMatchSocket(roomCode: string | undefined, matchId: string, myUserId: string | undefined) {
  const router = useRouter();
  const api = useApiClient();
  const { isLoaded, isSignedIn } = useAuth();
  
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setSocketConnected,
    setOpponentProgress,
    setMyProgress,
    setStatus,
  } = useBattleStore();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !roomCode || !myUserId) return;

    let active = true;
    const socket = socketManager.getSocket();

    const handleConnect = () => {
      if (!active) return;
      setIsConnected(true);
      setError(null);
      setSocketConnected(true);
      // Join room to receive match status events
      socketManager.emit("room:join", { roomCode });
    };

    const handleDisconnect = () => {
      if (!active) return;
      setIsConnected(false);
      setSocketConnected(false);
    };

    const handleConnectError = (err: Error) => {
      if (!active) return;
      setError("Socket connection failed. Attempting to reconnect...");
    };

    const handleSubmissionQueued = (payload: { submissionId: string; userId: string; submissionNumber: number }) => {
      if (!active) return;
      if (payload.userId !== myUserId) {
        setOpponentProgress({
          submissionStatus: "running",
          isTyping: false,
        });
      }
    };

    const handleSubmissionRunning = (payload: { submissionId: string; userId: string; submissionNumber: number }) => {
      if (!active) return;
      if (payload.userId !== myUserId) {
        setOpponentProgress({
          submissionStatus: "running",
        });
      }
    };

    const handleSubmissionResult = async (payload: {
      submissionId: string;
      userId: string;
      verdict: string;
      executionTime: number;
      memory: number;
      submissionNumber: number;
    }) => {
      if (!active) return;
      
      try {
        // Fetch full submission details via REST API to update test cases passed count
        const subDetails = await api.get<{ success: boolean; data: Submission }>(`/submissions/${payload.submissionId}`);
        const submission = subDetails.data;
        
        if (payload.userId !== myUserId) {
          setOpponentProgress({
            testCasesPassed: submission.passedTestCases,
            totalTestCases: submission.totalTestCases,
            submissionStatus: payload.verdict === "ACCEPTED" ? "success" : "failed",
            lastActive: new Date().toISOString(),
          });
        } else {
          setMyProgress(submission.passedTestCases, submission.totalTestCases);
        }

        // Check if this results in match completion
        if (payload.verdict === "ACCEPTED") {
          setStatus("completed");
          // Short delay to show success/failure before navigating to results
          setTimeout(() => {
            router.push(`/results/${matchId}`);
          }, 2000);
        }
      } catch (err) {
        console.error("Failed to process submission socket event:", err);
      }
    };

    // Bind listeners
    if (socket) {
      setIsConnected(socket.connected);
      setSocketConnected(socket.connected);

      if (socket.connected) {
        socketManager.emit("room:join", { roomCode });
      }

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("submission:queued", handleSubmissionQueued);
      socket.on("submission:running", handleSubmissionRunning);
      socket.on("submission:result", handleSubmissionResult);
    }

    return () => {
      active = false;
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.off("submission:queued", handleSubmissionQueued);
        socket.off("submission:running", handleSubmissionRunning);
        socket.off("submission:result", handleSubmissionResult);
      }
    };
  }, [
    isLoaded,
    isSignedIn,
    roomCode,
    matchId,
    myUserId,
    setSocketConnected,
    setOpponentProgress,
    setMyProgress,
    setStatus,
    router,
    api,
  ]);

  return {
    isConnected,
    error,
  };
}
export default useMatchSocket;
