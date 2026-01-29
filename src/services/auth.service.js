const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../utils/email");

exports.register = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new AppError("Email already in use", 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    isVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: tokenExpires,
  });

  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5000/api/auth"
  }/verify-email?token=${verificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your GamePro account",
      html: `Please click here to verify: ${verificationUrl}`,
    });
  } catch (err) {
    console.error("Email log failed:", err);
  }

  return user;
};

exports.verifyEmail = async (token) => {
  if (!token) throw new AppError("No token provided", 400);

  const user = await User.findOneAndUpdate(
    {
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    },
    {
      $set: { isVerified: true },
      $unset: { emailVerificationToken: "", emailVerificationExpires: "" },
    },
    { new: true },
  );

  if (!user) throw new AppError("Invalid or expired token", 400);
  return true;
};

exports.login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("User does not exist. Please sign up.", 404);
  }

  if (user.isBlocked) {
    throw new AppError(
      "Your account has been blocked. Please contact support.",
      403,
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Incorrect password. Please try again.", 401);
  }

  if (user.isVerified !== true) {
    throw new AppError("Email not verified", 403);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return { token, user };
};
