const asyncHandler = require('express-async-handler')
const Notification = require('../models/notificationModel')

const createNotification = asyncHandler( async (req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400); 
        throw new Error('Please add a text field');
    }

    const notification = await Notification.create({
            user: req.body.revieweeId,
            type: 'review',
            message: req.body.message,
            reviewer:req.body.reviewerId,
            listing:req.body.listingId,
            review: req.body.reviewId,
            isRead: false
    });

    res.status(200).json(notification);
})

 const getUserNotifications = asyncHandler( async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('reviewer')
      .populate('listing')
      .populate('review')

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /notifications/:id
 * Marks a notification as read
 */
const markNotificationAsRead = asyncHandler(async (req, res) => {
 // try {
    const { id } = req.params;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      res.status(400); 
      throw new Error('Notification not found' );
    }

    res.status(200).json(updatedNotification);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
});

module.exports = {createNotification,getUserNotifications,markNotificationAsRead}
