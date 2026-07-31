import { create } from "zustand";

export type MatchStatus = "idle" | "lobby" | "countdown" | "active" | "completed";

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

export interface OpponentProgress {
  testCasesPassed: number;
  totalTestCases: number;
  isTyping: boolean;
  lastActive: string;
  submissionStatus?: "idle" | "running" | "success" | "failed";
}

interface BattleState {
  // Socket Connection Status
  isSocketConnected: boolean;
  
  // Room and Match Info
  roomCode: string | null;
  matchId: string | null;
  status: MatchStatus;
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
  durationMinutes: number;
  timeRemainingSeconds: number;
  
  // Players
  players: Player[];
  myUserId: string | null;
  
  // Progress states
  opponentProgress: OpponentProgress | null;
  myPassedCases: number;
  myTotalCases: number;
  
  // Actions
  setSocketConnected: (connected: boolean) => void;
  setRoomDetails: (roomCode: string, difficulty: "EASY" | "MEDIUM" | "HARD", durationMinutes: number) => void;
  setMatchId: (matchId: string | null) => void;
  setStatus: (status: MatchStatus) => void;
  setPlayers: (players: Player[]) => void;
  setMyUserId: (userId: string | null) => void;
  setTimeRemaining: (seconds: number) => void;
  decrementTime: () => void;
  setOpponentProgress: (progress: Partial<OpponentProgress>) => void;
  setMyProgress: (passed: number, total: number) => void;
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
  players: [],
  myUserId: null,
  opponentProgress: null,
  myPassedCases: 0,
  myTotalCases: 0,

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
  setOpponentProgress: (progress) => set((state) => ({
    opponentProgress: state.opponentProgress 
      ? { ...state.opponentProgress, ...progress }
      : { 
          testCasesPassed: 0, 
          totalTestCases: 0, 
          isTyping: false, 
          lastActive: new Date().toISOString(), 
          ...progress 
        }
  })),
  setMyProgress: (myPassedCases, myTotalCases) => set({ myPassedCases, myTotalCases }),
  resetBattle: () => set({
    roomCode: null,
    matchId: null,
    status: "idle",
    difficulty: null,
    durationMinutes: 30,
    timeRemainingSeconds: 0,
    players: [],
    opponentProgress: null,
    myPassedCases: 0,
    myTotalCases: 0,
  }),
}));
