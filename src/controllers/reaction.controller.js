const reactionService = require("../services/reaction.service");
const { success } = require("../utils/response");

exports.react = async (req, res, next) => {
  try {
    const result = await reactionService.react(
      "66a91f0e9b3c9f1b2d8e9999",
      req.params.profileId,
      req.body.type
    );
    success(res, result, "Reaction updated");
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
