//3.
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');

// @desc    Create Users
// @route   POST /api/users
// @access Private
const createUser = asyncHandler( async (req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400); 
        throw new Error('Please add a text field');
    }

      const user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    })

    res.status(200).json(user);
})

// @desc    Get Users
// @route   GET /api/users
// @access Private
const getUsers = asyncHandler(async (req,res) => {
    const users = await User.find()
    res.status(200).json(users);
})


// @desc    Get Users Info
// @route   GET /api/users/me
// @access Private
const getUserProfile = asyncHandler(async (req,res) => {
  const authHeader = req.headers.authorization;

    console.log(`getUserProfile authHeader ${authHeader}`)
  // Check for token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401); 
    throw new Error('Authorization token missing');
  }

  const token = authHeader.split(' ')[1];
  console.log(`getUserProfile token ${token}`)
  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
     console.log(`getUserProfile userId ${userId}`)
    // Fetch user from DB (excluding password)
    const user = await User.findById(userId).select('-password');
    if (!user) {
       res.status(404); 
       throw new Error('User not found');
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

const getUserProfileById = asyncHandler(async (req,res) => {
  const userId = req.params.userId
  try {
     console.log(`getUserProfileById userId ${userId}`)
    const user = await User.findById(userId).select('-password');
    if (!user) {
       res.status(404); 
       throw new Error('User not found');
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// @desc    Save ExpoPushToken
// @route   POST /api/savetoken
// @access Private
const saveExpoPushToken = asyncHandler( async (req,res) => {
   console.error('saveExpoPushToken:', req.body);
    console.log(req.body);
    const { userId, expoPushToken } = req.body;

    if (!userId || !expoPushToken) {
    throw new Error('Missing userId or token' );
    }

    try {
    const user = await User.findById(userId);
    console.error('saveExpoPushToken: user', user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.expoPushTokens.includes(expoPushToken)) {
      user.expoPushTokens.push(expoPushToken);
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error saving ExpoPushToken :', error);
    res.status(500).json({ message: 'Server error' });
  }
})

// @desc    Remove ExpoPushToken
// @route   POST /api/removetoken
// @access Private
const removeExpoPushToken = asyncHandler( async (req,res) => {
    const { userId, expoPushToken } = req.body;
    console.log(`removeExpoPushToken  userId ${userId}   expoPushToken ${expoPushToken}`);
    if (!userId || !expoPushToken) {
    throw new Error('Missing userId or token' );
    }

    try {
     console.log(`removeExpoPushToken  try `);
    const user = await User.findById(userId);
    if (!user)  return res.status(404).json({ message: 'User not found' });

     console.log(`removeExpoPushToken  start `);
    user.expoPushTokens = user.expoPushTokens.filter(token => token !== expoPushToken);
    await user.save();

       console.log(`removeExpoPushToken  end ${user.expoPushTokens}`); 
    res.status(200).json(user);
  } catch (error) {
    console.error('Error removing ExpoPushToken :', error);
    res.status(500).json({ message: 'Server error' });
  }
})

const toggleFavorite = asyncHandler (async (req, res) => {
    try {
        const userId = req.user.id; // get userid from authentication middleware
        const { listingId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.favorites.indexOf(listingId);

        if (index === -1) {
            // Add to favorites
            user.favorites.push(listingId);
        } else {
            // Remove from favorites
            user.favorites.splice(index, 1);
        }

        await user.save();

        res.status(200).json({
            message: index === -1 ? 'Added to favorites' : 'Removed from favorites',
            favorites: user.favorites
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

const getFavoriteListings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400);
    throw new Error('Missing userId');
  }

  const user = await User.findById(userId).populate('favorites');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.favorites);
});

// @desc    Update profile picture
// @route   PUT /api/users/profile-image
// @access  Private
const updateProfileImage = asyncHandler(async (req, res) => {
  const { userId, profileImageUrl } = req.body;

  if (!userId || !profileImageUrl) {
    res.status(400);
    throw new Error('Missing userId or image URL');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.profileImage = profileImageUrl;
  await user.save();

  res.status(200).json({ message: 'Profile image updated successfully', profileImage: user.profileImage });
});


module.exports = {
    getUsers,
    createUser,
    getUserProfile,
    getUserProfileById,
    saveExpoPushToken,
    removeExpoPushToken,
    toggleFavorite,
    getFavoriteListings,
    updateProfileImage
}