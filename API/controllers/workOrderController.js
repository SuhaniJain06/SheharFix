const WorkOrder = require('../models/WorkOrder');
const CivicIssue = require('../models/CivicIssue');
const IssueUpdate = require('../models/IssueUpdate');

// Create new work order
const createWorkOrder = async (req, res) => {
  try {
    const workOrderData = {
      ...req.body,
      assignedBy: req.user._id
    };

    // Verify the civic issue exists
    const issue = await CivicIssue.findById(req.body.civicIssue);
    if (!issue) {
      return res.status(404).json({
        message: 'Civic issue not found'
      });
    }

    const workOrder = new WorkOrder(workOrderData);
    await workOrder.save();

    // Update the civic issue with work order reference
    issue.workOrders.push(workOrder._id);
    await issue.save();

    // Create update for the issue
    await IssueUpdate.createProgressUpdate(
      issue._id,
      req.user._id,
      `Work order created: ${workOrder.title}`,
      [],
      workOrder._id
    );

    // Populate related data
    await workOrder.populate([
      { path: 'civicIssue', select: 'title description' },
      { path: 'assignedTo.contractor', select: 'name email' },
      { path: 'assignedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      message: 'Work order created successfully',
      workOrder
    });
  } catch (error) {
    console.error('Create work order error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get all work orders
const getWorkOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedBy) filter.assignedBy = req.query.assignedBy;
    if (req.query.contractor) filter['assignedTo.contractor'] = req.query.contractor;

    // For contractors, only show their assigned work orders
    if (req.user.role === 'contractor') {
      filter['assignedTo.contractor'] = req.user._id;
    }

    const workOrders = await WorkOrder.find(filter)
      .populate('civicIssue', 'title description status')
      .populate('assignedTo.contractor', 'name email phone')
      .populate('assignedBy', 'name email role')
      .populate('progress.updatedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WorkOrder.countDocuments(filter);

    res.json({
      workOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalWorkOrders: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get work orders error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get single work order
const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate('civicIssue')
      .populate('assignedTo.contractor', 'name email phone address')
      .populate('assignedBy', 'name email role')
      .populate('progress.updatedBy', 'name email role')
      .populate('qualityChecks.performedBy', 'name email role')
      .populate('completion.completedBy', 'name email role');

    if (!workOrder) {
      return res.status(404).json({
        message: 'Work order not found'
      });
    }

    // Check permissions for contractors
    if (req.user.role === 'contractor' && 
        !workOrder.assignedTo.contractor?.equals(req.user._id)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    res.json({
      workOrder
    });
  } catch (error) {
    console.error('Get work order by ID error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update work order
const updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder) {
      return res.status(404).json({
        message: 'Work order not found'
      });
    }

    // Check permissions
    const isOwner = workOrder.assignedBy.equals(req.user._id);
    const isAssignedContractor = workOrder.assignedTo.contractor?.equals(req.user._id);
    const isOfficial = ['admin', 'official'].includes(req.user.role);

    if (!isOwner && !isAssignedContractor && !isOfficial) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    const updates = req.body;
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('civicIssue', 'title description')
     .populate('assignedTo.contractor', 'name email')
     .populate('assignedBy', 'name email role');

    res.json({
      message: 'Work order updated successfully',
      workOrder: updatedWorkOrder
    });
  } catch (error) {
    console.error('Update work order error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add progress update to work order
const addProgressUpdate = async (req, res) => {
  try {
    const { status, description, completionPercentage, notes } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        message: 'Work order not found'
      });
    }

    // Check permissions
    const isAssignedContractor = workOrder.assignedTo.contractor?.equals(req.user._id);
    const isOfficial = ['admin', 'official'].includes(req.user.role);

    if (!isAssignedContractor && !isOfficial) {
      return res.status(403).json({
        message: 'Access denied. Only assigned contractors or officials can update progress.'
      });
    }

    const images = req.files?.progressImages ? 
      req.files.progressImages.map(file => `/uploads/progressImages/${file.filename}`) : [];

    await workOrder.addProgress(status, description, completionPercentage, req.user._id, images, notes);

    // Update the related civic issue
    if (workOrder.civicIssue) {
      await IssueUpdate.createProgressUpdate(
        workOrder.civicIssue,
        req.user._id,
        `Work order progress: ${description}`,
        images,
        workOrder._id
      );
    }

    res.json({
      message: 'Progress update added successfully',
      workOrder
    });
  } catch (error) {
    console.error('Add progress update error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add quality check
const addQualityCheck = async (req, res) => {
  try {
    const { checkType, description, status, notes } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        message: 'Work order not found'
      });
    }

    // Only officials and admins can perform quality checks
    if (!['admin', 'official'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Only officials can perform quality checks.'
      });
    }

    const images = req.files?.images ? 
      req.files.images.map(file => `/uploads/qualityChecks/${file.filename}`) : [];

    await workOrder.addQualityCheck(checkType, description, req.user._id, status, notes, images);

    res.json({
      message: 'Quality check added successfully',
      workOrder
    });
  } catch (error) {
    console.error('Add quality check error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Complete work order
const completeWorkOrder = async (req, res) => {
  try {
    const { finalReport, qualityRating, clientSatisfaction } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        message: 'Work order not found'
      });
    }

    // Check permissions
    const isAssignedContractor = workOrder.assignedTo.contractor?.equals(req.user._id);
    const isOfficial = ['admin', 'official'].includes(req.user.role);

    if (!isAssignedContractor && !isOfficial) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    const beforeImages = req.files?.beforeImages ? 
      req.files.beforeImages.map(file => `/uploads/beforeImages/${file.filename}`) : [];
    const afterImages = req.files?.afterImages ? 
      req.files.afterImages.map(file => `/uploads/afterImages/${file.filename}`) : [];

    await workOrder.complete(req.user._id, finalReport, beforeImages, afterImages, qualityRating, clientSatisfaction);

    // Update the related civic issue
    if (workOrder.civicIssue) {
      const issue = await CivicIssue.findById(workOrder.civicIssue);
      if (issue) {
        issue.status = 'resolved';
        await issue.save();

        await IssueUpdate.createProgressUpdate(
          workOrder.civicIssue,
          req.user._id,
          `Work order completed: ${finalReport}`,
          afterImages,
          workOrder._id
        );
      }
    }

    res.json({
      message: 'Work order completed successfully',
      workOrder
    });
  } catch (error) {
    console.error('Complete work order error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add issue to work order
const addIssue = async (req, res) => {
  try {
    const { description, severity } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        message: 'Work order not found'
      });
    }

    await workOrder.addIssue(description, severity, req.user._id);

    res.json({
      message: 'Issue added to work order successfully',
      workOrder
    });
  } catch (error) {
    console.error('Add issue to work order error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get work orders by contractor
const getContractorWorkOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { 'assignedTo.contractor': req.params.contractorId };
    if (req.query.status) filter.status = req.query.status;

    const workOrders = await WorkOrder.find(filter)
      .populate('civicIssue', 'title description status')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WorkOrder.countDocuments(filter);

    res.json({
      workOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalWorkOrders: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get contractor work orders error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  createWorkOrder,
  getWorkOrders,
  getWorkOrderById,
  updateWorkOrder,
  addProgressUpdate,
  addQualityCheck,
  completeWorkOrder,
  addIssue,
  getContractorWorkOrders
};
