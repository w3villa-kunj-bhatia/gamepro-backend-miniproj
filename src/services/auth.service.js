const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

exports.register = async ({ email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    email,
    password: hashedPassword,
  });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Invalid credentials", 401);

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
