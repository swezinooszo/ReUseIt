const asyncHandler = require('express-async-handler')
const Review = require('../models/reviewModel');
const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const {notifyListingStatus, notifyReview} = require('../controllers/sendPushNotification')


// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private
const submitReview = asyncHandler (async (req, res) => {
   
    const { listingId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id; // assume populated via auth middleware

     if(!reviewerId){
        res.status(400)
        throw new Error('reviewerId not found')
    }
     console.log(`submitReview listingId ${listingId } revieweeId ${revieweeId} reviewerId ${reviewerId}
         rating ${rating}. comment ${comment}`)

    const [listing, reviewer, reviewee] = await Promise.all([
        Listing.findById(listingId),
        User.findById(reviewerId),
        User.findById(revieweeId),
    ]);

    if (!listing || !listing.isSold) {
         res.status(400);
        throw new Error('Listing not found or not sold');
    }

    if (!reviewer) {
         res.status(400);
        throw new Error('Reviewer user not found');
    }

    if (!reviewee) {
        res.status(400);
        throw new Error('Reviewee user not found');
    }
  

    const alreadyReviewed = await Review.findOne({
      reviewer: reviewerId,
      reviewee: revieweeId,
      listingId: listingId,
    });

    if (alreadyReviewed) {
      //return res.status(400).json({ message: 'You have already reviewed this user for this listing' });
       res.status(400);
      throw new Error('You have already reviewed this user for this listing' );
    }

    // const newReview = new Review({
    //   reviewer: reviewerId,
    //   reviewee: revieweeId,
    //   listingId,
    //   rating,
    //   comment,
    // });

    // await newReview.save();

    const review = await Review.create({
      reviewer: reviewerId,
      reviewee: revieweeId,
      listingId,
      rating,
      comment,
    })

        // ✅ Notify all buyers about status change
    await notifyReview(review._id,listingId,reviewerId,revieweeId);

    console.log(`submitReview end success`)
    res.status(200).json(review);
});

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviewsForUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'username profileImage')
      .populate('listingId','sellerId')
      .sort({ createdAt: -1 });

     res.status(200).json(reviews);
});

// @desc    Get average rating and review count for a user
// @route   GET /api/reviews/user/:userId/stats
// @access  Public
const getUserRatingStats = asyncHandler (async (req, res) => {
  
    const { userId } = req.params;
    const result = await Review.aggregate([
      { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$reviewee',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ averageRating: 0, reviewCount: 0 });
    }

    const { averageRating, reviewCount } = result[0];
    res.status(200).json({ averageRating, reviewCount });
});

// @desc    Check if a review exists for the logged-in user (reviewer)
// @route   GET /api/reviews/exists?listingId=xxx&revieweeId=yyy
// @access  Private
const checkIfReviewExists = asyncHandler(async (req, res) => {
  const reviewerId = req.user.id;
  const { listingId, revieweeId } = req.query;

  if (!listingId || !revieweeId) {
    res.status(400);
    throw new Error('listingId and revieweeId are required');
  }

  // if (!mongoose.Types.ObjectId.isValid(listingId) || !mongoose.Types.ObjectId.isValid(revieweeId)) {
  //   res.status(400);
  //   throw new Error('Invalid ID format');
  // }

  const review = await Review.findOne({
    reviewer: reviewerId,
    reviewee: revieweeId,
    listingId: listingId,
  });

  res.status(200).json({ exists: !!review });
});

module.exports = {
  submitReview,
  getReviewsForUser,
  getUserRatingStats,
  checkIfReviewExists
};
