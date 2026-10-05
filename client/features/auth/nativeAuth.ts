import { User } from '@/types';

export const NATIVE_ACCESS_TOKEN_KEY = 'codearena_access_token';
export const NATIVE_USER_KEY = 'codearena_user_profile';
export const NATIVE_COOKIE_NAME = 'codearena_access_token';

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

export function setNativeSession(accessToken: string, user: User): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(NATIVE_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(NATIVE_USER_KEY, JSON.stringify(user));

  // Set non-httponly cookie for middleware routing checks
  document.cookie = `${NATIVE_COOKIE_NAME}=${accessToken}; path=/; max-age=604800; SameSite=Lax`;

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
