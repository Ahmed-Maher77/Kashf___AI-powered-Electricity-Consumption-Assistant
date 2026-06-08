import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import metersReducer from "./meters/metersSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        meters: metersReducer,
    },
});

export default store;
