import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/health", isAuthenticated, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "ok",
            userId: req.user.id,
            role: req.user.role,
        },
    });
});

export default router;
