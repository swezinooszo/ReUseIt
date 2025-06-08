const express = require('express')
const router = express.Router()
const {getChats} = require('../controllers/chatController')

router.route('/:userId').get(getChats)

module.exports = router