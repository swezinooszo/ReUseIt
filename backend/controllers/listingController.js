//3.
const asyncHandler = require('express-async-handler')
const Listing = require('../models/listingModel')



// @desc    Create Listings
// @route   POST /api/listings
// @access Private
const createListing = asyncHandler( async (req,res) => {
    console.log(req.body);
    const {
    title,
    price,
    description,
    condition,
    sellerId,
    address,
    location,
    categoryId,
    subCategoryIds,
    image,
    dynamicFields,
    } = req.body;

      // Optionally validate `location`
    if (
      !location ||
      location.type !== 'Point' ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      //return res.status(400).json({ error: 'Invalid location data' });
        res.status(400); 
       throw new Error('Invalid location data');
    }

    const listing = await Listing.create({
    title,
    price,
    description,
    condition,
    sellerId,
    address,
    location,
    categoryId,
    subCategoryIds,
    image,
    dynamicFields
    });
    res.status(200).json(listing);
})

// @desc    Get Listings
// @route   GET /api/listings
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

        const listings = await Listing.find(
            {
            isVisibleToMarket: true
            }
        )
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        //.select('image title price condition address location'); // Only return needed fields

        res.status(200).json(listings);
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})

// @desc    Get Listings
// @route   GET /api/listings/:id
// @access Private
// const getListings = asyncHandler(async (req,res) => {
//     const listings = await Listing.find()
//     res.status(200).json(listings);
// })
const getListingById = asyncHandler(async (req,res) => {
    try {
        const id = req.params.id

        const listing = await Listing.findById(id).populate('sellerId')
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

// @desc    Get Listings by userId
// @route   GET /api/listings/:userId
// @access Private
const getListingByUserId = asyncHandler(async (req,res) => {
    try {
        const userId = req.params.userId
        console.log(`getListingByUserId userId ${userId}`)
        const listings = await Listing.find({ sellerId: userId }).sort({ createdAt: -1 });
        console.log(`getListingByUserId listings ${listings}`)
        const count = await Listing.countDocuments({ sellerId: userId });

        if(!listings){
            res.status(400)
            throw new Error('Listing not found')
        }
        res.status(200).json({count,listings});
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})


// @desc    Get Listings by Query
// @route   GET /api/listings
// @access Private
const getListingsByQuery = asyncHandler(async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const search = req.query.search;

        const minLat = parseFloat(req.query.minLat);
        const maxLat = parseFloat(req.query.maxLat);
        const minLng = parseFloat(req.query.minLng);
        const maxLng = parseFloat(req.query.maxLng);

        const categoryId = req.query.categoryId;
        const type = req.query.type;
        console.log(`getListingsByQuery search: ${search}, Region: [${minLat}, ${maxLat}], [${minLng}, ${maxLng}]`);

        const query = {
            isVisibleToMarket: true
        };

        if (search) {
        query.title = { $regex: search, $options: 'i' }; // case-insensitive search
        }

        // Geo bounding box search
        if (!isNaN(minLat) && !isNaN(maxLat) && !isNaN(minLng) && !isNaN(maxLng)) {
        query.location = {
            $geoWithin: {
            $box: [
                [minLng, minLat], // bottom-left corner (lng, lat)
                [maxLng, maxLat], // top-right corner (lng, lat)
            ],
            },
        };
        }
     
         // 🧩 Category Filtering
        if (categoryId) {
        if (type === 'main') {
            query.categoryId = categoryId;
        } else {
            query.subCategoryIds = categoryId;
        }
        }

        // 🔢 Total matching count
        const total = await Listing.countDocuments(query);

        const listings = await Listing.find(query)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .select('image title price condition address location'); // Only return needed fields

        res.status(200).json({total,listings});
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
})

// const getListingsByQuery = asyncHandler(async (req,res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 5;
//         const skip = (page - 1) * limit;
//         const search = req.query.search;
//         console.log(` query ${search}`)
//         const query = {};

//         if (search) {
//         query.title = { $regex: search, $options: 'i' }; // case-insensitive search
//         }

//         const listings = await Listing.find(query)
//         .sort({ createdAt: -1 }) // newest first
//         .skip(skip)
//         .limit(limit)
//         .select('image title price condition address location'); // Only return needed fields

//         res.status(200).json(listings);
//     } catch (err) {
//         console.error('Error fetching listings:', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// })


// @desc    Get Suggestion
// @route   GET /api/listings/suggestions
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

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const listing = await Listing.findById(id);

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    await listing.deleteOne(); // or await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: 'Listing deleted successfully' });
});

// @desc    Update a Listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
  const listingId = req.params.id;

  // Find listing by ID
  const listing = await Listing.findById(listingId);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  // Extract fields from request body
  const {
    title,
    price,
    description,
    condition,
    sellerId,
    address,
    location,
    categoryId,
    subCategoryIds,
    image,
    dynamicFields,
  } = req.body;

  // Optional: Validate location if provided
  if (location) {
    if (
      location.type !== 'Point' ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      res.status(400);
      throw new Error('Invalid location data');
    }
  }

  // Update fields if provided
  listing.title = title ?? listing.title;
  listing.price = price ?? listing.price;
  listing.description = description ?? listing.description;
  listing.condition = condition ?? listing.condition;
  listing.sellerId = sellerId ?? listing.sellerId;
  listing.address = address ?? listing.address;
  listing.location = location ?? listing.location;
  listing.categoryId = categoryId ?? listing.categoryId;
  listing.subCategoryIds = subCategoryIds ?? listing.subCategoryIds;
  listing.image = image ?? listing.image;
  listing.dynamicFields = dynamicFields ?? listing.dynamicFields;

  // Save updated listing
  const updatedListing = await listing.save();

  res.status(200).json(updatedListing);
});


module.exports = {
    getListings,
    createListing,
    getListingById,
    getListingsByQuery,
    getSuggestions,
    getListingByUserId,
    deleteListing,
    updateListing
}