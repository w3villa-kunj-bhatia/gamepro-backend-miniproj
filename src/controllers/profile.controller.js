const profileService = require("../services/profile.service");
const { success } = require("../utils/response");

exports.upsertProfile = async (req, res, next) => {
  try {
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
