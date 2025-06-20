//2.
const express = require('express')
const router = express.Router()
const {createOffer,acceptOffer,checkExistingOffer,toggleReserve,toggleSold} = require('../controllers/offerController')

router.route('/').post(createOffer)
//router.route('/:id').get(getOfferById)
router.route('/accept/:offerId').post(acceptOffer)
router.route('/check').get(checkExistingOffer)
router.route('/reserve/:listingId').put(toggleReserve)
router.route('/sold/:listingId').put(toggleSold)
module.exports = router