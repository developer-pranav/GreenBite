import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Meal } from "../models/meal.model.js";
import { Coupon } from "../models/coupon.model.js";

const getTodayDate = () => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

const MEAL_META = {
  breakfast: { icon: "🌅", name: "Breakfast", time: "7:00 – 9:00 AM" },
  lunch:     { icon: "☀️", name: "Lunch",     time: "12:30 – 2:30 PM" },
  dinner:    { icon: "🌙", name: "Dinner",    time: "7:30 – 9:30 PM" },
};

// @route   GET /api/admin/dashboard
// @access  Admin only
export const getDashboard = async (req, res) => {
  try {
    const date = getTodayDate();

    // 1. Total students only (exclude admins)
    const totalStudents = await User.countDocuments({ role: "student" });

    // 2. Sum of all students' `point` field (tera field naam `point` hai)
    const pointsResult = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: null, total: { $sum: "$point" } } },
    ]);
    const pointsAwarded = pointsResult[0]?.total || 0;

    // 3. Total coupons claimed
    const couponResult = await Coupon.aggregate([
      { $project: { claimedCount: { $size: { $ifNull: ["$claimedBy", []] } } } },
      { $group: { _id: null, total: { $sum: "$claimedCount" } } },
    ]);
    const couponsClaimed = couponResult[0]?.total || 0;

    // 4. Today's bookings — opted/skipped per meal
    // Booking.status is "opt" or "skip"
    const todayBookings = await Booking.find({ date });

    const mealStats = {};
    ["breakfast", "lunch", "dinner"].forEach((mealType) => {
      const mealBookings = todayBookings.filter((b) => b.mealType === mealType);
      const opted   = mealBookings.filter((b) => b.status === "opt").length;
      const skipped = mealBookings.filter((b) => b.status === "skip").length;
      const pending = Math.max(0, totalStudents - opted - skipped);
      mealStats[mealType] = { opted, skipped, pending };
    });

    // 5. Total skipped today (waste saved)
    const wasteSaved = Object.values(mealStats).reduce(
      (sum, m) => sum + m.skipped,
      0
    );

    // 6. Try to get meal name/icon/time from Meal collection,
    //    fallback to hardcoded MEAL_META if not found
    const todayMeals = await Meal.find({ date });

    const meals = ["breakfast", "lunch", "dinner"].map((mealType) => {
      const mealDoc = todayMeals.find((m) => m.mealType === mealType);
      const meta    = MEAL_META[mealType];

      return {
        key:     mealType,
        icon:    mealDoc?.icon  || meta.icon,
        name:    mealDoc?.name  || meta.name,
        time:    mealDoc?.time  || meta.time,
        opted:   mealStats[mealType].opted,
        skipped: mealStats[mealType].skipped,
        pending: mealStats[mealType].pending,
      };
    });

    res.status(200).json({
      stats: {
        totalStudents,
        wasteSaved,
        pointsAwarded,
        couponsClaimed,
      },
      meals,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};
