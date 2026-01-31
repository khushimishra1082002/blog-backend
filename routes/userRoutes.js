const express = require("express");
const router = express.Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userControllers");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/getUsers", getUsers);
router.get("/getSingleUser/:id", getSingleUser);
router.post("/createUser",authenticate, upload.single("image"), createUser);
router.put("/updateUser/:id",authenticate,upload.single("image"), updateUser);
router.delete("/deleteUser/:id",authenticate,authorize(["admin"]),deleteUser);
router.put("/changePassword/:id",authenticate,authorize(["admin", "user"]),changePassword);

module.exports = router;
