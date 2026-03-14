import mongoose, { Schema } from "mongoose";

const mealSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    name: {
      type: String,
    },
    icon: {
      type: String,
    },
    time: {
      type: String,
    },
    deadline: {
      type: String,
    },
    items: [
      {
        i: String,
        n: String,
      }
    ],
    yesCount: {
      type: Number,
      default: 0,
    },

    noCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Meal = mongoose.model("Meal", mealSchema);
