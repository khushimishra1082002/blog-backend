const express = require("express")
const router = express.Router()
const { disLikePost, unDislikePost, getDisLikesPost } = require("../controllers/dislikeController")



router.post("/disLikePost", disLikePost)
router.delete("/unDislikePost/:postId", unDislikePost)
router.get("/getDisLikesPost/:postId", getDisLikesPost)

module.exports = router
