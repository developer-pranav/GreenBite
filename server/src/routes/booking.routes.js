import { Router } from "express";

import {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBooking,
    deleteBooking,
} from "../controllers/booking.controller.js";

import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();


// user booking

router.post("/", verifyJWT, createBooking);

router.get("/my", verifyJWT, getMyBookings);

router.patch("/:id", verifyJWT, updateBooking);


// admin

router.get("/", verifyJWT, verifyRole("admin"), getAllBookings);

router.delete("/:id", verifyJWT, verifyRole("admin"), deleteBooking);


export default router;
