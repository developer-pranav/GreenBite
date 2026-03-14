import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiReq.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// ✅ verify JWT

export const verifyJWT = asyncHandler(async (req, res, next) => {

    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
        throw new ApiError(401, "Invalid token");
    }

    req.user = user;

    next();
});



export const verifyRole = (role) => {

    return (req, res, next) => {

        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (req.user.role !== role) {
            throw new ApiError(403, "Forbidden");
        }

        next();
    };
};
