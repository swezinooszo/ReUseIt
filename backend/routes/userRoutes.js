//2.
const express = require('express')
const router = express.Router()
const {getUsers,createUser,getUserProfile,getUserProfileById,saveExpoPushToken,removeExpoPushToken,toggleFavorite,getFavoriteListings,updateProfileImage} = require('../controllers/userController')

const protect = require('../middleware/authMiddleware');

router.route('/').get(getUsers).post(createUser)
router.route('/me').get(getUserProfile)
router.route('/me/:userId').get(getUserProfileById)
router.route('/savetoken').post(saveExpoPushToken)
router.route('/removetoken').post(removeExpoPushToken)
router.route('/favorite').post(protect,toggleFavorite)
router.get('/:userId/favorites', getFavoriteListings);
router.put('/profile-image', updateProfileImage);
module.exports = router