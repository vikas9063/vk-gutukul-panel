import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { getToken } from "@/services/AuthService";
import { BASE_URL_SECRET } from "@/secret";

const BASE_URL = BASE_URL_SECRET;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ----- Request interceptor -----
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else if (typeof config.headers === "object" && config.headers !== null) {
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ----- Response interceptor -----
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response, config } = error;

    if (
      response?.status === 401 &&
      (response.data as any)?.message === "Token Expired" &&
      config &&
      !(config as any)._retry
    ) {
      try {
        (config as any)._retry = true;

        const refreshToken = localStorage.getItem("REFRESH_TOKEN");
        if (refreshToken) {
          const refreshTokenPayload = { refreshToken };
          const res = await apiClient.post("/auth/token", refreshTokenPayload);

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          // Store new tokens
          localStorage.setItem("TOKEN", accessToken);
          localStorage.setItem("REFRESH_TOKEN", newRefreshToken);

          // Update Authorization header safely
          if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
          } else if (typeof config.headers === "object" && config.headers !== null) {
            (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
          }

          return apiClient(config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    else if (response?.status === 401 &&
      (response.data as any)?.detail === "Invalid Refresh Token" &&
      config &&
      !(config as any)._retry) {
        window.location.href="/auth/login"
    }

    return Promise.reject(error);
  }
);

export default apiClient;
