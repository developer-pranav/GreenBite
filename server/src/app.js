import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import mealRoutes from "./routes/meal.routes.js";
import rewardRoutes from "./routes/reward.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { ApiError } from "./utils/apiReq.js";

const app = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/v1/reward",   rewardRoutes);
app.use("/api/v1/users",    userRoutes);
app.use("/api/v1/meals",    mealRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin",    adminRoutes);

// test route
app.get("/", (req, res) => {
    res.send("Server running");
});

// global error handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

export { app };
