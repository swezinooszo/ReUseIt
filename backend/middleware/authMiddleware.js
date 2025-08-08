const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // optional if you want user info

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to the request
      req.user = { id: decoded.id };

      // Continue to the route handler
      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
