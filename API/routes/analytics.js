const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, requireOfficial } = require('../middleware/auth');
const { validateLocationQuery } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Dashboard analytics (accessible to all authenticated users)
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// Detailed analytics (require official/admin access)
router.get('/issues', requireOfficial, analyticsController.getIssueAnalytics);
router.get('/work-orders', requireOfficial, analyticsController.getWorkOrderAnalytics);
router.get('/geographic', validateLocationQuery, analyticsController.getGeographicAnalytics);

module.exports = router;
