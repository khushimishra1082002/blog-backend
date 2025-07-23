const express = require("express")
const router = express.Router()
const {searchPost,searchUser,searchCategory}= require("../controllers/searchController")

router.get("/searchPost",searchPost);
router.get("/searchUser",searchUser)
router.get("/searchCategory",searchCategory)


module.exports = router;

