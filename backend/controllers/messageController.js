//3.
const asyncHandler = require('express-async-handler')

const Message = require('../models/messageModel')

// @desc    Get Messages
// @route   GET /api/messages
// @access Private
const getMessages = asyncHandler(async (req,res) => {
   // console.log(`getMessages ${req.params.chatId }`)
    const messages = await Message.find({ chatId: req.params.chatId }).sort('createdAt');
    res.status(200).json(messages);
})

module.exports = {
    getMessages
}