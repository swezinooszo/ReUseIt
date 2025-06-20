//2.
const express = require('express')
const router = express.Router()
const {getUsers,createUser,getUserProfile} = require('../controllers/userController')

router.route('/').get(getUsers).post(createUser)
router.route('/me').get(getUserProfile)
module.exports = router