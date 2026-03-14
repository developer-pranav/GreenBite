import { Meal } from "../models/meal.model.js";
import { ApiError } from "../utils/apiReq.js";
import { ApiResponse } from "../utils/apiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createMeal = asyncHandler(async (req, res) => {

    const { mealType, date, isActive, name, icon, time, deadline, items } = req.body;

    if (!mealType || !date) {
        throw new ApiError(400, "mealType and date required");
    }

    const existing = await Meal.findOne({
        mealType,
        date,
    });

    if (existing) {
        throw new ApiError(400, "Meal already exists");
    }

    const meal = await Meal.create({
        mealType,
        date,
        isActive,
        name,
        icon,
        time,
        deadline,
        items
    });

    return res.status(201).json(
        new ApiResponse(201, meal, "Meal created")
    );
});



export const getMeals = asyncHandler(async (req, res) => {

    const meals = await Meal.find().sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(200, meals, "Meals list")
    );
});



export const getTodayMeals = asyncHandler(async (req, res) => {

    const today = new Date();

    const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
    );

    const meals = await Meal.find({
        date: {
            $gte: start,
            $lt: end,
        },
    });

    return res.status(200).json(
        new ApiResponse(200, meals, "Today meals")
    );
});



export const updateMeal = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const meal = await Meal.findById(id);

    if (!meal) {
        throw new ApiError(404, "Meal not found");
    }

    const { mealType, date, isActive, name, icon, time, deadline, items } = req.body;

    if (mealType !== undefined) meal.mealType = mealType;
    if (date !== undefined) meal.date = date;
    if (isActive !== undefined) meal.isActive = isActive;
    if (name !== undefined) meal.name = name;
    if (icon !== undefined) meal.icon = icon;
    if (time !== undefined) meal.time = time;
    if (deadline !== undefined) meal.deadline = deadline;
    if (items !== undefined) meal.items = items;

    await meal.save();

    return res.status(200).json(
        new ApiResponse(200, meal, "Meal updated")
    );
});



export const deleteMeal = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const meal = await Meal.findById(id);

    if (!meal) {
        throw new ApiError(404, "Meal not found");
    }

    await meal.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Meal deleted")
    );
});
