const express = require("express")
const router = express.Router()
const { likePost , unlikePost , getLikesByPost } = require("../controllers/likesController")
const { authenticate} = require("../middlewares/authMiddleware")

router.post("/likePost",likePost)
router.delete("/unlikePost/:postId",unlikePost)
router.get("/getLikesByPost/:postId",getLikesByPost)

module.exports = router