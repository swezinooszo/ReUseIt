const express = require('express');
const router = express.Router();
const {submitReview, getReviewsForUser, getUserRatingStats,checkIfReviewExists} = require('../controllers/reviewController');

const protect = require('../middleware/authMiddleware');

router.route('/').post(protect, submitReview);
router.route('/user/:userId').get(getReviewsForUser);
router.route('/user/:userId/stats').get(getUserRatingStats);
// Check if review exists (for logged-in user)
router.route('/exists').get(protect, checkIfReviewExists);

module.exports = router;
