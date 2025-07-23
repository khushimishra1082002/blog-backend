const express = require("express")
const router = express.Router()
const {registerUser,loginUser} = require("../controllers/authControllers")
const {upload} = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single('image'), registerUser);

router.post("/login",loginUser)

module.exports = router;

