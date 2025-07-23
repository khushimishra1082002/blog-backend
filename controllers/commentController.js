const Comment = require("../models/Comments");
const Post = require("../models/Posts");

// add a comment
const addComment = async (req, res) => {
  try {
    const { content, post, user } = req.body;
    console.log(content);
    console.log(post);
    console.log(user);
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await Comment.create({
      content,
      post,
      user,
    });
    existingPost.comments.push(comment._id);
    await existingPost.save();
    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get comment
const getCommentByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comment = await Comment.find({ post: postId }).populate(
      "user",
      "name image"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// like comment
const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const authorId = req.authData.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.likes.includes(authorId)) {
      return res
        .status(400)
        .json({ message: " You have already liked this comment" });
    }
    comment.likes.push(authorId);
    await comment.save();
    res.status(200).json({ message: "Comment liked successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// unlike comment
const unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const authorId = req.authData.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (!comment.likes.includes(authorId)) {
      return res
        .status(400)
        .json({ message: "You have not liked that comment yet " });
    }

    const removeLike = await Comment.findByIdAndUpdate(
      commentId,
      {
        $pull: { likes: authorId },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Comment unliked successfully", comment: removeLike });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentByPost,
  deleteComment,
  likeComment,
  unlikeComment,
};
