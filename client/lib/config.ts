/**
 * Frontend Application Configuration & Environment Resolver
 *
 * Prevents silent fallback to localhost in production deployments.
 * When NEXT_PUBLIC_API_URL or NEXT_PUBLIC_WS_URL are omitted in production,
 * this resolver safely derives URLs from the browser's window.location.origin
 * instead of attempting to connect to the client machine's localhost:5000.
 */

function resolveApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    if (typeof window !== "undefined") {
      console.warn(
        "⚠️ NEXT_PUBLIC_API_URL is missing in production. Safely resolving to window.location.origin/api/v1"
      );
      return `${window.location.origin}/api/v1`;
    }
    return "/api/v1";
  }

  return "http://localhost:5000/api/v1";
}

function resolveWsUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    if (typeof window !== "undefined") {
      console.warn(
        "⚠️ NEXT_PUBLIC_WS_URL is missing in production. Safely resolving to window.location.origin"
      );
      return window.location.origin;
    }
    return "";
  }

  return "http://localhost:5000";
}

export const clientConfig = {
  get apiUrl(): string {
    return resolveApiUrl();
  },
  get wsUrl(): string {
    return resolveWsUrl();
  },
};
