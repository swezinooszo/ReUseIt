//2.
const express = require('express')
const router = express.Router()
const {getListings,createListing,getListingById,getListingByUserId,getListingsByQuery,getSuggestions} = require('../controllers/listingController')

router.route('/').get(getListings).post(createListing)
router.route('/query').get(getListingsByQuery)
router.route('/suggestions').get(getSuggestions)
router.route('/:id').get(getListingById)
router.route('/user/:userId').get(getListingByUserId)
module.exports = router