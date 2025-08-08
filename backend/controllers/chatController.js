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

// PUT /api/chats/:chatId/read
const markAsRead = asyncHandler(async (req,res) => {
  try {
    const { userId } = req.body;
    const { chatId } = req.params;
   // console.log( `markAsRead backend userId ${userId} chatId ${chatId}`)

    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    // Only add userId if not already in the list
    if (!chat.lastMessageReadBy.includes(userId)) {
      // chat.lastMessageReadBy.push(userId);
      // await chat.save();
      await Chat.updateOne(
      { _id: chatId },
      { $addToSet: { lastMessageReadBy: userId } }, // avoids duplicates
      { timestamps: false } // ✅ prevent updatedAt from changing
      );
    }

    res.status(200).json({ message: 'Message marked as read', chat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
    getChats,
    markAsRead
}