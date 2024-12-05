import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

// Index for unique email (already done by unique field)
userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);