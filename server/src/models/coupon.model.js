import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // keeping pointsRequired as primary, pts is alias used in frontend
    pointsRequired: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    emoji: {
      type: String,
      default: "🎟️",
    },

    cat: {
      type: String,
      enum: ["food", "shopping", "wellness"],
      default: "food",
    },

    validity: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    claimedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
