const Post = require("../models/Posts");
const DisLike = require("../models/DisLikes");

const disLikePost = async (req, res) => {
  try {
    const { post, author } = req.body;
    if (!post || !author) {
      return res
        .status(400)
        .json({ message: "Post Id or author id are required" });
    }
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (existingPost.dislikes.includes(author)) {
      return res
        .status(400)
        .json({ message: "You have already disliked this post" });
    }
    await DisLike.create({ post, author });
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $addToSet: { dislikes: author } },
      { new: true },
    );
    res.status(201).json({
      message: "Post dislike successful",
      totalDislikes: updatedPost.dislikes.length,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already disliked this post" });
    }
    res.status(500).json({ message: error.message });
  }
};

const unDislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { author } = req.body;
    if (!postId || !author) {
      return res
        .status(400)
        .json({ message: "PostId or Author Id are required " });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.dislikes.includes(author)) {
      return res.status(400).json("You have not didlike this post yet");
    }
    await DisLike.findOneAndDelete({ post: postId, author: author });
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: author } },
      { new: true },
    );
    res.status(200).json({
      message: "Post unliked successfully",
      totalLikes: updatedPost.dislikes.length,
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  disLikePost,
  unDislikePost,
};
