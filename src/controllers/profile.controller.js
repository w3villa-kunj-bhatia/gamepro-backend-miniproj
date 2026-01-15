const profileService = require("../services/profile.service");
const { success } = require("../utils/response");

exports.upsertProfile = async (req, res, next) => {
  try {
    const userPlan = req.user.plan; // Get plan from auth middleware
    const gameLimit = plans[userPlan].games; // Get limit from config

    if (req.body.games && req.body.games.length > gameLimit) {
      throw new AppError(
        `Your ${userPlan} plan allows only ${gameLimit} games. Please upgrade or remove some.`, 
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
