import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export interface DashboardStats {
  matchesPlayed: number;
  wins: number;
  winRate: number;
  problemsSolved: number;
  highestWinStreak: number;
}

export function useDashboardStats() {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  const stats: DashboardStats = {
    matchesPlayed: user?.matchesPlayed || 0,
    wins: user?.wins || 0,
    winRate: user?.matchesPlayed ? Math.round((user.wins / user.matchesPlayed) * 100) : 0,
    problemsSolved: user?.acceptedSubmissions || 0,
    highestWinStreak: user?.highestWinStreak || 0,
  };

  return {
    stats,
    isLoading,
    isError,
    error,
  };
}
export default useDashboardStats;
