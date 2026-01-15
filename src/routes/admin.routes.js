const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.use(auth, role("admin"));

router.get("/users", adminController.getUsers);

module.exports = router;
