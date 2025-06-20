const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const sendOTP = asyncHandler (async (req, res) => {
  const {username,email,password} = req.body
  // const { email } = req.body.email;
  // const { password } = req.body.password;

  console.log(`sendOTP username ${username}   email ${email}  password${password}`);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await User.create({ username, email, password: hashedPassword, otp, otpExpires });

  // Send email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'grocerysmartteam@gmail.com',// process.env.EMAIL_USER
            pass: 'iewhjomvbbvfmiwe', // Your email password (or app-specific password)
        },
    });


    await transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    });

  res.json({ message: 'OTP sent to email' });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token, user });
});

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 4. Return token and user info
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    sendOTP,
    verifyOTP,
    loginUser
}