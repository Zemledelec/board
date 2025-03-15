"use client";

import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/types";

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
};

const initialState: AuthState = {
    user: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null,
    isAuthenticated: typeof window !== "undefined" ? !!sessionStorage.getItem("user") : false,
};

export const loginUser = createAsyncThunk<User, string, { rejectValue: string }>(
    "auth/loginUser",
    async (username, {rejectWithValue}) => {
        try {
            const response = await fetch("https://my-json-server.typicode.com/Zemledelec/board/users");
            if (!response.ok) {
                return rejectWithValue("Failed to fetch users");
            }
            const users: User[] = await response.json();
            const foundUser = users.find((user) => user.username === username);

            if (!foundUser) {
                return rejectWithValue("User not found!");
            }

            sessionStorage.setItem("user", JSON.stringify(foundUser));

            return foundUser;
        } catch {
            return rejectWithValue("Network error!");
        }
    }
);

// **Slice**
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem("user");
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            console.error("Login failed:", action.payload);
        });
    },
});

export const {logout, setUser} = authSlice.actions;
export default authSlice.reducer;
