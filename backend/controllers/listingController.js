//3.
const asyncHandler = require('express-async-handler')

const Listing = require('../models/listingModel')

// @desc    Get Listings
// @route   GET /api/listing/:id
// @access Private
// const getListings = asyncHandler(async (req,res) => {
//     const listings = await Listing.find()
//     res.status(200).json(listings);
// })
const getListingById = asyncHandler(async (req,res) => {
    try {
        const id = req.params.id

        const listing = await Listing.findById(id)
        if(!listing){
            res.status(400)
            throw new Error('Listing not found')
        }
        res.status(200).json(listing);
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})



// @desc    Get Listings
// @route   GET /api/listing
// @access Private
// const getListings = asyncHandler(async (req,res) => {
//     const listings = await Listing.find()
//     res.status(200).json(listings);
// })
const getListings = asyncHandler(async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const listings = await Listing.find()
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .select('image title price condition'); // Only return needed fields

        res.status(200).json(listings);
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})

// @desc    Get Listings by Query
// @route   GET /api/listing
// @access Private
const getListingsByQuery = asyncHandler(async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const search = req.query.search;
        console.log(` query ${search}`)
        const query = {};

        if (search) {
        query.title = { $regex: search, $options: 'i' }; // case-insensitive search
        }

        const listings = await Listing.find(query)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .select('image title price condition'); // Only return needed fields

        res.status(200).json(listings);
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})


// @desc    Get Suggestion
// @route   GET /api/listing/suggestions
// @access Private
const getSuggestions = asyncHandler(async (req,res) => {
    try {
        const query = req.query.query;
        const results = await Listing.find({
            title: { $regex: query, $options: 'i' }
        })
            //.limit(5)
            .select('title -_id')

        res.status(200).json(results.map(r => r.title));//return as array to render in page
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})


// @desc    Create Listings
// @route   POST /api/listings
// @access Private
const createListing = asyncHandler( async (req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400); 
        throw new Error('Please add a request body');
    }

      const listing = await Listing.create({
        title: req.body.title,
        price: req.body.price,
        condition: req.body.condition,
        sellerId:req.body.sellerId
    })

    res.status(200).json(listing);
})

module.exports = {
    getListings,
    createListing,
    getListingById,
    getListingsByQuery,
    getSuggestions
}