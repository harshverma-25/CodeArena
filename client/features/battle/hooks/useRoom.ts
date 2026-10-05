import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { isNativeAuthActive } from "@/features/auth/nativeAuth";
import { Room } from "@/types";

export function useRoom(roomCode: string) {
  const api = useApiClient();
  const hasAuth = isNativeAuthActive() || isGuestSessionActive();

  return useQuery<Room, Error>({
    queryKey: ["room", roomCode],
    queryFn: async () => {
      if (!roomCode) throw new Error("Room code is required.");
      const response = await api.get<{ success: boolean; data: Room }>(
        `/rooms/${roomCode}`
      );

      const responseData = response as unknown as { success: boolean; data: Room };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to load battle room details.");
      }
      return responseData.data;
    },
    enabled: hasAuth && !!roomCode,
    refetchInterval: 3000,
    staleTime: 2000,
  });
}
export default useRoom;
