const express = require("express");
const router = express.Router();
const igdbController = require("../controllers/igdb.controller"); 

router.get("/search", igdbController.searchGames);
router.get("/characters", igdbController.searchCharacters);

module.exports = router;