const authService = require("../services/auth.service");
const { success } = require("../utils/response");

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    success(res, { user }, "Signup successful. Please verify your email.", 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Success response includes the user object which contains the role
    success(res, { user }, "Login successful");
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.query.token);
    success(res, null, "Email verified successfully");
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    success(res, { user: req.user }, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  success(res, null, "Logged out successfully");
};
