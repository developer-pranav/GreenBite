import { Router } from "express";

import {
    createUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUsers,
} from "../controllers/user.controller.js";

import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();


// login

router.post("/login", loginUser);



// current user

router.get("/me", verifyJWT, getCurrentUser);

router.post("/logout", verifyJWT, logoutUser);


// admin

router.post("/", verifyJWT, verifyRole("admin"), createUser);

router.get("/", verifyJWT, verifyRole("admin"), getUsers);


export default router;
