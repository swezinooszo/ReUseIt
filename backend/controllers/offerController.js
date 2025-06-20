const asyncHandler = require('express-async-handler')
const Offer = require('../models/offerModel')
const Listing = require('../models/listingModel')

const createOffer = asyncHandler( async (req,res) =>{
try {
    const { listingId, buyerId, offerPrice } = req.body;
    const offer = await Offer.create({ listingId, buyerId, offerPrice});
    console.log(`createOffer ${offer}`)
    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

})

// Accept an offer
const acceptOffer = asyncHandler( async (req, res) => {
  try {
        console.log(`acceptOffer offerId ${req.params.offerId}`)
    const offer = await Offer.findById(req.params.offerId);

    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    console.log(`offer found ${offer}`)
    offer.status = 'accepted';
    await offer.save();
    console.log(`offer status update to accept`)
    await Listing.findByIdAndUpdate(offer.listingId, {
      $addToSet: { acceptedOfferIds: offer._id }
    });
  console.log(`update offerid to listing`)

    res.status(200).json({ message: 'Offer accepted' });
  } catch (err) {
        console.log(`acceptOffer got error when update to listing ${err.message}`)
    res.status(500).json({ error: err.message });
  }
})


// Check if an offer exists for a buyer and listing
const checkExistingOffer = asyncHandler (async (req, res) => {
  try {
    const { buyerId, listingId } = req.query;
     console.log(`call backend checkExistingOffer buyerId${buyerId} listingId${listingId}`)
    if (!buyerId || !listingId) {
      console.log('throw missing listing Id')
      res.status(400)
      throw new Error('Missing buyerId or listingId')
    }

    const existingOffer = await Offer.findOne({ buyerId, listingId }).populate('listingId');
    console.log(`call backend existingOffer result ${existingOffer}`)
    if (existingOffer) {
       res.status(200).json({ exists: true, offer: existingOffer });
    } else {
       res.status(200).json({ exists: false });
    }
  } catch (err) {
       console.log(`call backend existingOffer err ${err}`)
    res.status(500).json({ error: err.message });
  }
});

const toggleReserve = asyncHandler (async (req, res) => {
  try {
      console.log(`toggleReserve backend api`)
    const { isReserved } = req.body;
    const listingId = req.params.listingId;

    console.log(`toggleReserve => isReserved ${isReserved} listingId ${listingId}`)
    const listing = await Listing.findByIdAndUpdate(
      listingId,
      {
        isReserved,
        isVisibleToMarket: !isReserved, // true if unreserving, false if reserving
      },
      { new: true }
    );

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
    } 

    res.status(200).json({
      message: isReserved
        ? 'Listing reserved and removed from market.'
        : 'Listing unreserved and visible to market.',
      listing,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const toggleSold = asyncHandler (async (req, res) => {
  try {
      console.log(`toggleSold backend api`)
      const listingId = req.params.listingId;

      const listing = await Listing.findById(listingId);

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      if (listing.isSold) {
        return res.status(400).json({ error: 'Listing is already marked as sold.' });
      }

      listing.isSold = true;
      listing.isVisibleToMarket = false; // ⛔️ remove from market
      await listing.save();

    res.status(200).json({ message: 'Listing marked as sold and removed from market.', listing });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// const getOfferById = asyncHandler(async (req,res) => {
//     try {
//         const id = req.params.id
//         const offer = await Offer.findById(id)
//         if(!offer){
//             res.status(400)
//             throw new Error('Listing not found')
//         }
//         res.status(200).json(offer);
//     } catch (err) {
//         console.error('Error getOfferById:', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// })

module.exports = {
    createOffer,
    acceptOffer,
    checkExistingOffer,
    toggleReserve,
    toggleSold
}