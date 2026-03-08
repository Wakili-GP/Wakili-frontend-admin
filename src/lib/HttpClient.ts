import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL.startsWith("http")
    ? API_BASE_URL
    : `${window.location.origin}${API_BASE_URL}`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptors
httpClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptors
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error(
        "[Response Error]",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("[No Response]", error.request);
    } else {
      console.error("[Axios Error]", error.message);
    }
    return Promise.reject(error);
  },
);

export default httpClient;
