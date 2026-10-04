import { User } from '@/types';

export const GUEST_STORAGE_KEY = 'codearena_guest_session';
export const GUEST_COOKIE_NAME = 'codearena_guest_token';

export interface GuestSession {
  token: string;
  user: User;
  expiresAt: number; // Unix timestamp in milliseconds
}

/**
 * Retrieve current active guest session from localStorage.
 * Automatically purges and returns null if the session has expired.
 */
export function getGuestSession(): GuestSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return null;

    const session: GuestSession = JSON.parse(raw);
    if (!session || !session.token || !session.expiresAt) {
      clearGuestSession();
      return null;
    }

    if (Date.now() > session.expiresAt) {
      clearGuestSession();
      return null;
    }

    return session;
  } catch {
    clearGuestSession();
    return null;
  }
}

/**
 * Get active guest token string if present and unexpired.
 */
export function getGuestToken(): string | null {
  const session = getGuestSession();
  return session ? session.token : null;
}

/**
 * Get active guest user object if present and unexpired.
 */
export function getGuestUser(): User | null {
  const session = getGuestSession();
  return session ? session.user : null;
}

/**
 * Check if an active guest session exists.
 */
export function isGuestSessionActive(): boolean {
  return getGuestToken() !== null;
}

/**
 * Save new guest session into both localStorage and document.cookie.
 * Setting the cookie ensures Next.js Edge Middleware can verify the guest session
 * without redirecting away from protected routes like /dashboard.
 */
export function setGuestSession(token: string, user: User, expiresInSeconds: number): void {
  if (typeof window === 'undefined') return;

  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const session: GuestSession = {
    token,
    user,
    expiresAt,
  };

  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(session));

  // Set cookie for Next.js SSR middleware
  document.cookie = `${GUEST_COOKIE_NAME}=${token}; path=/; max-age=${expiresInSeconds}; SameSite=Lax`;

  // Dispatch custom event for components listening to guest auth state
  window.dispatchEvent(new Event('codearena:guest-auth-change'));
}

/**
 * Clear guest session from both localStorage and document.cookie.
 */
export function clearGuestSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(GUEST_STORAGE_KEY);
  document.cookie = `${GUEST_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

  window.dispatchEvent(new Event('codearena:guest-auth-change'));
}
