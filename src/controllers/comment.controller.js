const commentService = require("../services/comment.service");
const { success } = require("../utils/response");

exports.addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(
      req.user.id,
      req.params.profileId,
      req.body.text,
    );
    success(res, comment, "Comment added", 201);
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getComments(req.params.profileId);
    success(res, comments);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.commentId);
    success(res, null, "Comment deleted");
  } catch (err) {
    next(err);
  }
};
