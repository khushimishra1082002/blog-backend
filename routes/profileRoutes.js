const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");
const { authenticate } = require("../middlewares/authMiddleware");

const upload = require("../middleware/upload");

router.get("/me", authenticate, getMyProfile);
router.put(
  "/updateProfile",
  authenticate,
  upload.single("image"),
  updateMyProfile
);

module.exports = router;
