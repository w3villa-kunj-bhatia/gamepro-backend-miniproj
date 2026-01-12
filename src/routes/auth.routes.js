const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);

module.exports = router;
