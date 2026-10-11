import { clientConfig } from "./config";

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);
  
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const apiUrl = clientConfig.apiUrl;
  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      credentials: options.credentials || "include",
      headers,
    });
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        0,
        `Unable to reach backend server at ${apiUrl}${path}. Please verify server network connectivity and environment settings.`
      );
    }
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `API request failed with status ${response.status}`,
      errorData
    );
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
