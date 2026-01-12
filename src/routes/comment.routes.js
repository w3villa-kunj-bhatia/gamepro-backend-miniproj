const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/comment.controller");

// Add comment
router.post("/:profileId", auth, controller.addComment);

// Get comments for a profile (public)
router.get("/:profileId", controller.getComments);

// Admin delete comment
router.delete(
  "/admin/:commentId",
  auth,
  role("admin"),
  controller.deleteComment
);

module.exports = router;
