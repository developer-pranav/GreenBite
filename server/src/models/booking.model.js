import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    status: {
      type: String,
      enum: ["opt", "skip"],
      default: "opt",
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model(
  "Booking",
  bookingSchema
);
