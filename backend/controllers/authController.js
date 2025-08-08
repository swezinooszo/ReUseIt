const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const sendOTP = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already registered and verified' });
    } else {
      // Update the existing (unverified) user with a new OTP and updated expiry
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);//new Date(Date.now() + 10 * 60 * 1000); // 5 mins
      await user.save();

      // Send new OTP email
      await sendEmail(email, otp);
      return res.status(200).json({ message: 'OTP resent to email' });
    }
  }

  // First-time registration
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
 // const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins


  user = await User.create({ username, email, password: hashedPassword, otp, otpExpires });

  await sendEmail(email, otp);
  res.status(200).json({ message: 'OTP sent to email' });
});

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'reuseithelpdesk@gmail.com',
      pass: 'icmhczaeukkwilkv', 
    },
  });

  const mailOptions = {
    from: '"ReUseIt Verification" <reuseithelpdesk@gmail.com>',
    to: email,
    subject: 'Your ReUseIt OTP Code',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `
      <p>Hi there,</p>
      <p>We just want to be sure that this email belongs to you.</p>
      <p>To proced, enther this verification code.</p>
      <p><strong>Your One-Time Password (OTP):</strong> <span style="font-size: 18px;"><strong>${otp}</strong></span></p>
      <p>By verifying your email, you can begin selling on ReUseIt. This code is valid for the next <strong>5 minutes</strong>. Please use it to complete your verification.</p>
      <p>If you didn’t request this code, you can safely ignore this message.</p>
      <br/>
      <p>Thanks,<br/>The ReUseIt Team</p>
      <hr/>
      <small>ReUseIt • Reuse. Reduce. Rethink.<br/>reuseithelpdesk@gmail.com</small>
    `,
  };

    await transporter.sendMail(mailOptions);
};

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
  //return jwt token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res.status(200).json({ token, user });
});

const loginUser = async (req, res) => {
  const { email, password, expoPushToken } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // 4. Return token and user info
    res.status(200).json({
      token,
      user: {
        _id: user._id,
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