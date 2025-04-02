import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./signup/authSlice"; 
import blogReducer from "./blog/blogSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blogReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
