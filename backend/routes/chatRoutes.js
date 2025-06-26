const express = require('express')
const router = express.Router()
const {getChats,markAsRead} = require('../controllers/chatController')

router.route('/:userId').get(getChats)
router.route('/read/:chatId').put(markAsRead)
module.exports = router