import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["lecturer", "student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
