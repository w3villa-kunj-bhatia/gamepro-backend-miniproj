const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");

exports.upsertProfile = async (userId, payload) => {
  return Profile.findOneAndUpdate(
    { user: userId },
    { ...payload, user: userId },
    { new: true, upsert: true, runValidators: true }
  );
};

exports.getOwnProfile = async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  return profile;
};
