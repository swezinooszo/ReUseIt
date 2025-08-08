const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {   
        username: {
            type: String,
            required: [true,'Please add first name']
        },
        email: {
            type: String,
            required: [true,'Please add an email'],
            unique: true
        },
        password: {
            type: String,
            required: [true,'Please add a password']
        },
        otp: String,
        otpExpires: Date,
        isVerified: { type: Boolean, default: false },
        expoPushTokens: [String], // Array of Expo tokens
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
        profileImage: {
        type: String, // store the Firebase URL
        default: null,  // optional
        },
    },
    {
        timestamps: true
    },
    
)

module.exports = mongoose.model('User',userSchema)