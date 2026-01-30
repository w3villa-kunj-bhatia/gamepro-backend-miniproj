const authService = require("../services/auth.service");
const { success } = require("../utils/response");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const User = require("../models/User");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");
const bcrypt = require("bcrypt");

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationTokenExpire,
      isVerified: false,
    });

    const baseURL = process.env.BASE_URL || "http://localhost:5000";
    const verifyUrl = `${baseURL}/api/auth/verify?token=${verificationToken}`;

    const message = `
      <h1>Email Verification</h1>
      <p>Please verify your account by clicking the link below:</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    sendEmail({
      to: user.email,
      subject: "GamePro - Account Verification",
      html: message,
    }).catch((err) => {
      console.error("Background Email Error:", err.message);
    });

    success(
      res,
      { user },
      "Signup successful. Please check your email for verification.",
      201,
    );
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.cookie("token", token, getCookieOptions());
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
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findOne({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user._doc,
          username: profile ? profile.username : null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  success(res, null, "Logged out successfully");
};

exports.socialLoginCallback = async (req, res, next) => {
  try {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, role: user.role, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, getCookieOptions());

    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientURL}/dashboard?login=success`);
  } catch (err) {
    const msg = err.message || "Login callback failed";
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientURL}/login?error=${encodeURIComponent(msg)}`);
  }
};
