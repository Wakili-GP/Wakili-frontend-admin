import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * API Client Configuration
 * Central place for configuring API requests
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
 * Create axios instance with base URL
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL.startsWith("http")
    ? API_BASE_URL
    : `${window.location.origin}${API_BASE_URL}`,
  withCredentials: true,
  timeout: 30000,
});

/**
 * Request interceptor: Add auth token to headers
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

/**
 * Response interceptor: Handle errors and token expiration
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    // Don't automatically redirect on 401 - let components handle it
    // This allows for better UX and error handling
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/login") {
        // Log the error for debugging
        console.warn("Unauthorized access - clearing tokens");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Make API request with error handling and token management
 */
export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, params } = config;

  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data: body,
      params,
      headers,
    });

    return {
      data: response.data?.data || response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as Record<string, unknown>;
      const errorMessage =
        (typeof responseData?.message === "string"
          ? responseData.message
          : null) ||
        (typeof responseData?.error === "string" ? responseData.error : null) ||
        error.message ||
        "Request failed";

      return {
        error: errorMessage,
        status: error.response?.status || 0,
      };
    }

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

export default axiosInstance;
