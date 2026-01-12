const authService = require("../services/auth.service");
const { success } = require("../utils/response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    success(res, user, "Signup successful", 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔴 THIS IS THE CRITICAL LINE YOU WERE MISSING
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",   // REQUIRED for localhost
      secure: false,     // MUST be false on localhost
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
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
