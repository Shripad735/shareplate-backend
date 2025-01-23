const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Authorization header or cookie
    let token = req.header('Authorization')?.replace('Bearer ', ''); // Check the Authorization header
    if (!token) {
      token = req.cookies.token; // Fallback to the cookie
    }

    console.log('Token received:', token); // Debug: Log the token

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug: Log the decoded token

    // Check if the decoded token contains the user ID
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token: User ID not found' });
    }

    // Find the user in the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;
    console.log('Authenticated User:', user); // Debug: Log the authenticated user

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Auth Middleware Error:', error); // Log the error

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Generic error response
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = authMiddleware;