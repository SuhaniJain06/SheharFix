const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      verifiedUsers,
      activeUsers,
      usersByRole,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Search users (admin only)
router.get('/search', requireAdmin, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.q;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;
