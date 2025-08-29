import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Mutex } from "async-mutex";
import { IBackendRes } from "../types/backend";


interface AccessTokenResponse {
    access_token: string;
}

/**
 * Khởi tạo axios instance
 */
const instance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8080", // đổi ENV theo RN
    withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

/**
 * Hàm refresh token
 */
const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        try {
            const res = await instance.get<IBackendRes<AccessTokenResponse>>(
                "/api/v1/auth/refresh"
            );
            if (res?.data?.data?.access_token) {
                return res.data.data.access_token;
            }
            return null;
        } catch (e) {
            return null;
        }
    });
};

/**
 * Request interceptor
 */
instance.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
    const token =
        typeof localStorage !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

    if (token) {
        config.headers = config.headers || {};
        // Axios v1 headers -> dùng set() hoặc ép any
        (config.headers as any).Authorization = `Bearer ${token}`;
    }

    if (!(config.headers as any).Accept && (config.headers as any)["Content-Type"]) {
        (config.headers as any).Accept = "application/json";
        (config.headers as any)["Content-Type"] = "application/json; charset=utf-8";
    }

    return config;
});

/**
 * Response interceptor
 */
instance.interceptors.response.use(
    (res) => res.data,
    async (error: AxiosError<any>) => {
        const originalConfig: any = error.config;

        // Unauthorized -> refresh token
        if (
            error.response &&
            error.response.status === 401 &&
            originalConfig &&
            originalConfig.url !== "/api/v1/auth/login" &&
            !originalConfig.headers[NO_RETRY_HEADER]
        ) {
            const newToken = await handleRefreshToken();
            if (newToken) {
                originalConfig.headers[NO_RETRY_HEADER] = "true";
                originalConfig.headers["Authorization"] = `Bearer ${newToken}`;
                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("access_token", newToken);
                }
                return instance.request(originalConfig);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
