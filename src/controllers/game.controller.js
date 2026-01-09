const gameService = require("../services/game.service");
const { success } = require("../utils/response");

exports.addGame = async (req, res, next) => {
  try {
    const games = await gameService.addGame(
      req.user.id,
      req.body,
      req.user.plan
    );
    success(res, games, "Game added");
  } catch (err) {
    next(err);
  }
};

exports.removeGame = async (req, res, next) => {
  try {
    const games = await gameService.removeGame(req.user.id, req.params.gameId);
    success(res, games, "Game removed");
  } catch (err) {
    next(err);
  }
};
