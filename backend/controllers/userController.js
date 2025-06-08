//3.
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

// @desc    Get Users
// @route   GET /api/users
// @access Private
const getUsers = asyncHandler(async (req,res) => {
    const users = await User.find()
    res.status(200).json(users);
})

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

module.exports = {
    getUsers,
    createUser
}