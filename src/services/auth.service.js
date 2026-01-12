const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

exports.verifyEmail = async (token) => {
  // Use findOneAndUpdate to ensure the database change is atomic and saved
  const user = await User.findOneAndUpdate(
    {
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    },
    {
      $set: { isVerified: true },
      // Use $unset to completely remove the token fields once verified
      $unset: { emailVerificationToken: "", emailVerificationExpires: "" },
    },
    { new: true }
  );

  if (!user) throw new AppError("Invalid or expired token", 400);
  return true;
};

exports.login = async ({ email, password }) => {
  // 1. Normalize the email to prevent casing mismatches between Postman and Browser
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  // 2. Explicitly check for true. If this is false, you get the 403 error.
  if (user.isVerified !== true) {
    throw new AppError("Email not verified", 403);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
};
