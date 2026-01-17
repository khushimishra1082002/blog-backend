const express = require("express");
const router = express.Router();
const {
  allCategory,
  singleCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/allCategory", allCategory);
router.get("/singleCategory/:categoryId", singleCategory);
router.post("/addCategory", addCategory);
router.put("/editCategory/:categoryId", authenticate, editCategory);
router.delete("/deleteCategory/:categoryId", authenticate, deleteCategory);

module.exports = router;
