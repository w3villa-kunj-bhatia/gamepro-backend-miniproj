const igdbService = require("../services/igdb.service");
const { success } = require("../utils/response");

exports.searchGames = async (req, res, next) => {
  try {
    const games = await igdbService.searchGames(req.query.q);
    success(res, games);
  } catch (err) {
    next(err);
  }
};

exports.getGame = async (req, res, next) => {
  try {
    const game = await igdbService.getGameById(req.params.igdbId);
    success(res, game);
  } catch (err) {
    next(err);
  }
};

exports.searchCharacters = async (req, res, next) => {
  try {
    const characters = await igdbService.searchCharacters(req.query.q);
    success(res, characters);
  } catch (err) {
    next(err);
  }
};