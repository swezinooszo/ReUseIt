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

    res.json(user);
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = {
    getUsers,
    createUser,
    getUserProfile
}