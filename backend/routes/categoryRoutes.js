//2.
const express = require('express')
const router = express.Router()
const {getCategories,createCategory,getGroupedCategories,getSubCategories,getCategoryById} = require('../controllers/categoryController')

router.route('/grouped').get(getGroupedCategories)
router.route('/sub/:parentId').get(getSubCategories)
router.route('/').get(getCategories).post(createCategory)
router.route('/:Id').get(getCategoryById)
module.exports = router