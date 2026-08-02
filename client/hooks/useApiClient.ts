import { useAuth } from "@clerk/nextjs";
import { apiRequest } from "@/lib/api";
import { useMemo } from "react";

/**
 * A hook that provides a pre-authenticated API client.
 * It automatically retrieves the Clerk JWT token and attaches it to request headers.
 */
export function useApiClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = await getToken();
      return apiRequest<T>(path, options, token);
    };

    return {
      get: <T>(path: string, options?: Omit<RequestInit, "method">) =>
        request<T>(path, { ...options, method: "GET" }),
        
      post: <T>(path: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
        request<T>(path, {
          ...options,
          method: "POST",
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),
        
      put: <T>(path: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
        request<T>(path, {
          ...options,
          method: "PUT",
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),
        
      patch: <T>(path: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
        request<T>(path, {
          ...options,
          method: "PATCH",
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),
        
      delete: <T>(path: string, options?: Omit<RequestInit, "method">) =>
        request<T>(path, { ...options, method: "DELETE" }),
    };
  }, [getToken]);
}

