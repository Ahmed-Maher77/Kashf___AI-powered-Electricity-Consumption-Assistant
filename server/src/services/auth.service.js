import bcrypt from "bcryptjs";
import User from "../../database/models/user.model.js";
import { USER_ROLES, SUBSCRIPTION_PLANS, DEFAULT_SUBSCRIPTION_PLAN } from "../config/auth.constants.js";
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

    return {
        user: toPublicUser(user),
        accessToken,
    };
};

export const logout = async ({ res }) => {
    clearAuthCookies(res);
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

        return toPublicUser(user);
    } catch (error) {
        await deleteFromCloudinary(pictureUrl);
        throw error;
    }
};

export const hashPasswordForSeed = hashPassword;
