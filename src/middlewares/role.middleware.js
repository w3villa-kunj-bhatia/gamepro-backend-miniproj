const AppError = require("../utils/AppError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }
    next();
  };
};
