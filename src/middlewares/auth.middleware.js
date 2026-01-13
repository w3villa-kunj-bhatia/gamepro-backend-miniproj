const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Authentication token must be provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};
