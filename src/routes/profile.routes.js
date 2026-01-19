const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller");
const upload = require("../config/cloudinary");

router.post("/", auth, upload.single("avatar"), profileController.upsertProfile);
router.get("/me", auth, profileController.getMyProfile);

module.exports = router;