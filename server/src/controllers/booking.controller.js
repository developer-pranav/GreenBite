import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";

import points from "../config/points.config.json" with { type: "json" };

import { ApiError } from "../utils/apiReq.js";
import { ApiResponse } from "../utils/apiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";



/* =========================
   CREATE BOOKING
========================= */

export const createBooking = asyncHandler(async (req, res) => {

    const { mealType, date, status } = req.body;

    if (!mealType || !date || status === undefined) {
        throw new ApiError(400, "All fields required");
    }

    const existing = await Booking.findOne({
        user: req.user._id,
        mealType,
        date,
    });

    if (existing) {
        throw new ApiError(400, "Booking already exists");
    }

    const booking = await Booking.create({
        user: req.user._id,
        mealType,
        date,
        status,
    });

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const pts =
        points.decision?.[mealType] || 0;

    if (!user.point) {
        user.point = 0;
    }

    user.point += pts;

    await user.save();

    console.log(
        "Meal:",
        mealType,
        "Points:",
        pts,
        "Total:",
        user.point
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                booking,
                point: user.point,
            },
            "Booking created"
        )
    );
});



/* =========================
   MY BOOKINGS
========================= */

export const getMyBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id,
    }).sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(200, bookings, "My bookings")
    );
});



/* =========================
   ALL BOOKINGS
========================= */

export const getAllBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find()
        .populate("user", "fullName email room role")
        .sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(200, bookings, "All bookings")
    );
});



/* =========================
   UPDATE BOOKING
========================= */

export const updateBooking = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (
        booking.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        throw new ApiError(403, "Not allowed");
    }

    const user = await User.findById(
        booking.user
    );

    const pts =
        points.decision?.[
            booking.mealType
        ] || 0;

    // remove old

    user.point -= pts;

    booking.status = status;

    await booking.save();

    // add new

    user.point += pts;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking updated"
        )
    );
});



/* =========================
   DELETE BOOKING
========================= */

export const deleteBooking = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const user = await User.findById(
        booking.user
    );

    const pts =
        points.decision?.[
            booking.mealType
        ] || 0;

    user.point -= pts;

    await user.save();

    await booking.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Booking deleted"
        )
    );
});
