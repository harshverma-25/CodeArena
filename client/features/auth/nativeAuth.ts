import { User } from '@/types';

export const NATIVE_ACCESS_TOKEN_KEY = 'codearena_access_token';
export const NATIVE_USER_KEY = 'codearena_user_profile';
export const NATIVE_COOKIE_NAME = 'codearena_access_token';

export const NATIVE_ACCESS_TOKEN_MAX_AGE = 900; // 15 minutes in seconds (matches JWT_ACCESS_EXPIRES_IN)

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(NATIVE_ACCESS_TOKEN_KEY);
}

export function getNativeUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(NATIVE_USER_KEY);
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
  if (typeof window === 'undefined') return;

  localStorage.setItem(NATIVE_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(NATIVE_USER_KEY, JSON.stringify(user));

  const maxAge = expiresInSeconds || NATIVE_ACCESS_TOKEN_MAX_AGE;

  // Set non-httponly cookie for middleware routing checks (aligned to 15m access token lifespan)
  document.cookie = `${NATIVE_COOKIE_NAME}=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;

  window.dispatchEvent(new Event('codearena:native-auth-change'));
}

export function clearNativeSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(NATIVE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(NATIVE_USER_KEY);

  document.cookie = `${NATIVE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

  window.dispatchEvent(new Event('codearena:native-auth-change'));
}

export function isNativeAuthActive(): boolean {
  return getAccessToken() !== null;
}
