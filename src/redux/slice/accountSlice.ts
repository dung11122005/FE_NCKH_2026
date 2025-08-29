import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IGetAccount } from "../../types/backend";
import { callFetchAccount } from "../../services/api";


interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: IGetAccount["user"] | null;
    activeMenu: string;
}

const initialState: IState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: null,
    activeMenu: "home",
};

// AsyncThunk: fetch account info
export const fetchAccount = createAsyncThunk<IGetAccount["user"] | null>(
    "account/fetchAccount",
    async (_, { rejectWithValue }) => {
        try {
            const res = await callFetchAccount(); // axios.get<IBackendRes<IGetAccount>>
            return res.data.data?.user ?? null;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Fetch account failed");
        }
    }
);

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        setLogoutAction: (state) => {
            AsyncStorage.removeItem("access_token"); // xóa token khi logout
            state.isAuthenticated = false;
            state.user = null;
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.isAuthenticated = true;
                state.user = {
                    ...action.payload,
                    role: {
                        ...action.payload.role,
                        permissions: action.payload.role?.permissions ?? [],
                    },
                };
            } else {
                state.isAuthenticated = false;
                state.user = null;
            }
        });
        builder.addCase(fetchAccount.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        });
    },
});

export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
} = accountSlice.actions;

export default accountSlice.reducer;
