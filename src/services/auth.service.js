const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { generateToken } = require("../utils/token");
const { sendEmail } = require("../utils/email");

exports.register = async ({ email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateToken();

  const user = await User.create({
    email,
    password: hashedPassword,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: Date.now() + 1000 * 60 * 60,
  });

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `Verify token: ${verificationToken}`,
  });

  return user;
};

exports.verifyEmail = async (token) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError("Invalid or expired token", 400);

  user.isVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;

  await user.save();
  return true;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  if (!user.isVerified) {
    throw new AppError("Email not verified", 403);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
};
