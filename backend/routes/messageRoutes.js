const express = require('express')
const router = express.Router()
const {getMessages} = require('../controllers/messageController')

router.route('/:chatId').get(getMessages)

module.exports = router