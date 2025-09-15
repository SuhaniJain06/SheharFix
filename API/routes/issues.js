const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  validateIssueCreation,
  validateIssueUpdate,
  validatePagination,
  validateLocationQuery,
  validateObjectId
} = require('../middleware/validation');
const {
  uploadIssueImages,
  handleUploadError,
  cleanupOnError
} = require('../middleware/upload');

// Public routes (with optional auth for enhanced features)
router.get('/', optionalAuth, validatePagination, validateLocationQuery, issueController.getIssues);
router.get('/:id', optionalAuth, validateObjectId(), issueController.getIssueById);

// Protected routes
router.post('/', authenticate, uploadIssueImages, handleUploadError, cleanupOnError, validateIssueCreation, issueController.createIssue);
router.put('/:id', authenticate, validateObjectId(), validateIssueUpdate, issueController.updateIssue);
router.delete('/:id', authenticate, validateObjectId(), issueController.deleteIssue);

// Issue interactions
router.post('/:id/comments', authenticate, validateObjectId(), issueController.addComment);
router.post('/:id/vote', authenticate, validateObjectId(), issueController.voteOnIssue);
router.post('/:id/progress', authenticate, validateObjectId(), issueController.addProgressUpdate);

// User-specific routes
router.get('/user/my-issues', authenticate, validatePagination, issueController.getUserIssues);

module.exports = router;
