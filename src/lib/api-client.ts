/**
 * API Client Configuration
 * Central place for configuring API requests
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, unknown>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * Make API request with error handling and token management
 */
export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, params } = config;

  try {
    // Build URL with query params
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Get auth token from localStorage
    const token = localStorage.getItem("adminToken");
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle auth errors
      if (response.status === 401) {
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      }

      return {
        error: data.message || data.error || "Request failed",
        status: response.status,
      };
    }

    return {
      data: data.data || data,
      status: response.status,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      error: errorMessage,
      status: 0,
    };
  }
}

/**
 * Convenience methods for HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    apiRequest<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};
