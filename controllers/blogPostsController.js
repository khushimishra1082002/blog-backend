const Post = require("../models/Posts");
const mongoose = require("mongoose");

const getPost = async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate("author", "name email image")
      .populate("category", "name")
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "name image" },
          { path: "likesComment", select: "name image" },
          { path: "dislikescomment", select: "name image" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post
const singlePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email image")
      .populate("category", "name")
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "name image" },
          { path: "likesComment", select: "name image" },
          { path: "dislikescomment", select: "name image" },
        ],
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create new post
const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const image = req.file ? req.file.path : undefined;

    const newPost = await Post.create({
      title,
      content,
      author: req.user.id,
      isFeatured: req.body.isFeatured,
      category: category,
      tags,
      image,
      published: true,
    });
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = req.body;

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post deleted successfully", post: deletedPost });
  } catch (error) {
    console.error("Error in deletePost:", error);
    res.status(500).json({
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

//popular post
const popularPost = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $sort: { likesCount: -1, commentsCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// featured post
const featuredPost = async (req, res) => {
  try {
    const posts = await Post.find({ isFeatured: true }).limit(5);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Top post
const topPosts = async (req, res) => {
  try {
    const TopPost = await Post.find({ published: true })
      .populate("author", "name email image")
      .sort({ views: -1, likes: -1 })
      .limit(5);

    res.status(200).json(TopPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recommended post
const recommendedPost = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", "name email image")
      .sort({ createdAt: -1 })
      .limit(4);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trending post
const trendingPost = async (req, res) => {
  try {
    const trendingPosts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          trendingScore: {
            $add: [
              { $multiply: ["$views", 1] }, // views * 1
              { $multiply: ["$likesCount", 3] }, // likes count * 3
              { $multiply: ["$commentsCount", 2] }, // comments count * 2
            ],
          },
        },
      },
      { $sort: { trendingScore: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(trendingPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recent post
const recentPost = async (req, res) => {
  try {
    const post = await Post.find({ published: true })
      .populate("author", "name email image")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(6);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Similor post
// const similorPost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate("author", "name email image")
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     const similorPosts = await Post.find({
//       _id: { $ne: post._id },
//       category: post.category,
//     }).limit(4);
//     res.status(200).json(similorPosts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const similorPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const similorPosts = await Post.find({
      _id: { $ne: post._id },
      category: post.category,
    })
      .populate("author", "name image") // ✅ FIX
      .limit(4);

    res.status(200).json(similorPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  singlePost,
  popularPost,
  featuredPost,
  topPosts,
  recommendedPost,
  trendingPost,
  recentPost,
  similorPost,
};
