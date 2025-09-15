const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrderController');
const { authenticate, requireOfficial } = require('../middleware/auth');
const {
  validateWorkOrderCreation,
  validatePagination,
  validateObjectId
} = require('../middleware/validation');
const {
  uploadWorkOrderFiles,
  handleUploadError,
  cleanupOnError
} = require('../middleware/upload');

// All routes require authentication
router.use(authenticate);

// Work order CRUD operations
router.post('/', requireOfficial, uploadWorkOrderFiles, handleUploadError, cleanupOnError, validateWorkOrderCreation, workOrderController.createWorkOrder);
router.get('/', validatePagination, workOrderController.getWorkOrders);
router.get('/:id', validateObjectId(), workOrderController.getWorkOrderById);
router.put('/:id', validateObjectId(), workOrderController.updateWorkOrder);

// Work order progress and management
router.post('/:id/progress', uploadWorkOrderFiles, handleUploadError, cleanupOnError, validateObjectId(), workOrderController.addProgressUpdate);
router.post('/:id/quality-check', requireOfficial, uploadWorkOrderFiles, handleUploadError, cleanupOnError, validateObjectId(), workOrderController.addQualityCheck);
router.post('/:id/complete', uploadWorkOrderFiles, handleUploadError, cleanupOnError, validateObjectId(), workOrderController.completeWorkOrder);
router.post('/:id/issues', validateObjectId(), workOrderController.addIssue);

// Contractor-specific routes
router.get('/contractor/:contractorId', validatePagination, workOrderController.getContractorWorkOrders);

module.exports = router;
