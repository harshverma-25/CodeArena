import { create } from "zustand";
import { BattleInitPayload } from "@/types";

export type BattleStatus = "idle" | "lobby" | "countdown" | "active" | "completed";

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
  // Socket Connection Status
  isSocketConnected: boolean;
  
  // Room and Battle Info
  roomCode: string | null;
  matchId: string | null;
  status: BattleStatus;
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
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
  setRoomDetails: (roomCode: string, difficulty: "EASY" | "MEDIUM" | "HARD", durationMinutes: number) => void;
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
  }),
}));
