"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  BattleQuestion,
  BattleInitPayload,
  BattleNextQuestionPayload,
  BattleOpponentProgressPayload,
  BattleResultsPayload,
  BattlePlayer,
} from "@/types";

export interface LiveBattleState {
  battleId: string | null;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  currentQuestionIndex: number;
  currentQuestion: BattleQuestion | null;
  questionDeadline: Date | null;
  myScore: number;
  isMyCompleted: boolean;
}

export interface OpponentLiveState {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  currentQuestionIndex: number;
  score: number;
  isCompleted: boolean;
  isDisconnected: boolean;
}

export function useLiveBattle(roomCode: string) {
  const code = (roomCode || "").toUpperCase();
  const { isLoaded, isSignedIn } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const cachedInitData = useBattleStore((state) => state.battleInitData);
  const setBattleInitData = useBattleStore((state) => state.setBattleInitData);

  const [battle, setBattle] = useState<LiveBattleState | null>(null);
  const [opponent, setOpponent] = useState<OpponentLiveState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [results, setResults] = useState<BattleResultsPayload | null>(null);
  const [status, setStatus] = useState<
    "loading" | "active" | "waiting_opponent" | "completed" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from BattleInitPayload
  const processInitPayload = useCallback(
    (payload: BattleInitPayload, currentUserId?: string) => {
      const myId = currentUserId || currentUser?._id;
      const myPlayer = payload.players.find((p) => p.userId === myId);
      const oppPlayer = payload.players.find((p) => p.userId !== myId);

      const deadline = payload.questionDeadline ? new Date(payload.questionDeadline) : null;

      setBattle({
        battleId: payload.battleId,
        roomCode: payload.roomCode,
        topic: payload.topic,
        difficulty: payload.difficulty,
        questionCount: payload.questionCount,
        timePerQuestion: payload.timePerQuestion || 30,
        currentQuestionIndex: payload.currentQuestionIndex,
        currentQuestion: payload.currentQuestion,
        questionDeadline: deadline,
        myScore: myPlayer?.score || 0,
        isMyCompleted: myPlayer?.isCompleted || false,
      });

      if (oppPlayer) {
        setOpponent({
          userId: oppPlayer.userId,
          username: oppPlayer.username,
          displayName: oppPlayer.displayName || oppPlayer.username,
          avatar: oppPlayer.avatar,
          currentQuestionIndex: oppPlayer.currentQuestionIndex,
          score: oppPlayer.score || 0,
          isCompleted: oppPlayer.isCompleted,
          isDisconnected: false,
        });
      }

      setSelectedOption(null);
      setIsLocked(false);
      setIsSubmitting(false);

      if (myPlayer?.isCompleted) {
        setStatus("waiting_opponent");
      } else {
        setStatus("active");
      }
    },
    [currentUser]
  );

  // Initialize from cache if present
  useEffect(() => {
    if (cachedInitData && !battle) {
      processInitPayload(cachedInitData);
    }
  }, [cachedInitData, battle, processInitPayload]);

  // Main Socket Listener & Reconnection
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !code) return;

    let active = true;
    const socket = socketManager.getSocket();

    const handleBattleInit = (payload: BattleInitPayload) => {
      if (!active) return;
      setBattleInitData(payload);
      processInitPayload(payload, currentUser?._id);
    };

    const handleNextQuestion = (payload: BattleNextQuestionPayload) => {
      if (!active) return;

      const deadline = payload.questionDeadline ? new Date(payload.questionDeadline) : null;

      setBattle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: payload.currentQuestionIndex,
          currentQuestion: payload.question,
          questionDeadline: deadline,
          questionCount: payload.totalQuestions || prev.questionCount,
          timePerQuestion: payload.timePerQuestion || prev.timePerQuestion,
          isMyCompleted: payload.completed,
        };
      });

      // Reset selection state for next question
      setSelectedOption(null);
      setIsSubmitting(false);

      if (payload.completed) {
        setIsLocked(true);
        setStatus("waiting_opponent");
      } else {
        setIsLocked(false);
        setStatus("active");
      }
    };

    const handleOpponentProgress = (payload: BattleOpponentProgressPayload) => {
      if (!active) return;

      // Update opponent progress, but if this event was for current user, update current user's score authoritatively
      const myId = currentUser?._id;
      if (myId && payload.userId === myId) {
        setBattle((prev) => (prev ? { ...prev, myScore: payload.score } : prev));
      } else {
        setOpponent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentQuestionIndex: payload.currentQuestionIndex,
            score: payload.score,
            isCompleted: payload.isCompleted,
          };
        });
      }
    };

    const handleBattleCompleted = (payload: BattleResultsPayload) => {
      if (!active) return;
      setResults(payload);
      setStatus("completed");
      setIsLocked(true);
    };

    const handlePlayerDisconnected = (payload: { userId: string }) => {
      if (!active) return;
      setOpponent((prev) => (prev ? { ...prev, isDisconnected: true } : prev));
    };

    const handlePlayerReconnected = (payload: { userId: string }) => {
      if (!active) return;
      setOpponent((prev) => (prev ? { ...prev, isDisconnected: false } : prev));
    };

    const handleError = (payload: { message: string }) => {
      if (!active) return;
      setErrorMessage(payload.message || "An unexpected battle error occurred.");
    };

    if (socket) {
      socket.on("battle:init", handleBattleInit);
      socket.on("battle:next_question", handleNextQuestion);
      socket.on("battle:opponent_progress", handleOpponentProgress);
      socket.on("battle:completed", handleBattleCompleted);
      socket.on("player:disconnected", handlePlayerDisconnected);
      socket.on("player:reconnected", handlePlayerReconnected);
      socket.on("error", handleError);

      // Reconnect/sync to room channel & battle state
      socketManager.emit("battle:reconnect", { roomCode: code });
    }

    // Set timeout to check if battle loaded or invalid
    const fallbackTimer = setTimeout(() => {
      if (active && status === "loading" && !battle) {
        socketManager.emit("battle:reconnect", { roomCode: code });
      }
    }, 2000);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      if (socket) {
        socket.off("battle:init", handleBattleInit);
        socket.off("battle:next_question", handleNextQuestion);
        socket.off("battle:opponent_progress", handleOpponentProgress);
        socket.off("battle:completed", handleBattleCompleted);
        socket.off("player:disconnected", handlePlayerDisconnected);
        socket.off("player:reconnected", handlePlayerReconnected);
        socket.off("error", handleError);
      }
    };
  }, [isLoaded, isSignedIn, code, currentUser, processInitPayload, setBattleInitData, status, battle]);

  // Client-Side Visual Timer
  useEffect(() => {
    if (status !== "active" || !battle?.questionDeadline || isLocked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const target = new Date(battle.questionDeadline!).getTime();
      const remainingSecs = Math.max(0, Math.ceil((target - now) / 1000));

      setTimeRemaining(remainingSecs);

      // Visual timeout on client
      if (remainingSecs <= 0) {
        setIsLocked(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, battle?.questionDeadline, isLocked]);

  // Submit Answer Action
  const submitAnswer = useCallback(
    (optionIndex: number) => {
      if (isLocked || isSubmitting || !battle?.currentQuestion) return;

      // 1. Immediately lock options client-side (Anti-cheat & UI lock)
      setIsLocked(true);
      setSelectedOption(optionIndex);
      setIsSubmitting(true);

      // 2. Authoritative submission via Socket.IO
      socketManager.emit("battle:submit_answer", {
        roomCode: code,
        questionId: battle.currentQuestion.questionId,
        selectedOption: optionIndex,
      });
    },
    [isLocked, isSubmitting, battle, code]
  );

  return {
    battle,
    opponent,
    selectedOption,
    isLocked,
    isSubmitting,
    timeRemaining,
    results,
    status,
    errorMessage,
    submitAnswer,
  };
}
export default useLiveBattle;
