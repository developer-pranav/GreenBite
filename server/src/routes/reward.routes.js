import { Router } from "express";
import {
  loginTodayReward,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  claimCoupon,
  getMyClaimed,
} from "../controllers/reward.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ─── login reward ─────────────────────────────
router.get("/login", verifyJWT, loginTodayReward);

// ─── coupon routes ────────────────────────────
router.get  ("/coupons",          verifyJWT, getCoupons);
router.get  ("/coupons/claimed",  verifyJWT, getMyClaimed);
router.post ("/coupons",          verifyJWT, createCoupon);
router.put  ("/coupons/:id",      verifyJWT, updateCoupon);
router.delete("/coupons/:id",     verifyJWT, deleteCoupon);
router.post ("/coupons/:id/claim",verifyJWT, claimCoupon);

export default router;
