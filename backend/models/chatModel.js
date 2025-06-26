const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        listingId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Listing', 
            required: true 
        },
        buyerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        sellerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        lastMessage: String,
        lastMessageReadBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }]
    }, 
    { 
        timestamps: true 

    }
);

module.exports = mongoose.model('Chat', chatSchema);
