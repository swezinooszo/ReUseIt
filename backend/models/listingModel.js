const mongoose = require('mongoose')

const listingSchema = mongoose.Schema(
    {   
        isVisibleToMarket: {
            type: Boolean,
            default: true,
        },
        isReserved: {
            type: Boolean,
            default: false,
            },
        isSold: {
            type: Boolean,
            default: false,
        },
        acceptedOfferIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
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
        address: {
            type: String
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: { 
                type: [Number], 
                required: true 
            }
        },
        sellerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        dynamicFields: {
            type: Map,
            of: String,
            default: {},
        }
    },
    {
        timestamps: true
    }
)

listingSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Listing',listingSchema)