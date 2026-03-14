import { User } from "../models/user.model.js";
import { Coupon } from "../models/coupon.model.js";

// ─── existing login reward ────────────────────────────────────────────────────

export const loginTodayReward = async (req, res) => {
  const user = await User.findById(req.user._id);

  const today = new Date().toDateString();
  const last = user.lastLoginDate
    ? new Date(user.lastLoginDate).toDateString()
    : null;

  if (today !== last) {
    user.point += 5;
    user.isLoginToday = true;
    user.lastLoginDate = new Date();
    await user.save();
    return res.json({ reward: true, points: user.point });
  }

  return res.json({ reward: false, points: user.point });
};

// ─── COUPON CRUD (admin) ──────────────────────────────────────────────────────

// GET /api/v1/reward/coupons
export const getCoupons = async (req, res) => {
  try {
    // admin sees all, student sees only active
    const filter = req.user.role === "admin" ? {} : { active: true };
    const coupons = await Coupon.find(filter).select("-claimedBy");

    // normalize: send `pts` field so frontend works without change
    const normalized = coupons.map((c) => ({
      ...c.toObject(),
      pts: c.pointsRequired,
      name: c.title,
    }));

    return res.json({ success: true, data: normalized });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/reward/coupons  (admin)
export const createCoupon = async (req, res) => {
  try {
    const { name, title, pts, pointsRequired, description, brand, emoji, cat, validity, active } = req.body;

    const coupon = await Coupon.create({
      title: title || name,
      pointsRequired: pointsRequired || pts,
      description,
      brand,
      emoji,
      cat,
      validity,
      active: active ?? true,
    });

    return res.status(201).json({
      success: true,
      data: { ...coupon.toObject(), pts: coupon.pointsRequired, name: coupon.title },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/reward/coupons/:id  (admin)
export const updateCoupon = async (req, res) => {
  try {
    const { name, title, pts, pointsRequired, ...rest } = req.body;

    const updateData = { ...rest };
    if (title || name) updateData.title = title || name;
    if (pointsRequired || pts) updateData.pointsRequired = pointsRequired || pts;

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    return res.json({
      success: true,
      data: { ...coupon.toObject(), pts: coupon.pointsRequired, name: coupon.title },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/reward/coupons/:id  (admin)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    return res.json({ success: true, message: "Coupon deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CLAIM (student) ──────────────────────────────────────────────────────────

// POST /api/v1/reward/coupons/:id/claim
export const claimCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    if (!coupon.active) return res.status(400).json({ success: false, message: "Coupon is not active" });

    // already claimed?
    if (coupon.claimedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already claimed" });
    }

    // check points — tera field `point` hai
    const user = await User.findById(req.user._id);
    if (user.point < coupon.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: `Need ${coupon.pointsRequired - user.point} more points`,
      });
    }

    // deduct points + record claim
    user.point -= coupon.pointsRequired;
    await user.save();

    coupon.claimedBy.push(req.user._id);
    await coupon.save();

    return res.json({
      success: true,
      message: `"${coupon.title}" claimed!`,
      pointsSpent: coupon.pointsRequired,
      remainingPoints: user.point,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/reward/coupons/claimed  (student)
export const getMyClaimed = async (req, res) => {
  try {
    const coupons = await Coupon.find({ claimedBy: req.user._id }).select("-claimedBy");
    const normalized = coupons.map((c) => ({
      ...c.toObject(),
      pts: c.pointsRequired,
      name: c.title,
    }));
    return res.json({ success: true, data: normalized });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
