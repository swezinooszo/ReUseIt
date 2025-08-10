const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        type: { 
            type: String, 
            required: true 
        }, // e.g., 'review', 'order', 'message'
        message: { 
            type: String, 
            required: true 
        },
        reviewer: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
         listing: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Listing', 
            required: true 
        },
        review: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Review', 
            required: true 
        },
        isRead: { 
            type: Boolean, 
            default: false 
        },
    }, 
    { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
