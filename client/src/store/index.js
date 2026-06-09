import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import metersReducer from "./meters/metersSlice";
import billsReducer from "./bills/billsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        meters: metersReducer,
        bills: billsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.user.token'],
            },
        }),
});

export default store;
