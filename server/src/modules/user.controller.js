import { AUTH_COOKIE_KEYS } from "../config/auth.constants.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as authService from "../services/auth.service.js";

const register = asyncHandler(async (req, res) => {
    const result = await authService.register({
        body: req.body,
        file: req.file,
        res,
    });

    res.status(201).json({
        success: true,
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.login({
        body: req.body,
        res,
    });

    res.status(200).json({
        success: true,
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const logout = asyncHandler(async (req, res) => {
    await authService.logout({ res });

    res.status(200).json({ success: true, message: "Logged out successfully." });
});

const refreshToken = asyncHandler(async (req, res) => {
    const refreshTokenValue = req.cookies?.[AUTH_COOKIE_KEYS.REFRESH_TOKEN];

    const result = await authService.refreshToken({
        refreshTokenValue,
        res,
    });

    res.status(200).json({
        success: true,
        data: {
            accessToken: result.accessToken,
        },
    });
});

const me = asyncHandler(async (req, res) => {
    const user = await authService.getMe({ userId: req.user.id });

    res.status(200).json({
        success: true,
        data: { user },
    });
});

const updateProfilePicture = asyncHandler(async (req, res) => {
    const user = await authService.updateProfilePicture({
        userId: req.user.id,
        file: req.file,
    });

    res.status(200).json({
        success: true,
        data: { user },
    });
});

export { register, login, logout, refreshToken, me, updateProfilePicture };
