const Like = require("../models/Likes");
const Post = require("../models/Posts");

const likePost = async (req, res) => {
  try {
    const { post, author } = req.body;
    console.log("1", post);
    console.log("2", author);
    if (!post || !author) {
      return res
        .status(400)
        .json({ message: "Post ID and Author ID are required." });
    }
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user has already liked the post
    if (existingPost.likes.includes(author)) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }
    const like = await Like.create({ post, author });
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $addToSet: { likes: author } },
      { new: true }
    );
    res.status(201).json({
      message: "Post liked successfully",
      totalLikes: updatedPost.likes.length,
      updatedPost,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }
    res.status(500).json({ message: error.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { author } = req.body;
    if (!postId || !author) {
      return res
        .status(400)
        .json({ message: "Post ID and Author ID are required." });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(author)) {
      return res
        .status(400)
        .json({ message: "You haven't liked this post yet" });
    }
    await Like.findOneAndDelete({ post: postId, author: author });
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: author } },
      { new: true }
    );
    res.status(200).json({
      message: "Post unliked successfully",
      totalLikes: updatedPost.likes.length,
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post: postId });
    if (!likes) {
      return res.status(404).json({ message: "No likes found" });
    }
    res.status(200).json({ likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikesByPost,
};
