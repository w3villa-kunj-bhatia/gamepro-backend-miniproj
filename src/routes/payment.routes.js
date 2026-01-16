const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/payment.controller");

router.post("/create-session", auth, controller.createCheckoutSession);
router.post("/verify", auth, controller.verifyPayment);

module.exports = router;
