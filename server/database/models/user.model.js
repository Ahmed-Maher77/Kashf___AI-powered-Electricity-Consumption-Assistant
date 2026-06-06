import mongoose from "mongoose";
import { USER_ROLES } from "../../src/config/auth.constants.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
            default: USER_ROLES.USER,
        },
        picture: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
