import { User } from '@/types';

export const NATIVE_ACCESS_TOKEN_KEY = 'codearena_access_token';
export const NATIVE_USER_KEY = 'codearena_user_profile';
export const NATIVE_COOKIE_NAME = 'codearena_access_token';
export const NATIVE_SESSION_COOKIE = 'codearena_session';

export const NATIVE_ACCESS_TOKEN_MAX_AGE = 900; // 15 minutes in seconds (matches JWT_ACCESS_EXPIRES_IN)

// In-memory access token cache (prioritized over storage to mitigate XSS surface)
let inMemoryAccessToken: string | null = null;

export function getAccessToken(): string | null {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  if (typeof window === 'undefined') return null;

  // 1. Check tab-scoped sessionStorage
  const sessionToken = sessionStorage.getItem(NATIVE_ACCESS_TOKEN_KEY);
  if (sessionToken) {
    inMemoryAccessToken = sessionToken;
    return sessionToken;
  }

  // 2. Check localStorage
  const localToken = localStorage.getItem(NATIVE_ACCESS_TOKEN_KEY);
  if (localToken) {
    inMemoryAccessToken = localToken;
    return localToken;
  }

  return null;
}

export function getNativeUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(NATIVE_USER_KEY) || localStorage.getItem(NATIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setNativeSession(
  accessToken: string,
  user: User,
  expiresInSeconds: number = NATIVE_ACCESS_TOKEN_MAX_AGE
): void {
  inMemoryAccessToken = accessToken;
  if (typeof window === 'undefined') return;

  sessionStorage.setItem(NATIVE_ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(NATIVE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(NATIVE_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(NATIVE_USER_KEY, JSON.stringify(user));

  const maxAge = expiresInSeconds || NATIVE_ACCESS_TOKEN_MAX_AGE;

  // Set lightweight session flag cookie for Next.js edge middleware routing checks.
  // Note: We avoid placing the raw signed JWT token in document.cookie.
  document.cookie = `${NATIVE_COOKIE_NAME}=active; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${NATIVE_SESSION_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;

  window.dispatchEvent(new Event('codearena:native-auth-change'));
}

export function clearNativeSession(): void {
  inMemoryAccessToken = null;
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(NATIVE_ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(NATIVE_USER_KEY);
  localStorage.removeItem(NATIVE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(NATIVE_USER_KEY);

  document.cookie = `${NATIVE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${NATIVE_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;

  window.dispatchEvent(new Event('codearena:native-auth-change'));
}

export function isNativeAuthActive(): boolean {
  return getAccessToken() !== null;
}
