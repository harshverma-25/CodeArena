import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  createRoomModalOpen: boolean;
  joinRoomModalOpen: boolean;
  inviteModalOpen: boolean;
  activeRoomCode: string | null;
  editorFontSize: number;
  editorTheme: string;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCreateRoomModalOpen: (open: boolean) => void;
  setJoinRoomModalOpen: (open: boolean) => void;
  setInviteModalOpen: (open: boolean, code?: string | null) => void;
  setEditorFontSize: (size: number) => void;
  setEditorTheme: (theme: string) => void;
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  createRoomModalOpen: false,
  joinRoomModalOpen: false,
  inviteModalOpen: false,
  activeRoomCode: null,
  editorFontSize: 14,
  editorTheme: "vs-dark",

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCreateRoomModalOpen: (open) => set({ createRoomModalOpen: open }),
  setJoinRoomModalOpen: (open) => set({ joinRoomModalOpen: open }),
  setInviteModalOpen: (open, code = null) => 
    set({ inviteModalOpen: open, activeRoomCode: code }),
  setEditorFontSize: (size) => set({ editorFontSize: size }),
  setEditorTheme: (theme) => set({ editorTheme: theme }),
  resetUI: () => set({
    sidebarOpen: false,
    createRoomModalOpen: false,
    joinRoomModalOpen: false,
    inviteModalOpen: false,
    activeRoomCode: null,
  }),
}));
