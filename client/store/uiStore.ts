import { create } from "zustand";

interface UIState {
  createRoomModalOpen: boolean;
  joinRoomModalOpen: boolean;
  
  // Actions
  setCreateRoomModalOpen: (open: boolean) => void;
  setJoinRoomModalOpen: (open: boolean) => void;
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  createRoomModalOpen: false,
  joinRoomModalOpen: false,

  setCreateRoomModalOpen: (open) => set({ createRoomModalOpen: open }),
  setJoinRoomModalOpen: (open) => set({ joinRoomModalOpen: open }),
  resetUI: () => set({
    createRoomModalOpen: false,
    joinRoomModalOpen: false,
  }),
}));
