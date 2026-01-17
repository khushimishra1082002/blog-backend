const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentByPost,
  deleteComment,
  likeComment,
  unlikeComment,
  dislikeComment,
} = require("../controllers/commentController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.post("/addComment", addComment);
router.get("/getCommentByPost/:postId", getCommentByPost);
router.delete(
  "/deleteComment/:commentId",
  authenticate,
  authorize(["user", "admin", "editor"]),
  deleteComment,
);
router.post("/likeComment/:commentId", authenticate, likeComment);
router.post("/dislikeComment/:commentId", authenticate, dislikeComment);

module.exports = router;
