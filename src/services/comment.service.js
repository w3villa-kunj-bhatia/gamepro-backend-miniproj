const Comment = require("../models/Comment");
const Profile = require("../models/Profile");
const AppError = require("../utils/AppError");

exports.addComment = async (userId, targetProfileId, text) => {
  if (!text) throw new AppError("Comment text is required", 400);

  const targetProfile = await Profile.findById(targetProfileId);
  if (!targetProfile) throw new AppError("Target profile not found", 404);

  const authorProfile = await Profile.findOne({ user: userId });
  if (!authorProfile) {
    throw new AppError("You must create a profile before commenting.", 400);
  }

  const comment = await Comment.create({
    profile: targetProfileId,
    user: userId,
    authorProfile: authorProfile._id,
    text,
  });

  return await comment.populate("authorProfile", "username avatar");
};

exports.getComments = async (profileId) => {
  return Comment.find({ profile: profileId })
    .populate("authorProfile", "username avatar")
    .sort({ createdAt: -1 });
};

exports.deleteComment = async (commentId) => {
  const deleted = await Comment.findByIdAndDelete(commentId);
  if (!deleted) throw new AppError("Comment not found", 404);
  return true;
};
