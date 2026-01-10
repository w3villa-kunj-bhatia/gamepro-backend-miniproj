const Reaction = require("../models/Reaction");
const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");

exports.react = async (userId, profileId, type) => {
  const profile = await Profile.findById(profileId);
  if (!profile) throw new AppError("Profile not found", 404);

  if (profile.user.toString() === userId) {
    throw new AppError("You cannot react to your own profile", 400);
  }

  const existing = await Reaction.findOne({ user: userId, profile: profileId });

  if (!existing) {
    return Reaction.create({ user: userId, profile: profileId, type });
  }

  if (existing.type === type) {
    await existing.deleteOne();
    return null;
  }

  existing.type = type;
  await existing.save();
  return existing;
};

exports.getCounts = async (profileId) => {
  const reactions = await Reaction.aggregate([
    { $match: { profile: new require("mongoose").Types.ObjectId(profileId) } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    likes: reactions.find((r) => r._id === "like")?.count || 0,
    dislikes: reactions.find((r) => r._id === "dislike")?.count || 0,
  };
};
