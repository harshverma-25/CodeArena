import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { User } from "@/types";

export function useUpdateProfile() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<User, Error, { displayName?: string; preferredLanguage?: string }>({
    mutationFn: async (updateData) => {
      const response = await api.patch<{ success: boolean; data: User }>("/users/me", updateData);
      const responseData = response as unknown as { success: boolean; data: User };
      if (!responseData || !responseData.success) {
        throw new Error("Failed to update user profile.");
      }
      return responseData.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
export default useUpdateProfile;
