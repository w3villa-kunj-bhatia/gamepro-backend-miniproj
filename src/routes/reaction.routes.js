const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/reaction.controller");

router.post("/:profileId", auth, controller.react);
router.get("/:profileId/counts", controller.getCounts);

module.exports = router;
