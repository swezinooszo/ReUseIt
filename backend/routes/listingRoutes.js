//2.
const express = require('express')
const router = express.Router()
const {getListings,createListing,getListingById,getListingByUserId,getListingsByQuery,getSuggestions,deleteListing,updateListing} = require('../controllers/listingController')

router.route('/').get(getListings).post(createListing)
router.route('/query').get(getListingsByQuery)
router.route('/suggestions').get(getSuggestions)
router.route('/:id').get(getListingById).delete(deleteListing)
router.route('/user/:userId').get(getListingByUserId)
router.put('/:id', updateListing);
module.exports = router