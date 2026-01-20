const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Authentication token must be provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id: decoded.id,
      id: decoded.id,
      role: decoded.role || "user",
      plan: decoded.plan || "free",
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new AppError("Invalid or expired token", 401));
    }
    next(err);
  }
};
