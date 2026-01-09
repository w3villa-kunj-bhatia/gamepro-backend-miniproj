const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller");

router.post("/", auth, profileController.upsertProfile);
router.get("/me", auth, profileController.getMyProfile);

module.exports = router;
