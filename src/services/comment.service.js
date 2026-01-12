const Comment = require("../models/Comment");
const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");

exports.addComment = async (userId, profileId, text) => {
  if (!text) throw new AppError("Comment text is required", 400);

  const profile = await Profile.findById(profileId);
  if (!profile) throw new AppError("Profile not found", 404);

  // Prevent commenting on own profile
  if (profile.user.toString() === userId) {
    throw new AppError("You cannot comment on your own profile", 400);
  }

  return Comment.create({
    profile: profileId,
    user: userId,
    text,
  });
};

exports.getComments = async (profileId) => {
  return Comment.find({ profile: profileId })
    .populate("user", "email")
    .sort({ createdAt: -1 });
};

exports.deleteComment = async (commentId) => {
  const deleted = await Comment.findByIdAndDelete(commentId);
  if (!deleted) throw new AppError("Comment not found", 404);
  return true;
};
