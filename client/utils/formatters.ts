/**
 * Formats a duration in seconds into a MM:SS string (or HH:MM:SS if over an hour).
 * Useful for match timers and countdowns.
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const pad = (num: number) => String(num).padStart(2, "0");
  
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Formats a date string or Date object into a readable representation.
 * E.g., "Jan 12, 2026, 4:30 PM".
 */
export function formatDate(date: string | Date): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return "";
  
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Truncates a string to a specified length and appends an ellipsis if it exceeds the limit.
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Maps short programming language identifiers to user-friendly display labels.
 */
export function getLanguageLabel(lang: string): string {
  const mapping: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python 3",
    python3: "Python 3",
    cpp: "C++",
    cpp17: "C++ (GCC 17)",
    java: "Java",
    go: "Go",
    rust: "Rust",
  };
  
  return mapping[lang.toLowerCase()] || lang;
}

/**
 * Maps problem status or verification verdicts to theme-compatible Tailwind CSS classes.
 */
export function getVerdictStyles(verdict: string): {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  const normalized = verdict.toUpperCase().replace(/\s+/g, "_");
  
  switch (normalized) {
    case "ACCEPTED":
    case "AC":
      return {
        label: "Accepted",
        textColor: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/20",
      };
    case "WRONG_ANSWER":
    case "WA":
      return {
        label: "Wrong Answer",
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
        borderColor: "border-destructive/20",
      };
    case "TIME_LIMIT_EXCEEDED":
    case "TLE":
      return {
        label: "Time Limit Exceeded",
        textColor: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20",
      };
    case "MEMORY_LIMIT_EXCEEDED":
    case "MLE":
      return {
        label: "Memory Limit Exceeded",
        textColor: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20",
      };
    case "COMPILATION_ERROR":
    case "CE":
      return {
        label: "Compilation Error",
        textColor: "text-orange-400",
        bgColor: "bg-orange-400/10",
        borderColor: "border-orange-400/20",
      };
    case "RUNTIME_ERROR":
    case "RE":
      return {
        label: "Runtime Error",
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
        borderColor: "border-destructive/20",
      };
    case "PENDING":
    case "RUNNING":
    case "JUDGING":
      return {
        label: "Judging",
        textColor: "text-muted-foreground",
        bgColor: "bg-secondary",
        borderColor: "border-border",
      };
    default:
      return {
        label: verdict,
        textColor: "text-foreground",
        bgColor: "bg-secondary",
        borderColor: "border-border",
      };
  }
}
