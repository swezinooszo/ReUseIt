//2.
const express = require('express')
const router = express.Router()
const {getUsers,createUser,getUserProfile,getUserProfileById} = require('../controllers/userController')

router.route('/').get(getUsers).post(createUser)
router.route('/me').get(getUserProfile)
router.route('/me/:userId').get(getUserProfileById)
module.exports = router