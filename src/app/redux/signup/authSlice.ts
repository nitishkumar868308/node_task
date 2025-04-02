/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (values: { email: string; password: string; profileImage: File | null }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);
            if (values.profileImage) {
                formData.append("profileImage", values.profileImage);
            }

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: formData,
            });

            console.log("res" , res )
            
            if (!res.ok) {
                const data = await res.json();
                console.log("data" , data)
                return rejectWithValue(data.message || "Signup failed");
            }

            const userData = await res.json(); 
            console.log("userData" , userData)

            // ✅ Auto-login after successful registration
            const loginResult = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (loginResult?.error) {
                return rejectWithValue("Signup successful, but login failed.");
            }

            return userData; // ✅ Return user data after successful login
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null as string | null,
    },
    reducers: {}, // No synchronous reducers needed here
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // ✅ Store user data after login
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
