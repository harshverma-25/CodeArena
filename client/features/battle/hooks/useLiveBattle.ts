"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { socketManager } from "@/lib/socket";
import { useBattleStore } from "@/store/battleStore";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";
import {
  BattleQuestion,
  BattleInitPayload,
  BattleNextQuestionPayload,
  BattleRevealPayload,
  BattleResultsPayload,
  BattlePlayerSubmittedPayload,
  BattleAnswerLockedPayload,
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
  roundStartedAt: number;
  questionDeadline: Date | null;
  myScore: number;
  isMyCompleted: boolean;
}

export interface LiveBattlePlayer {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  score: number;
  hasAnswered: boolean;
  timeTakenMs?: number;
  isHost?: boolean;
  isDisconnected?: boolean;
  currentQuestionIndex?: number;
  isCompleted?: boolean;
}

export type OpponentLiveState = LiveBattlePlayer;

export function useLiveBattle(roomCode: string) {
  const code = (roomCode || "").toUpperCase();
  const { data: currentUser } = useCurrentUser();
  const cachedInitData = useBattleStore((state) => state.battleInitData);
  const setBattleInitData = useBattleStore((state) => state.setBattleInitData);

  const [battle, setBattle] = useState<LiveBattleState | null>(null);
  const [players, setPlayers] = useState<LiveBattlePlayer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [potentialScore, setPotentialScore] = useState<number>(1000);
  const [lockedScore, setLockedScore] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [timerPercent, setTimerPercent] = useState<number>(100);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealData, setRevealData] = useState<BattleRevealPayload | null>(null);
  const [revealCountdown, setRevealCountdown] = useState<number>(5);
  const [results, setResults] = useState<BattleResultsPayload | null>(null);
  const [status, setStatus] = useState<
    "loading" | "active" | "reveal" | "completed" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from BattleInitPayload
  const processInitPayload = useCallback(
    (payload: BattleInitPayload, currentUserId?: string) => {
      const myId = currentUserId || currentUser?._id;
      const myPlayer = payload.players.find((p) => p.userId === myId);

      const deadline = payload.questionDeadline ? new Date(payload.questionDeadline) : null;
      const startedAt = payload.roundStartedAt || Date.now();

      setBattle({
        battleId: payload.battleId,
        roomCode: payload.roomCode,
        topic: payload.topic,
        difficulty: payload.difficulty,
        questionCount: payload.questionCount,
        timePerQuestion: payload.timePerQuestion || 30,
        currentQuestionIndex: payload.currentQuestionIndex,
        currentQuestion: payload.currentQuestion,
        roundStartedAt: startedAt,
        questionDeadline: deadline,
        myScore: myPlayer?.score || 0,
        isMyCompleted: myPlayer?.isCompleted || false,
      });

      const mappedPlayers: LiveBattlePlayer[] = payload.players.map((p, idx) => ({
        userId: p.userId,
        username: p.username,
        displayName: p.displayName || p.username,
        avatar: p.avatar,
        score: p.score || 0,
        hasAnswered: Boolean(p.hasAnswered),
        isHost: p.isHost !== undefined ? p.isHost : (payload.hostId ? p.userId === payload.hostId : idx === 0),
        isDisconnected: false,
      }));
      setPlayers(mappedPlayers);

      setSelectedOption(null);
      setIsLocked(false);
      setIsSubmitting(false);
      setLockedScore(null);
      setIsRevealed(false);
      setRevealData(null);

      if (myPlayer?.isCompleted) {
        setStatus("completed");
      } else {
        setStatus("active");
      }
    },
    [currentUser]
  );

  // Initialize from cache if present
  useEffect(() => {
    if (cachedInitData && !battle) {
      const timer = setTimeout(() => {
        processInitPayload(cachedInitData);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [cachedInitData, battle, processInitPayload]);

  // Main Socket Listener & Reconnection
  useEffect(() => {
    const hasAuth = isNativeAuthActive() || isGuestSessionActive();
    if (!hasAuth || !code) return;

    let active = true;
    const socket = socketManager.getSocket();

    const handleBattleInit = (payload: BattleInitPayload) => {
      if (!active) return;
      setBattleInitData(payload);
      processInitPayload(payload, currentUser?._id);
    };

    const handleAnswerLocked = (payload: BattleAnswerLockedPayload) => {
      if (!active) return;
      setLockedScore(payload.potentialScore);
      setIsSubmitting(false);
    };

    const handlePlayerSubmitted = (payload: BattlePlayerSubmittedPayload) => {
      if (!active) return;
      setPlayers((prev) =>
        prev.map((p) =>
          p.userId === payload.userId
            ? { ...p, hasAnswered: true, timeTakenMs: payload.timeTakenMs }
            : p
        )
      );
    };

    const handleBattleReveal = (payload: BattleRevealPayload) => {
      if (!active) return;
      setIsRevealed(true);
      setIsLocked(true);
      setRevealData(payload);
      setStatus("reveal");
      setRevealCountdown(payload.revealDurationSec || 5);

      // Update player scores
      setPlayers((prev) =>
        prev.map((p) => {
          const match = payload.players.find((rp) => rp.userId === p.userId);
          if (match) {
            return {
              ...p,
              score: match.totalScore,
              hasAnswered: true,
              timeTakenMs: match.timeTakenMs,
            };
          }
          return p;
        })
      );

      // Update my score
      const myMatch = payload.players.find((rp) => rp.userId === currentUser?._id);
      if (myMatch) {
        setBattle((prev) => (prev ? { ...prev, myScore: myMatch.totalScore } : prev));
      }
    };

    const handleNextQuestion = (payload: BattleNextQuestionPayload) => {
      if (!active) return;

      const deadline = payload.questionDeadline ? new Date(payload.questionDeadline) : null;
      const startedAt = payload.roundStartedAt || Date.now();

      setBattle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: payload.currentQuestionIndex,
          currentQuestion: payload.question,
          roundStartedAt: startedAt,
          questionDeadline: deadline,
          questionCount: payload.totalQuestions || prev.questionCount,
          timePerQuestion: payload.timePerQuestion || prev.timePerQuestion,
          isMyCompleted: payload.completed,
        };
      });

      // Reset selection state for next question
      setSelectedOption(null);
      setIsSubmitting(false);
      setIsLocked(false);
      setLockedScore(null);
      setIsRevealed(false);
      setRevealData(null);
      setStatus("active");

      // Reset players' hasAnswered for next round
      setPlayers((prev) => prev.map((p) => ({ ...p, hasAnswered: false, timeTakenMs: undefined })));
    };

    const handleBattleCompleted = (payload: BattleResultsPayload) => {
      if (!active) return;
      setResults(payload);
      setStatus("completed");
      setIsLocked(true);
      setIsRevealed(false);
    };

    const handlePlayerDisconnected = (payload: { userId: string }) => {
      if (!active) return;
      setPlayers((prev) =>
        prev.map((p) => (p.userId === payload.userId ? { ...p, isDisconnected: true } : p))
      );
    };

    const handlePlayerReconnected = (payload: { userId: string }) => {
      if (!active) return;
      setPlayers((prev) =>
        prev.map((p) => (p.userId === payload.userId ? { ...p, isDisconnected: false } : p))
      );
    };

    const handleError = (payload: { message: string }) => {
      if (!active) return;
      setErrorMessage(payload.message || "An unexpected battle error occurred.");
    };

    const handleConnect = () => {
      if (!active) return;
      socketManager.emit("battle:reconnect", { roomCode: code });
    };

    if (socket) {
      socket.on("connect", handleConnect);
      socket.on("battle:init", handleBattleInit);
      socket.on("battle:answer_locked", handleAnswerLocked);
      socket.on("battle:player_submitted", handlePlayerSubmitted);
      socket.on("battle:reveal", handleBattleReveal);
      socket.on("battle:next_question", handleNextQuestion);
      socket.on("battle:completed", handleBattleCompleted);
      socket.on("player:disconnected", handlePlayerDisconnected);
      socket.on("player:reconnected", handlePlayerReconnected);
      socket.on("error", handleError);

      // Reconnect/sync to room channel & battle state
      socketManager.emit("battle:reconnect", { roomCode: code });
    }

    const fallbackTimer = setTimeout(() => {
      if (active && status === "loading" && !battle) {
        socketManager.emit("battle:reconnect", { roomCode: code });
      }
    }, 2000);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("battle:init", handleBattleInit);
        socket.off("battle:answer_locked", handleAnswerLocked);
        socket.off("battle:player_submitted", handlePlayerSubmitted);
        socket.off("battle:reveal", handleBattleReveal);
        socket.off("battle:next_question", handleNextQuestion);
        socket.off("battle:completed", handleBattleCompleted);
        socket.off("player:disconnected", handlePlayerDisconnected);
        socket.off("player:reconnected", handlePlayerReconnected);
        socket.off("error", handleError);
      }
    };
  }, [code, currentUser, processInitPayload, setBattleInitData, status, battle]);

  // Dynamic Decreasing Points & Visual Countdown Timer
  useEffect(() => {
    if (status !== "active" || isRevealed || !battle) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const totalDurationSec = battle.timePerQuestion || 30;
    const totalDurationMs = totalDurationSec * 1000;
    const startedAt = battle.roundStartedAt;

    const tick = () => {
      const now = Date.now();
      const elapsedMs = Math.max(0, now - startedAt);
      const elapsedSec = elapsedMs / 1000;

      // Formula: 1000 pts start, drops by 30 pts/sec.
      // 0s: 1000. 2s: ~940. 5s: ~850. Min: 100.
      if (!isLocked) {
        const score = Math.max(100, Math.round(1000 - elapsedSec * 30));
        setPotentialScore(score);
      }

      const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
      const remainingSecs = Math.ceil(remainingMs / 1000);
      setTimeRemaining(remainingSecs);

      const percent = Math.max(0, Math.min(100, (remainingMs / totalDurationMs) * 100));
      setTimerPercent(percent);

      if (remainingMs <= 0 && !isLocked) {
        setIsLocked(true);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, isRevealed, isLocked, battle]);

  // Reveal Phase 5-second countdown timer
  useEffect(() => {
    if (!isRevealed || status !== "reveal") {
      if (revealTimerRef.current) clearInterval(revealTimerRef.current);
      return;
    }

    const interval = setInterval(() => {
      setRevealCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    revealTimerRef.current = interval;

    return () => clearInterval(interval);
  }, [isRevealed, status]);

  // Submit Answer Action
  const submitAnswer = useCallback(
    (optionIndex: number) => {
      if (isLocked || isSubmitting || !battle?.currentQuestion) return;

      // 1. Immediately lock options client-side (Anti-cheat & UI freeze)
      setIsLocked(true);
      setSelectedOption(optionIndex);
      setIsSubmitting(true);
      setLockedScore(potentialScore);

      // 2. Authoritative submission via Socket.IO
      socketManager.emit("battle:submit_answer", {
        roomCode: code,
        questionId: battle.currentQuestion.questionId,
        selectedOption: optionIndex,
      });
    },
    [isLocked, isSubmitting, battle, code, potentialScore]
  );

  // Host manually advances to next round early during reveal
  const advanceRound = useCallback(() => {
    socketManager.emit("battle:advance_round", { roomCode: code });
  }, [code]);

  return {
    battle,
    players,
    opponent: players.find((p) => p.userId !== currentUser?._id) || null,
    currentUser,
    selectedOption,
    isLocked,
    isSubmitting,
    potentialScore,
    lockedScore,
    timeRemaining,
    timerPercent,
    isRevealed,
    revealData,
    revealCountdown,
    results,
    status,
    errorMessage,
    submitAnswer,
    advanceRound,
  };
}

export default useLiveBattle;
