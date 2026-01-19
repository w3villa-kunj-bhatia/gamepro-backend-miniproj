const reactionService = require("../services/reaction.service");
const { success } = require("../utils/response");

exports.react = async (req, res, next) => {
  try {
    // 1. React (User writes to DB)
    // Use req.user._id to ensure the logged-in user is reacting
    await reactionService.react(
      req.user._id,
      req.params.profileId,
      req.body.type,
    );

    // 2. Fetch fresh counts (Read from DB)
    // We get the official numbers to send back to the frontend
    const counts = await reactionService.getCounts(req.params.profileId);

    // 3. Send Response
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
