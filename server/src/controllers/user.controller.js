import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiReq.js";
import { ApiResponse } from "../utils/apiRes.js";


export const createUser = asyncHandler(async (req, res) => {

    console.log(req.body);


    const { fullName, email, password, room, role } = req.body;

    if (!fullName || !email || !password || !room) {
        throw new ApiError(400, "fullName, email, password, and room are required fields");
    }

    const existed = await User.findOne({ email ,
    });

    if (existed) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        room,
        role: role || "student"
    });

    return res.json(
        new ApiResponse(200, user, "User created")
    );
});



export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isValid = await user.isPasswordCorrect(password);

    if (!isValid) {
        throw new ApiError(401, "Wrong password");
    }

    const accessToken = user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // ⚠️ change for localhost
        })
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "Login successful"
            )
        );
});




export const logoutUser = asyncHandler(async (req, res) => {

    return res
        .clearCookie("accessToken")
        .json(
            new ApiResponse(
                200,
                {},
                "Logout success"
            )
        );
});



export const getCurrentUser = asyncHandler(async (req, res) => {

    return res.json(
        new ApiResponse(
            200,
            req.user,
            "Current user"
        )
    );
});




export const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password");

    return res.json(
        new ApiResponse(
            200,
            users,
            "All users"
        )
    );
});
