import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import uploadProfilePicture from "../middlewares/uploadProfilePicture.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { loginSchema, signupSchema } from "./user.validation.js";
import * as userController from "./user.controller.js";

const router = Router();

router.post(
    "/register",
    uploadProfilePicture,
    validateRequestBody(signupSchema),
    userController.register
);
router.post("/login", validateRequestBody(loginSchema), userController.login);
router.post("/logout", userController.logout);
router.get("/me", isAuthenticated, userController.me);
router.patch(
    "/profile/picture",
    isAuthenticated,
    uploadProfilePicture,
    userController.updateProfilePicture
);
router.post("/refresh-token", userController.refreshToken);

export default router;
