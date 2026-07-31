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

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Draft" | "Published" | "Archived";
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  starterCode: Record<string, string>;
  tags: string[];
  points: number;
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  updatedAt: string;
}
