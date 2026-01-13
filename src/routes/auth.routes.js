const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware")

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.get("/me", auth, authController.getMe);

module.exports = router;
