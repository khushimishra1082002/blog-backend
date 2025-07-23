const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//  a user can like a post only once
LikeSchema.index({ post: 1, author: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema)
