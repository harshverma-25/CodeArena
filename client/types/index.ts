export interface User {
  id: string;
  clerkId: string;
  username: string;
  displayName: string;
  avatar: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  highestWinStreak: number;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}
