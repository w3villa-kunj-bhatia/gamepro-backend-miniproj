const profileService = require("../services/profile.service");
const { success } = require("../utils/response");
const plans = require("../config/plans"); 
const AppError = require("../utils/AppError");

exports.upsertProfile = async (req, res, next) => {
  try {
    const userPlan = req.user && req.user.plan ? req.user.plan : "free";
    const gameLimit = plans[userPlan] ? plans[userPlan].games : 3;

    if (req.body.games && req.body.games.length > gameLimit) {
      throw new AppError(
        `Your ${userPlan} plan allows only ${gameLimit} games.`,
        403
      );
    }

    const profile = await profileService.upsertProfile(req.user.id, req.body);

    success(res, profile, "Profile saved");
  } catch (err) {
    next(err);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getOwnProfile(req.user.id);
    success(res, profile);
  } catch (err) {
    next(err);
  }
};
