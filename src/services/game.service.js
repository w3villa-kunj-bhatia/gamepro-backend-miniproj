const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");
const plans = require("../config/plans");

exports.addGame = async (userId, game, plan) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);

  const limit = plans[plan].games;

  if (profile.games.length >= limit) {
    throw new AppError("Game limit reached for your plan", 403);
  }

  profile.games.push(game);
  await profile.save();

  return profile.games;
};

exports.removeGame = async (userId, gameId) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);

  profile.games = profile.games.filter((g) => g._id.toString() !== gameId);

  await profile.save();
  return profile.games;
};
