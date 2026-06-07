import bcrypt from "bcryptjs";
import User from "../../database/models/user.model.js";
import { USER_ROLES, SUBSCRIPTION_PLANS, DEFAULT_SUBSCRIPTION_PLAN } from "../config/auth.constants.js";
import { ACTIVITY_TYPES } from "../config/activity.constants.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";
import { toPublicUser } from "../utils/userMapper.js";
import {
    clearAuthCookies,
    setAuthCookies,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "./token.service.js";
import { logActivity } from "./activity.service.js";

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const buildTokens = (user) => {
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { accessToken, refreshToken };
};

export const register = async ({ body, file, res }) => {
    const { username, email, password } = body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        throw new AppError("Email or username already in use.", 409);
    }

    let pictureUrl = null;

    if (file) {
        pictureUrl = await uploadToCloudinary(file.buffer);
    }

    try {
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: USER_ROLES.USER,
            subscriptionPlan: DEFAULT_SUBSCRIPTION_PLAN,
            picture: pictureUrl,
        });

        const { accessToken, refreshToken } = buildTokens(user);
        setAuthCookies(res, { accessToken, refreshToken });

        // Log registration activity (non-blocking)
        logActivity(user._id, ACTIVITY_TYPES.REGISTER);

        return {
            user: toPublicUser(user),
            accessToken,
        };
    } catch (error) {
        if (pictureUrl) {
            await deleteFromCloudinary(pictureUrl);
        }
        throw error;
    }
};

export const login = async ({ body, res }) => {
    const { email, password } = body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid email or password.", 401);
    }

    const { accessToken, refreshToken } = buildTokens(user);
    setAuthCookies(res, { accessToken, refreshToken });

    // Log login activity (non-blocking)
    logActivity(user._id, ACTIVITY_TYPES.LOGIN);

    return {
        user: toPublicUser(user),
        accessToken,
    };
};

export const logout = async ({ res, userId }) => {
    clearAuthCookies(res);
    if (userId) logActivity(userId, ACTIVITY_TYPES.LOGOUT);
};

export const refreshToken = async ({ refreshTokenValue, res }) => {
    if (!refreshTokenValue) {
        throw new AppError("Refresh token is required.", 401);
    }

    let decoded;

    try {
        decoded = verifyRefreshToken(refreshTokenValue);
    } catch {
        throw new AppError("Invalid or expired refresh token.", 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        throw new AppError("Invalid refresh token.", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = buildTokens(user);
    setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });

    return { accessToken };
};

export const getMe = async ({ userId }) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    return toPublicUser(user);
};

export const updateProfilePicture = async ({ userId, file }) => {
    if (!file) {
        throw new AppError("Profile picture is required.", 400);
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const previousPicture = user.picture;
    const pictureUrl = await uploadToCloudinary(file.buffer);

    try {
        user.picture = pictureUrl;
        await user.save();

        if (previousPicture) {
            await deleteFromCloudinary(previousPicture);
        }

        logActivity(userId, ACTIVITY_TYPES.PICTURE_UPDATED);

        return toPublicUser(user);
    } catch (error) {
        await deleteFromCloudinary(pictureUrl);
        throw error;
    }
};

// ─── Edit Profile ──────────────────────────────────────────────────────────────

export const updateProfile = async ({ userId, body }) => {
    const { username, phone, governorate, preferredLanguage } = body;

    // Check username uniqueness if being changed
    if (username) {
        const existing = await User.findOne({ username, _id: { $ne: userId } });
        if (existing) {
            throw new AppError("Username is already taken.", 409);
        }
    }

    const updates = {};
    if (username          !== undefined) updates.username          = username;
    if (phone             !== undefined) updates.phone             = phone || null;
    if (governorate       !== undefined) updates.governorate       = governorate || null;
    if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!user) throw new AppError("User not found.", 404);

    logActivity(userId, ACTIVITY_TYPES.PROFILE_UPDATED);

    return toPublicUser(user);
};

// ─── Consumption Goals ─────────────────────────────────────────────────────────

export const updateGoals = async ({ userId, goals }) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { consumptionGoals: goals } },
        { new: true, runValidators: true }
    );

    if (!user) throw new AppError("User not found.", 404);

    logActivity(userId, ACTIVITY_TYPES.GOALS_UPDATED);

    return toPublicUser(user);
};

// ─── Notification Preferences ──────────────────────────────────────────────────

export const updateNotificationPrefs = async ({ userId, prefs }) => {
    // Build a $set object with only the provided keys
    const setFields = {};
    for (const [key, value] of Object.entries(prefs)) {
        setFields[`notificationPreferences.${key}`] = value;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: setFields },
        { new: true, runValidators: true }
    );

    if (!user) throw new AppError("User not found.", 404);

    logActivity(userId, ACTIVITY_TYPES.NOTIFICATION_PREFS_UPDATED);

    return toPublicUser(user);
};

export const hashPasswordForSeed = hashPassword;
