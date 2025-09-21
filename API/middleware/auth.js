const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Check if user is official or admin
const requireOfficial = (req, res, next) => {
  if (!['admin', 'official'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Official privileges required.' });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Check if user owns resource or is admin/official
const requireOwnershipOrOfficial = (resourceUserIdField = 'user') => {
  return (req, res, next) => {
    const resourceUserId = req.resource?.[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (req.user.role === 'admin' || req.user.role === 'official') {
      return next();
    }
    
    if (req.user._id.toString() === resourceUserId?.toString()) {
      return next();
    }
    
    res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
  };
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = {
  authenticate,
  requireAdmin,
  requireOfficial,
  optionalAuth,
  requireOwnershipOrOfficial,
  generateToken
};
