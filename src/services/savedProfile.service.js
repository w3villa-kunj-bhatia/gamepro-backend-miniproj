const SavedProfile = require("../models/SavedProfile");
const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");
const plans = require("../config/plans");

exports.saveProfile = async (userId, profileId, plan) => {
  const profile = await Profile.findById(profileId);
  if (!profile) throw new AppError("Profile not found", 404);

  if (profile.user.toString() === userId) {
    throw new AppError("You cannot save your own profile", 400);
  }

  const existing = await SavedProfile.findOne({
    user: userId,
    profile: profileId,
  });
  if (existing) {
    throw new AppError("Profile already saved", 400);
  }

  const userPlanName = plan && plans[plan] ? plan : "free";
  const userPlanLimit = plans[userPlanName].savedProfiles;

  const count = await SavedProfile.countDocuments({ user: userId });

  if (count >= userPlanLimit) {
    throw new AppError(
      `Saved profile limit reached for ${userPlanName} plan`,
      403
    );
  }

  const saved = await SavedProfile.create({
    user: userId,
    profile: profileId,
  });

  return saved;
};

exports.getSavedProfiles = async (userId) => {
  return SavedProfile.find({ user: userId })
    .populate("profile")
    .sort({ createdAt: -1 });
};

exports.removeSavedProfile = async (userId, profileId) => {
  const deleted = await SavedProfile.findOneAndDelete({
    user: userId,
    profile: profileId,
  });

  if (!deleted) throw new AppError("Saved profile not found", 404);
  return true;
};
