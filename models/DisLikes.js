const mongoose = require("mongoose");

const DisLikeSchema = new mongoose.Schema(
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
  },
);

//  a user can dislike a post only once
DisLikeSchema.index({ post: 1, author: 1 }, { unique: true });

module.exports = mongoose.model("DisLike", DisLikeSchema);
