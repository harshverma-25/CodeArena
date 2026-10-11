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

  const baseUrl = clientConfig.apiUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      credentials: options.credentials || "include",
      headers,
    });
  } catch (error: any) {
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      throw new ApiError(
        408,
        `Request to backend at ${fullUrl} timed out. The server may be starting up or under heavy load.`
      );
    }

    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      throw new ApiError(
        0,
        `Network or CORS error connecting to ${fullUrl}. Please verify server availability and CORS configuration.`
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      0,
      `Network request failed: ${error?.message || "Unknown error"}`
    );
  }

  if (!response.ok) {
    let errorData: any = {};
    try {
      const text = await response.text();
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text.trim() || `HTTP ${response.status} ${response.statusText}` };
      }
    } catch {
      errorData = { message: `HTTP ${response.status} ${response.statusText}` };
    }

    const message =
      errorData.message ||
      errorData.error ||
      `API request failed with status ${response.status} (${response.statusText || "Error"})`;

    throw new ApiError(response.status, message, errorData);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch (parseError: any) {
    throw new ApiError(
      response.status,
      `Malformed JSON response from backend: ${parseError.message}`
    );
  }
}
