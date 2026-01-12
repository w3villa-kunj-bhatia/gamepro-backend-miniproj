const authService = require("../services/auth.service");
const { success } = require("../utils/response");

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    success(res, user, "Signup successful", 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    success(res, result, "Login successful");
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
