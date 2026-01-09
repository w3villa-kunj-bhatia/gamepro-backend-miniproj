const savedProfileService = require("../services/savedProfile.service");
const { success } = require("../utils/response");

exports.saveProfile = async (req, res, next) => {
  try {
    const saved = await savedProfileService.saveProfile(
      req.user.id,
      req.params.profileId,
      req.user.plan
    );
    success(res, saved, "Profile saved");
  } catch (err) {
    next(err);
  }
};

exports.getSavedProfiles = async (req, res, next) => {
  try {
    const profiles = await savedProfileService.getSavedProfiles(req.user.id);
    success(res, profiles);
  } catch (err) {
    next(err);
  }
};

exports.removeSavedProfile = async (req, res, next) => {
  try {
    await savedProfileService.removeSavedProfile(
      req.user.id,
      req.params.profileId
    );
    success(res, null, "Profile removed");
  } catch (err) {
    next(err);
  }
};
