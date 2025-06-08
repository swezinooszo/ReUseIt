const mongoose = require('mongoose')

const listingSchema = mongoose.Schema(
    {   
        image: {
            type: [String]
        },
        title: {
            type: String,
            required: [true,'Please add  title']
        },
        price: {
            type: Number,
            required: [true,'Please add price']
        },
        condition: {
            type: String,
           // enum: ['new', 'like new', 'used'],
            required: [true,'Please add condition'],
        },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        subCategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
        description: {
            type: String
        },
        location: {
            type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
            },
            coordinates: { type: [Number], required: true }
        },
        sellerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Listing',listingSchema)