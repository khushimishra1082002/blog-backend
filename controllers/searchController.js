const Post = require("../models/Posts");
const User = require("../models/User");
const category = require("../models/Category");

const searchPost = async (req, res) => {
  const query = req.query.q;
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).populate("author", "name image");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching posts" });
  }
};

const searchUser = async (req, res) => {
  const query = req.query.q;
  console.log("Query:", query);
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { role: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
};

const searchCategory = async (req, res) => {
  const query = req.query.q;
  console.log("Query:", query);
  try {
    const filtercategory = await category.find({
      $or: [{ name: { $regex: query, $options: "i" } }],
    });
    res.status(200).json(filtercategory);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchPost,
  searchUser,
  searchCategory,
};
