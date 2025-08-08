//2.
const express = require('express')
const router = express.Router()
const {getListings,createListing,getListingById,getListingByUserId,getListingsByQuery,getSuggestions,deleteListing,updateListing,promptCheck} = require('../controllers/listingController')

// Specific routes first
router.get('/query', getListingsByQuery)
router.get('/suggestions', getSuggestions)
router.get('/promptcheck/:userId', promptCheck)
router.get('/user/:userId', getListingByUserId)

// Generic routes last
router.route('/').get(getListings).post(createListing)
router.route('/:id').get(getListingById).delete(deleteListing)
router.put('/:id', updateListing)

// router.route('/').get(getListings).post(createListing)
// router.route('/query').get(getListingsByQuery)
// router.route('/suggestions').get(getSuggestions)
// router.route('/:id').get(getListingById).delete(deleteListing)
// router.route('/user/:userId').get(getListingByUserId)
// router.put('/:id', updateListing);
// router.get('/promptcheck/:userId', promptCheck);
module.exports = router