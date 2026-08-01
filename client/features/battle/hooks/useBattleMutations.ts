import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Room, RoomSettings } from "@/types";

export function useBattleMutations() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  // Create Room Mutation
  const createRoom = useMutation<Room, Error, RoomSettings>({
    mutationFn: async (settings) => {
      const response = await api.post<{ success: boolean; data: Room }>("/rooms", settings);
      const responseData = response as unknown as { success: boolean; data: Room };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to create battle room.");
      }
      return responseData.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["room", data.roomCode], data);
    },
  });

  // Join Room Mutation
  const joinRoom = useMutation<Room, Error, string>({
    mutationFn: async (roomCode) => {
      const response = await api.post<{ success: boolean; data: Room }>("/rooms/join", { roomCode });
      const responseData = response as unknown as { success: boolean; data: Room };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to join battle room.");
      }
      return responseData.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["room", data.roomCode], data);
    },
  });

  // Update Settings Mutation
  const updateSettings = useMutation<Room, Error, { roomCode: string; settings: RoomSettings }>({
    mutationFn: async ({ roomCode, settings }) => {
      const response = await api.patch<{ success: boolean; data: Room }>(
        `/rooms/${roomCode}/settings`,
        settings
      );
      const responseData = response as unknown as { success: boolean; data: Room };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to update room settings.");
      }
      return responseData.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["room", data.roomCode], data);
      queryClient.invalidateQueries({ queryKey: ["room", data.roomCode] });
    },
  });

  // Leave Room Mutation
  const leaveRoom = useMutation<void, Error, string>({
    mutationFn: async (roomCode) => {
      const response = await api.post<{ success: boolean; data: unknown }>(
        `/rooms/${roomCode}/leave`,
        {}
      );
      const responseData = response as unknown as { success: boolean };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to leave battle room.");
      }
    },
    onSuccess: (_, roomCode) => {
      queryClient.invalidateQueries({ queryKey: ["room", roomCode] });
      queryClient.removeQueries({ queryKey: ["room", roomCode] });
    },
  });

  // Start Match Mutation
  const startMatch = useMutation<{ matchId: string }, Error, string>({
    mutationFn: async (roomCode) => {
      const response = await api.post<{ success: boolean; data: { matchId: string } }>(
        "/matches/start",
        { roomCode }
      );
      const responseData = response as unknown as { success: boolean; data: { matchId: string } };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to start the match. Ensure both players are ready.");
      }
      return responseData.data;
    },
    onSuccess: (_, roomCode) => {
      queryClient.invalidateQueries({ queryKey: ["room", roomCode] });
    },
  });

  return {
    createRoom,
    joinRoom,
    updateSettings,
    leaveRoom,
    startMatch,
  };
}
export default useBattleMutations;
