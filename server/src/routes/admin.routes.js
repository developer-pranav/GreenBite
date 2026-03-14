import { Router } from "express";
import { getDashboard } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // tera existing middleware

const router = Router();

// GET /api/admin/dashboard
router.get("/dashboard", verifyJWT, getDashboard);

export default router;
