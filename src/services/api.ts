import { IAccount, IBackendRes, IGetAccount, IUser } from "../types/backend";
import axios from "./axios-customize";

/**
 * Module Auth
 */

// Đăng ký
export const callRegister = (
    name: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    address: string
) => {
    return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
        name,
        email,
        password,
        age,
        gender,
        address,
    });
};

// Đăng nhập
export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
        username,
        password,
    });
};

// Lấy thông tin account
export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

// Refresh token
export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh");
};

// Đăng xuất
export const callLogout = () => {
    return axios.post<IBackendRes<string>>("/api/v1/auth/logout");
};
