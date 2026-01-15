const authService = require("../services/auth.service");
const { success } = require("../utils/response");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

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

    success(res, { user }, "Login successful");
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.redirect("/verified.html");
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user; 
    
    const profile = await Profile.findOne({ user: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user._doc,
          username: profile ? profile.username : null 
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  success(res, null, "Logged out successfully");
};

exports.socialLoginCallback = async (req, res, next) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, role: user.role, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/dashboard?login=success");
  } catch (err) {
    next(err);
  }
};
