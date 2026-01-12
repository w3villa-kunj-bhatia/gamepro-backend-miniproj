const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/comment.controller");

router.post("/:profileId", auth, controller.addComment);

router.get("/:profileId", controller.getComments);

router.delete(
  "/admin/:commentId",
  auth,
  role("admin"),
  controller.deleteComment
);

module.exports = router;
