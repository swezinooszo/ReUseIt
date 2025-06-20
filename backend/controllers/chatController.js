//3.
const asyncHandler = require('express-async-handler')

const Chat = require('../models/chatModel')

// @desc    Get Chat
// @route   GET /api/chats
// @access Private
const getChats = asyncHandler(async (req,res) => {
    console.log(`getChats ${req.params.userId }`)
    const userId = req.params.userId;

    // const chats = await Chat.find({
    //   $or: [
    //     { buyerId: userId },
    //     { sellerId: userId }
    //   ]
    // })
    const chats = await Chat.find({
    $and: [
      {
        $or: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      { lastMessage: { $exists: true, $ne: null } } // only include if lastMessage exists and is not null
    ]
  })
    .populate('buyerId')
    .populate('sellerId')
    .populate('listingId')
    .sort({ updatedAt: -1 });

    res.status(200).json(chats);
})

module.exports = {
    getChats
}