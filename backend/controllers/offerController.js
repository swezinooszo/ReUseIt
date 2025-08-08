const asyncHandler = require('express-async-handler')
const Offer = require('../models/offerModel')
const Listing = require('../models/listingModel')
const {notifyListingStatus} = require('../controllers/sendPushNotification')

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

     // 1️⃣ First, check for an accepted offer for this listing
    let existingOffer = await Offer.findOne({
      listingId,
      status: 'accepted'
    }).populate('listingId');

    if (!existingOffer) {
      // 2️⃣ If no accepted offer, check for an offer by this buyer
      existingOffer = await Offer.findOne({
        listingId,
        buyerId
      }).populate('listingId');
    }

   // const existingOffer = await Offer.findOne({ buyerId, listingId }).populate('listingId');
   // console.log(`call backend existingOffer result ${existingOffer}`)
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
  //try {
      console.log(`toggleReserve backend api`)
    // const { isReserved } = req.body;
   // const listingId = req.params.listingId;
    const { isReserved, listingId , buyerId,isNotificationDisabled,reservationPeriod } = req.body;

    console.log(`toggleReserve => isReserved ${isReserved} listingId ${listingId}  isNotificationDisabled ${isNotificationDisabled}  reservationPeriod ${reservationPeriod}`)
     // Build update object dynamically
    const updateFields = {
      isReserved
    };

    if (typeof isNotificationDisabled !== 'undefined') {
      updateFields.isNotificationDisabled = isNotificationDisabled;
    }

    if (typeof reservationPeriod !== 'undefined') {
      updateFields.reservationUntil = reservationPeriod;
    }

    if (isReserved === false) {
      updateFields.acceptedOfferIds = [];
      updateFields.reservationUntil = null;
      updateFields.isNotificationDisabled = false;
      updateFields.isAwaitingUserConfirmation = false;
      updateFields.shouldPromptUser = false;
    }

    const listing = await Listing.findByIdAndUpdate(
      listingId,
      updateFields,
      { new: true }
    );

    // const listing = await Listing.findByIdAndUpdate(
    //   listingId,
    //   {
    //     isReserved,
    //     isNotificationDisabled,
    //     reservationUntil: reservationPeriod,
    //     ...(isReserved === false && { 
    //       acceptedOfferIds: [],
    //       reservationUntil: null,
    //       isNotificationDisabled: false,
    //       isAwaitingUserConfirmation: false,
    //       shouldPromptUser: false,
    //       }), // if listing is unreserved, 1.change reserve status, 2.clear acceptedOfferIds from listing when unreserving
    //   },
    //   { new: true }
    // );

    if (!listing) {
      //res.status(404).json({ error: 'Listing not found' });
       res.status(404);
      throw new Error('Listing not found');
    } 

     // 3. If unreserving, delete related 'accepted offer' from offers
    if (isReserved === false) {
      // const deleteResult = await Offer.deleteMany({ listingId });
      const deleteResult = await Offer.deleteMany({ listingId, buyerId });
      console.log(`Deleted ${deleteResult.deletedCount} offers for listing ${listingId}`);
    }

    // ✅ Notify all buyers about status change
    await notifyListingStatus(listingId,listing.title ,isReserved ? 'This listing has been reserved.' : 'This listing is now available again.');

    res.status(200).json({
      message: isReserved
        ? 'Listing reserved and removed from market.'
        : 'Listing unreserved and visible to market.',
      listing,
    });
  // } catch (err) {
  //   res.status(400).json({ error: err.message });
  // }
});

const toggleSold = asyncHandler (async (req, res) => {
// try {
      console.log(`toggleSold backend api`)
      const listingId = req.params.listingId;

      const listing = await Listing.findById(listingId);

      if (!listing) {
        // return res.status(404).json({ error: 'Listing not found' });
        res.status(404);
        throw new Error('Listing not found');
      }

      if (listing.isSold) {
        //return res.status(400).json({ error: 'Listing is already marked as sold.' });
        res.status(400);
        throw new Error('Listing is already marked as sold.');
      }
      console.log(`toggleSold backend api`)
      listing.isSold = true;
      listing.isVisibleToMarket = false; // ⛔️ remove from market

      listing.reservationUntil=null,
      listing.isNotificationDisabled = false,
      listing.isAwaitingUserConfirmation = false,
      listing.shouldPromptUser = false,
      
      await listing.save();

      // ✅ Notify all buyers about status change
      await notifyListingStatus(listingId,listing.title,'This listing has been sold.');

      res.status(200).json({ message: 'Listing marked as sold and removed from market.', listing });
  // } catch (err) {
  //   res.status(400).json({ error: err.message });
  // }
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