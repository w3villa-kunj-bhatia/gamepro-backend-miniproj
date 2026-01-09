const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");

exports.createOrUpdateProfile = async (userId, payload) => {
  return Profile.findOneAndUpdate(
    { user: userId },
    payload,
    { new: true, upsert: true }
  );
};

exports.getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  return profile;
};
