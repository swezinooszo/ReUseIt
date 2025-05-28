//3.
const asyncHandler = require('express-async-handler')

// @desc    Get Items
// @route   GET /api/items
// @access Private
const getItems = asyncHandler(async (req,res) => {
    res.status(200).json({message: 'Get items'});
})

// @desc    Set Items
// @route   POST /api/items
// @access Private
const setItem = asyncHandler( async (req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400);// .json({message: 'Please add a text field'});
        // throw Error stead of return json message 
        // errorHandle hande Error 
        throw new Error('Please add a text field');
    }
    res.status(200).json({message: 'Set items'});
})

// @desc    Update Item
// @route   PUT /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req,res) => {
    res.status(200).json({message: `Update item ${req.params.id}`});
})

// @desc    Delete Item
// @route   DELETE /api/items/:id
// @access Private
const deleteItem = asyncHandler(async (req,res) => {
    res.status(200).json({message: `Delete items ${req.params.id}`});
})

module.exports = {
    getItems,
    setItem,
    updateItem,
    deleteItem
}