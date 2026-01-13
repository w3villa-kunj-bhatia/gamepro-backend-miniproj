const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Protect all routes with auth and admin role
router.use(auth, role("admin"));

router.get("/users", adminController.getUsers);

module.exports = router;
