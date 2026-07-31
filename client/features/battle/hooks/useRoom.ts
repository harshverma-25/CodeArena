import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@clerk/nextjs";
import { Room } from "@/types";

export function useRoom(roomCode: string) {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

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
    enabled: isLoaded && isSignedIn && !!roomCode,
    refetchInterval: 3000, // Fallback polling: refresh room state every 3 seconds
    staleTime: 2000,
  });
}
export default useRoom;
