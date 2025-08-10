const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Notification = require('../models/notificationModel')
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(expoPushToken, title, body, data = {}) {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Invalid Expo push token: ${expoPushToken}`);
    return;
  }

  const messages = [{
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  }];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

//const {listingId='',receiverId='',receiverName='',receiverEmail='',currentUserId='',token='',price=0,sellerId=''} = useLocalSearchParams() as Record<string, string>;
async function notifyNewMessage(receiverUserId, messageText,listingTitle,currentUserName
          //,currentUserId,token 
          ,chat
       // ,listingId,receiverName,receiverEmail,currentUserId,token,price,sellerId,chatIdParam,isUnread
) {
  console.log(`notifyNewMessage ${receiverUserId} messageText => ${messageText}  currentUserName =>${currentUserName}`)
  const user = await User.findById(receiverUserId);
   if (!user || !user.expoPushTokens || user.expoPushTokens.length === 0) {
    console.log('User has no push tokens');
    return;
  }

    // Loop through all stored tokens
  for (const pushtoken of user.expoPushTokens) {
    await sendPushNotification(
      pushtoken,
      currentUserName+ ' - '+listingTitle,
      messageText,
        { type: 'chat', chat:chat}//currentUserId:currentUserId,token:token,
      // { type: 'chat', listingId:listingId,receiverUserId:receiverUserId,receiverName:receiverName,receiverEmail:receiverEmail,
      //   currentUserId:currentUserId,token:token,price:price,sellerId:sellerId,chatIdParam:chatIdParam,isUnread:isUnread }
    );
  }
}


async function notifyListingStatus(listingId, title,statusMessage) {
  try {
    // Find all chats related to the listing (buyers who inquired)
    const chats = await Chat.find({ listingId });

    for (const chat of chats) {
      console.log(`notifyListingStatus chatId ${chat._id}`)
      const buyerId = chat.buyerId;
      const user = await User.findById(buyerId);

      if (!user || !user.expoPushTokens || user.expoPushTokens.length === 0) {
        console.log(`No push token for user ${buyerId}`);
        continue;
      }

      console.log(`notifyListingStatus username ${user.username}`)
      for (const token of user.expoPushTokens) {
        console.log(`notifyListingStatus token ${token}`)
        await sendPushNotification(
          token,
          title,//'Listing Status Update',
          statusMessage,
          { type: 'listing-status', listingId: listingId }
        );
      }
    }
  } catch (error) {
    console.error('Error notifying buyers about listing status:', error);
  }
}

async function notifyReview(reviewId,listingId,reviewerId,revieweeId) {
  try {
   // const user = await User.findById(reviewerId);
    const reviewer = await User.findById(reviewerId);//.select('username');
    const message = `left you a new review.`;
    const reviewee = await User.findById(revieweeId);

     // 1️⃣ Store in database for in-app notifications
    const notification = await Notification.create({
        user: revieweeId,
        type: 'review',
        message,
        reviewer:reviewerId,
        listing:listingId,
        review:reviewId,
        isRead: false
    });

     // 2️⃣ Send push notification
    console.log(`notifyReview username ${reviewer.username}`)
      for (const token of reviewee.expoPushTokens) {
        console.log(`notifyListingStatus token ${token}`)
        await sendPushNotification(
          token,
          'New Review Received',
          `${reviewer.username} ${message}`,
          { type: 'review', reviewId:reviewId,listingId: listingId,reviewerId:reviewerId,revieweeId:revieweeId, notificationId:notification._id}
        );
      }
    
  } catch (error) {
    console.error('Error notifying buyers about listing status:', error);
  }
}

module.exports = { sendPushNotification,notifyNewMessage,notifyListingStatus, notifyReview};
