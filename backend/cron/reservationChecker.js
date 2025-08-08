// cron/reservationChecker.js

const cron = require('node-cron');
const Listing = require('../models/listingModel');

// Runs every 10 minutes
cron.schedule('*/2 * * * *', async () => {
  try {
    const now = new Date();
    console.log('reservation checker start',``)

      const result = await Listing.updateMany(
      {
        isReserved: true,
        reservationUntil: { $lt: now, $ne: null }, // ignore null values
        isNotificationDisabled: true,
        isAwaitingUserConfirmation: { $ne: true },
      },
      {
        $set: {
          isAwaitingUserConfirmation: true,
          shouldPromptUser: true,
        },
      }
    );
    // const expiredListings = await Listing.find({
    //   isReserved: true,
    //   reservationUntil: { $lt: now, $ne: null }, // ignore null values//{ $lt: now },
    //   isNotificationDisabled: true,
    //   isAwaitingUserConfirmation: { $ne: true },
    // });
    // console.log('reservation checker',` reservationUntil ${reservationUntil}`)
    // for (let listing of expiredListings) {
    //    console.log('reservation checker',` expiredListings ${listing.title}`)
    //   listing.isAwaitingUserConfirmation = true;
    //   listing.shouldPromptUser = true;
    //   await listing.save();
    //   console.log(`Listing ${listing._id} marked as awaiting confirmation.`);
    // }
     console.log(`${result.modifiedCount} listings marked as awaiting confirmation.`);
  } catch (err) {
    console.error('Error checking reservations:', err);
  }
});
