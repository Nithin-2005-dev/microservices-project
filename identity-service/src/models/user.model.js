import mongoose from "mongoose";
import argon2 from "argon2";
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async () => {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (err) {
      return next(err);
    }
  }
});
userSchema.methods.comparePassword = async (candidatePassword) => {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (err) {
    throw new Error(err.message);
  }
};
userSchema.index({ userName: "text" });
export const User = mongoose.models.User || mongoose.model("User", userSchema);
