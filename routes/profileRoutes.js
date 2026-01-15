const express = require("express");
const router = express.Router();
const {
  getMyProfile,
} = require("../controllers/profileController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/me", authenticate, getMyProfile);
// router.put(
//   "/updateProfile",
//   authenticate,
//   upload.single("image"),
//   updateMyProfile
// );

module.exports = router;
