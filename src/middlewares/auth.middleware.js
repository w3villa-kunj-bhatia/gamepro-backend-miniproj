const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  console.log("RAW AUTH HEADER:", req.headers.authorization);

  if (!req.headers.authorization) {
    throw new AppError("JWT must be provided", 401);
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log("TOKEN STRING:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    throw new AppError("Invalid token", 401);
  }
};
