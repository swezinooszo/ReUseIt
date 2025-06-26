const asyncHandler = require('express-async-handler')
const Category = require('../models/categoryModel')


// @desc    Set Category
// @route   POST /api/categories
// @access Private
const createCategory = asyncHandler( async (req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400);
        throw new Error('Please add category body');
    }

    const category = await Category.create({
        name: req.body.name,
        parentId: req.body.parentId
    })
    res.status(200).json(category);
})

// @desc    Get Categories
// @route   GET /api/categories
// @access Private
const getCategories = asyncHandler(async (req,res) => {
    const items = await Category.find({ parentId: null })
    res.status(200).json(items);
})

// @desc    Get Categories
// @route   GET /api/categories/sub
// @access Private
const getSubCategories = asyncHandler(async (req,res) => {
    const { parentId } = req.params;
    if (!parentId) {
        res.status(400);
        throw new Error('Parent category ID is required');
    }

  const subcategories = await Category.find({ parentId });
  res.status(200).json(subcategories);
})


const getGroupedCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const grouped = [];

    const mainCategories = categories.filter(cat => !cat.parentId);
    const subCategories = categories.filter(cat => cat.parentId);

    mainCategories.forEach(main => {
      const children = subCategories.filter(sub => String(sub.parentId) === String(main._id));
      grouped.push({
        mainCategory: main,
        subCategories: children,
      });
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get Category by ID
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
    const { Id } = req.params;

    const category = await Category.findById(Id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    res.status(200).json(category);
});


module.exports = {
    getCategories,
    createCategory,
    getGroupedCategories,
    getSubCategories,
    getCategoryById
}