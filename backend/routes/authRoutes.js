const express = require('express')
const router = express.Router()
const {sendOTP,verifyOTP,loginUser} = require("../controllers/authController")

router.post('/sendotp',sendOTP);
router.post('/verifyotp',verifyOTP)
router.post('/login',loginUser);

module.exports = router