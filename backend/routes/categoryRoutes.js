//2.
const express = require('express')
const router = express.Router()
const {getCategories,createCategory,getGroupedCategories,getSubCategories} = require('../controllers/categoryController')

router.route('/').get(getCategories).post(createCategory)
router.route('/grouped').get(getGroupedCategories)
router.route('/sub/:parentId').get(getSubCategories)
module.exports = router