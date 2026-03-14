import { Router } from "express";

import {
    createMeal,
    getMeals,
    getTodayMeals,
    updateMeal,
    deleteMeal,
} from "../controllers/meal.controller.js";

import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();


// all users

router.get("/", verifyJWT, getMeals);

router.get("/today", verifyJWT, getTodayMeals);


// admin

router.post("/", verifyJWT, verifyRole("admin"), createMeal);

router.put("/:id", verifyJWT, verifyRole("admin"), updateMeal);
router.patch("/:id", verifyJWT, verifyRole("admin"), updateMeal);

router.delete("/:id", verifyJWT, verifyRole("admin"), deleteMeal);


export default router;
