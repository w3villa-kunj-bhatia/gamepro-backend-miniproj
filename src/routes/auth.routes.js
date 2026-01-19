const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

const handleSocialCallback = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) {
      const errorMessage = err.message || "Authentication failed";
      return res.redirect(
        `http://localhost:5173/login?error=${encodeURIComponent(errorMessage)}`,
      );
    }

    if (!user) {
      const errorMessage = info?.message || "Authentication failed";
      return res.redirect(
        `http://localhost:5173/login?error=${encodeURIComponent(errorMessage)}`,
      );
    }

    req.user = user;
    next();
  })(req, res, next);
};

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.get("/me", auth, authController.getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  handleSocialCallback("google"), 
  authController.socialLoginCallback,
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false }),
);

router.get(
  "/facebook/callback",
  handleSocialCallback("facebook"),
  authController.socialLoginCallback,
);

router.post("/logout", authController.logout);

module.exports = router;
