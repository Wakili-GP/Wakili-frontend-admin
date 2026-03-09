import axios, { AxiosError } from "axios";
const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor — attach token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — handle 401/403 + normalize errors
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    // Normalize error message for consumers
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  },
);

export default httpClient;
