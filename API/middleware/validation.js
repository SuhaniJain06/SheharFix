const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Issue validation rules
const validateIssueCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_transport', 'waste_management', 'safety', 'environment', 'healthcare', 'education', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage('Each tag must be a string with maximum 20 characters'),
  handleValidationErrors
];

const validateIssueUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid issue ID'),
  body('status')
    .optional()
    .isIn(['reported', 'under_review', 'in_progress', 'resolved', 'closed', 'rejected'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('assignedOfficial')
    .optional()
    .isMongoId()
    .withMessage('Invalid official ID'),
  handleValidationErrors
];

// Work Order validation rules
const validateWorkOrderCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('civicIssue')
    .isMongoId()
    .withMessage('Invalid civic issue ID'),
  body('category')
    .isIn(['repair', 'maintenance', 'construction', 'installation', 'cleaning', 'inspection', 'emergency_response', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('budget.estimated.amount')
    .isFloat({ min: 0 })
    .withMessage('Estimated budget must be a positive number'),
  body('timeline.estimated.startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  body('timeline.estimated.endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date'),
  handleValidationErrors
];

// Community Watch validation rules
const validateCommunityWatchCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('type')
    .isIn(['safety_alert', 'crime_report', 'suspicious_activity', 'emergency', 'community_event', 'announcement', 'lost_found', 'neighborhood_watch', 'environmental_concern', 'traffic_alert'])
    .withMessage('Invalid type'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('occurredAt')
    .isISO8601()
    .withMessage('Invalid occurrence date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  handleValidationErrors
];

// Query validation rules
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Sort field must be a string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

const validateLocationQuery = [
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  query('radius')
    .optional()
    .isFloat({ min: 100, max: 50000 })
    .withMessage('Radius must be between 100 and 50000 meters'),
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateIssueCreation,
  validateIssueUpdate,
  validateWorkOrderCreation,
  validateCommunityWatchCreation,
  validatePagination,
  validateLocationQuery,
  validateObjectId
};
