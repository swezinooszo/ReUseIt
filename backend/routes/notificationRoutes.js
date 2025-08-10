const express = require('express')
const router = express.Router()
const {createNotification,getUserNotifications,markNotificationAsRead} = require('../controllers/notificationController')

router.route('/').post(createNotification)
router.route('/:userId').get(getUserNotifications)
router.patch('/:id', markNotificationAsRead);
module.exports = router