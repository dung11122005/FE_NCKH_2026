// api.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Mutex } from "async-mutex";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Kiểu dữ liệu trả về khi refresh token
interface AccessTokenResponse {
    access_token: string;
}

// Kiểu dữ liệu chuẩn backend response
export interface IBackendRes<T> {
    statusCode: number | string;
    message: string;
    error?: string | string[];
    data?: T;
}

/**
 * Khởi tạo axios instance
 */
const instance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8080",
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
            const res = await instance.get<IBackendRes<AccessTokenResponse>>("/api/v1/auth/refresh");

            if (res.data?.data?.access_token) {
                const newToken = res.data.data.access_token;
                await AsyncStorage.setItem("access_token", newToken);
                return newToken;
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
instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // Nếu là login thì không gắn token
    if (config.url === "/api/v1/auth/login") return config;

    const token = await AsyncStorage.getItem("access_token");
    if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // Set default headers nếu chưa có
    config.headers = config.headers || {};
    if (!(config.headers as any).Accept) (config.headers as any).Accept = "application/json";
    if (!(config.headers as any)["Content-Type"]) (config.headers as any)["Content-Type"] = "application/json; charset=utf-8";

    return config;
});

/**
 * Response interceptor
 */
instance.interceptors.response.use(
    (res) => res.data,
    async (error: AxiosError<any>) => {
        const originalConfig: any = error.config;

        // Nếu 401 và không phải login, thử refresh token
        if (
            error.response?.status === 401 &&
            originalConfig &&
            originalConfig.url !== "/api/v1/auth/login" &&
            !originalConfig.headers?.[NO_RETRY_HEADER]
        ) {
            const newToken = await handleRefreshToken();
            if (newToken) {
                originalConfig.headers[NO_RETRY_HEADER] = "true";
                originalConfig.headers["Authorization"] = `Bearer ${newToken}`;
                return instance.request(originalConfig);
            }
        }

        return Promise.reject(error);
    }
);


export default instance;
