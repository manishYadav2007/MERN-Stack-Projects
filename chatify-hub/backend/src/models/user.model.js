import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },

  { timestamps: true },
);

export const userModel = mongoose.model("user", userSchema);
