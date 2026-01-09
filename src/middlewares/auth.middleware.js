const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError("Unauthorized", 401);

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
};
