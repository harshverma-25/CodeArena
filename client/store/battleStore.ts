import { create } from "zustand";
import { BattleInitPayload } from "@/types";

export type BattleStatus = "idle" | "lobby" | "countdown" | "active" | "completed";
export type QuizDifficulty = "easy" | "medium" | "hard" | "random";

export interface Player {
  userId: string;
  username: string;
  avatarUrl?: string;
  isHost: boolean;
  isReady: boolean;
  isFinished: boolean;
  finishedAt?: string | null;
  score?: number;
}

interface BattleState {
  // Socket Connection Status & Error States
  isSocketConnected: boolean;
  isReconnecting: boolean;
  socketError: string | null;
  
  // Room and Battle Info
  roomCode: string | null;
  matchId: string | null;
  status: BattleStatus;
  difficulty: QuizDifficulty | string | null;
  durationMinutes: number;
  timeRemainingSeconds: number;
  
  // MCQ Battle Init Cache
  battleInitData: BattleInitPayload | null;
  setBattleInitData: (data: BattleInitPayload | null) => void;
  
  // Players
  players: Player[];
  myUserId: string | null;
  
  // Actions
  setSocketConnected: (connected: boolean) => void;
  setReconnecting: (reconnecting: boolean) => void;
  setSocketError: (error: string | null) => void;
  setRoomDetails: (roomCode: string, difficulty: QuizDifficulty | string, durationMinutes: number) => void;
  setMatchId: (matchId: string | null) => void;
  setStatus: (status: BattleStatus) => void;
  setPlayers: (players: Player[]) => void;
  setMyUserId: (userId: string | null) => void;
  setTimeRemaining: (seconds: number) => void;
  decrementTime: () => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  isSocketConnected: false,
  isReconnecting: false,
  socketError: null,
  roomCode: null,
  matchId: null,
  status: "idle",
  difficulty: null,
  durationMinutes: 30,
  timeRemainingSeconds: 0,
  battleInitData: null,
  setBattleInitData: (battleInitData) => set({ battleInitData }),
  players: [],
  myUserId: null,

  setSocketConnected: (connected) => set({ isSocketConnected: connected }),
  setReconnecting: (isReconnecting) => set({ isReconnecting }),
  setSocketError: (socketError) => set({ socketError }),
  setRoomDetails: (roomCode, difficulty, durationMinutes) => 
    set({ roomCode, difficulty, durationMinutes }),
  setMatchId: (matchId) => set({ matchId }),
  setStatus: (status) => set({ status }),
  setPlayers: (players) => set({ players }),
  setMyUserId: (myUserId) => set({ myUserId }),
  setTimeRemaining: (timeRemainingSeconds) => set({ timeRemainingSeconds }),
  decrementTime: () => set((state) => ({ 
    timeRemainingSeconds: Math.max(0, state.timeRemainingSeconds - 1) 
  })),
  resetBattle: () => set({
    roomCode: null,
    matchId: null,
    status: "idle",
    difficulty: null,
    durationMinutes: 30,
    timeRemainingSeconds: 0,
    players: [],
    socketError: null,
    isReconnecting: false,
  }),
}));
