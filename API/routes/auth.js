const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', validateUserLogin, authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);
router.delete('/account', authenticate, authController.deleteAccount);

// Admin routes
router.get('/users', authenticate, requireAdmin, authController.getAllUsers);
router.put('/users/:userId/role', authenticate, requireAdmin, authController.updateUserRole);

module.exports = router;
