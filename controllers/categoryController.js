const Category = require("../models/Category");
const mongoose = require("mongoose");

// all category
const allCategory = async (req, res) => {
  try {
    const categoryies = await Category.find();
    if (!categoryies) {
      res.status(404).json({ message: "Categoryies not found" });
    }
    res.status(200).json(categoryies);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// single category
const singleCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// add new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({name});
    res.status(201).json({ message: "Category created successfully", newCategory });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// edit category
const editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({
        message: "Category edit successfully",
        category: updatedCategory,
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("categoryId", categoryId);
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
    message: "Category deleted successfully",
    post: deletedCategory,
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res
      .status(500)
      .json({
        message: "An internal server error occurred",
        error: error.message,
      });
  }
};

module.exports = {
  allCategory,
  singleCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
