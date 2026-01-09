const plans = require("../config/plans");
const AppError = require("../utils/AppError");

module.exports = (feature) => {
  return (req, res, next) => {
    const limit = plans[req.user.plan][feature];
    if (!limit) throw new AppError("Feature not allowed", 403);
    next();
  };
};
