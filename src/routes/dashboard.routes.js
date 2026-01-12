const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/dashboard.controller");

router.get("/profiles", auth, controller.getProfiles);

module.exports = router;
