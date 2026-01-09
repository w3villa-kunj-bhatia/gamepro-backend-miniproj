const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/savedProfile.controller");

router.post("/:profileId", auth, controller.saveProfile);
router.get("/", auth, controller.getSavedProfiles);
router.delete("/:profileId", auth, controller.removeSavedProfile);

module.exports = router;
