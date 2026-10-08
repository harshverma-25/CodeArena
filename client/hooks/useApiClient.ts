import { apiRequest } from "@/lib/api";
import { useMemo } from "react";
import { getAccessToken, setNativeSession, clearNativeSession } from "@/features/auth/nativeAuth";
import { getGuestToken } from "@/features/auth/guestAuth";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

/**
 * A hook that provides a pre-authenticated API client using Native JWT & Guest Tokens.
 * Handles automatic token attachment and transparent 401 refresh token rotation.
 */
export function useApiClient() {
  return useMemo(() => {
    const request = async <T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> => {
      let token = getAccessToken() || getGuestToken();

      try {
        return await apiRequest<T>(path, options, token);
      } catch (err: any) {
        // If 401 Unauthorized and we have a native access token, attempt token refresh once
        if (
          !isRetry &&
          err?.statusCode === 401 &&
          getAccessToken() &&
          !path.includes("/auth/refresh") &&
          !path.includes("/auth/login")
        ) {
          if (isRefreshing) {
            return new Promise<T>((resolve, reject) => {
              failedQueue.push({
                resolve: () => {
                  const newToken = getAccessToken() || getGuestToken();
                  apiRequest<T>(path, options, newToken).then(resolve).catch(reject);
                },
                reject: (error) => reject(error),
              });
            });
          }

          isRefreshing = true;

          let newAccessToken: string;
          try {
            const refreshRes = await apiRequest<{
              data: { accessToken: string; refreshToken: string; user: any };
            }>("/auth/refresh", { method: "POST" });

            if (refreshRes?.data?.accessToken) {
              newAccessToken = refreshRes.data.accessToken;
              setNativeSession(newAccessToken, refreshRes.data.user);
              isRefreshing = false;
              processQueue(null);
            } else {
              throw new Error("Refresh token invalid");
            }
          } catch (refreshErr: any) {
            isRefreshing = false;
            processQueue(refreshErr);
            clearNativeSession();
            throw err;
          }

          return apiRequest<T>(path, options, newAccessToken);
        }
        throw err;
      }
    };

    return {
      get: <T>(path: string, options?: Omit<RequestInit, "method">) =>
        request<T>(path, { ...options, method: "GET" }),

      post: <T>(path: string, body?: unknown, options?: Omit<RequestInit, "method" | "body">) =>
        request<T>(path, {
          ...options,
          method: "POST",
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),

      put: <T>(path: string, body?: unknown, options?: Omit<RequestInit, "method" | "body">) =>
        request<T>(path, {
          ...options,
          method: "PUT",
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),

      patch: <T>(path: string, body?: unknown, options?: Omit<RequestInit, "method" | "body">) =>
        request<T>(path, {
          ...options,
          method: "PATCH",
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),

      delete: <T>(path: string, options?: Omit<RequestInit, "method">) =>
        request<T>(path, { ...options, method: "DELETE" }),
    };
  }, []);
}
