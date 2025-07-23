const express = require("express");
const router = express.Router();
const { createPost,getPost,updatePost,deletePost,singlePost,popularPost,featuredPost
    ,topPosts,recommendedPost,trendingPost,recentPost,similorPost
 } = require("../controllers/blogPostsController");
const {authorize , authenticate} = require("../middlewares/authMiddleware")
const {upload} = require("../middlewares/uploadMiddleware");

router.get("/getPost",getPost)
router.get("/singlePost/:id",singlePost);
router.post("/createPost",upload.single("image"),authenticate,authorize([ "user","editor", "admin"]),createPost);
router.put("/updatePost/:id", authenticate, upload.single("image"), updatePost);
router.delete("/deletePost/:id",authenticate,deletePost);
router.get("/popular-posts",popularPost)
router.get("/fetaturedPosts",featuredPost)
router.get("/topPosts", topPosts)
router.get("/recommendedPost",recommendedPost)
router.get("/trendingPost",trendingPost)
router.get("/recentPost",recentPost)
router.get("/similorPost/:id", similorPost)
module.exports = router;
