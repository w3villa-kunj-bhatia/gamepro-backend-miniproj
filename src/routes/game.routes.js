const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const gameController = require("../controllers/game.controller");

router.post("/", auth, gameController.addGame);
router.delete("/:gameId", auth, gameController.removeGame);

module.exports = router;
