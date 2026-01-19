const reactionService = require("../services/reaction.service");
const { success } = require("../utils/response");

exports.react = async (req, res, next) => {
  try {
    await reactionService.react(
      req.user._id,
      req.params.profileId,
      req.body.type,
    );
    const counts = await reactionService.getCounts(req.params.profileId);

    success(res, counts, "Reaction updated");
  } catch (err) {
    next(err);
  }
};

exports.getCounts = async (req, res, next) => {
  try {
    const counts = await reactionService.getCounts(req.params.profileId);
    success(res, counts);
  } catch (err) {
    next(err);
  }
};
