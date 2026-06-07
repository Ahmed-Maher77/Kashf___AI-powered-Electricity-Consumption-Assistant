import { createSlice } from "@reduxjs/toolkit";
import { USER_ROLES, SUBSCRIPTION_PLANS } from "../../auth/authConstants";
import {
    clearAuthSession,
    persistAuthSession,
    readAuthSession,
    setUserProfile,
} from "../../auth/authStorage";
import { normalizeUserProfile } from "../../auth/userProfile";

const mapSessionToState = (session) => ({
    accessToken: session.accessToken,
    role: session.role,
    user: session.user ?? null,
    isAuthenticated: session.isAuthenticated,
});

const initialSession = readAuthSession();

const authSlice = createSlice({
    name: "auth",
    initialState: mapSessionToState(initialSession),
    reducers: {
        login: (state, action) => {
            const {
                accessToken,
                role = USER_ROLES.USER,
                user = null,
            } = action.payload;
            const nextSession = persistAuthSession({ accessToken, role, user });
            const mapped = mapSessionToState(nextSession);

            if (!mapped.user && user) {
                const profile = normalizeUserProfile(user);

                if (profile) {
                    setUserProfile(profile);
                    mapped.user = profile;
                }
            }

            Object.assign(state, mapped);
        },
        logout: (state) => {
            clearAuthSession();
            state.accessToken = null;
            state.role = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        setUser: (state, action) => {
            const profile = normalizeUserProfile(action.payload);

            if (!profile) {
                return;
            }

            setUserProfile(profile);
            state.user = profile;
        },
        refreshSession: (state) => {
            let nextSession = readAuthSession();

            if (!nextSession.isAuthenticated) {
                clearAuthSession();
                nextSession = {
                    accessToken: null,
                    role: null,
                    user: null,
                    isAuthenticated: false,
                };
            }

            Object.assign(state, mapSessionToState(nextSession));
        },
    },
});

export const { login, logout, setUser, refreshSession } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.role === USER_ROLES.ADMIN;
export const selectSubscriptionPlan = (state) => state.auth.user?.subscriptionPlan ?? SUBSCRIPTION_PLANS.FREE;
export const selectIsPlusOrFamily = (state) => {
    const plan = state.auth.user?.subscriptionPlan;
    return plan === SUBSCRIPTION_PLANS.PLUS || plan === SUBSCRIPTION_PLANS.FAMILY;
};

export default authSlice.reducer;
