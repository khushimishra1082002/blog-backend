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

    let comments = await Comment.find({ post: postId })
      .populate("user", "name image")
      .populate("likesComment", "name image")
      .populate("dislikescomment", "name image");
    comments = comments.map((c) => {
      const obj = c.toObject();
      obj.likesComment = obj.likesComment || [];
      obj.dislikescomment = obj.dislikescomment || [];
      return obj;
    });

    if (!comments.length) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json(comments);
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

//like comment
const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.user.toString() === userId) {
    return res
      .status(403)
      .json({ message: "You cannot like your own comment" });
  }

  const hasLiked = comment.likesComment.includes(userId);
  const hasDisliked = comment.dislikescomment.includes(userId);

  if (hasLiked) {
    comment.likesComment.pull(userId);
  } else {
    comment.likesComment.push(userId);
    if (hasDisliked) {
      comment.dislikescomment.pull(userId);
    }
  }

  await comment.save();
  const populatedComment = await Comment.findById(comment._id)
    .populate("user", "name image")
    .populate("likesComment", "name image")
    .populate("dislikescomment", "name image");

  res.status(200).json({
    message: "Reaction updated",
    comment: populatedComment,
  });
};

//dislike comment
const dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.user.toString() === userId) {
    return res
      .status(403)
      .json({ message: "You cannot dislike your own comment" });
  }

  const hasDisliked = comment.dislikescomment.includes(userId);
  const hasLiked = comment.likesComment.includes(userId);

  if (hasDisliked) {
    comment.dislikescomment.pull(userId);
  } else {
    comment.dislikescomment.push(userId);
    if (hasLiked) {
      comment.likesComment.pull(userId);
    }
  }

  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate("user", "name image")
    .populate("likesComment", "name image")
    .populate("dislikescomment", "name image");

  res.status(200).json({
    message: "Reaction updated",
    comment: populatedComment,
  });
};

module.exports = {
  addComment,
  getCommentByPost,
  deleteComment,
  likeComment,
  dislikeComment,
};
