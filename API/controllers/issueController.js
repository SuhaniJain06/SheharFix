const CivicIssue = require('../models/CivicIssue');
const IssueUpdate = require('../models/IssueUpdate');
const WorkOrder = require('../models/WorkOrder');

// Create new issue
const createIssue = async (req, res) => {
  try {
    const issueData = {
      ...req.body,
      reporter: req.user._id
    };

    // Handle file uploads
    if (req.files?.images) {
      issueData.images = req.files.images.map(file => ({
        url: `/uploads/images/${file.filename}`,
        caption: ''
      }));
    }

    const issue = new CivicIssue(issueData);
    await issue.save();

    // Create initial update
    await IssueUpdate.createCommentUpdate(
      issue._id,
      req.user._id,
      'Issue reported',
      false
    );

    // Populate reporter information
    await issue.populate('reporter', 'name email');

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get all issues with filtering and pagination
const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.reporter) filter.reporter = req.query.reporter;
    if (req.query.assignedOfficial) filter.assignedOfficial = req.query.assignedOfficial;
    
    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Location-based search
    if (req.query.latitude && req.query.longitude && req.query.radius) {
      const radius = parseInt(req.query.radius);
      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
          },
          $maxDistance: radius
        }
      };
    }

    // Build sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      sort = { [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 };
    }

    const issues = await CivicIssue.find(filter)
      .populate('reporter', 'name email')
      .populate('assignedOfficial', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await CivicIssue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalIssues: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get single issue by ID
const getIssueById = async (req, res) => {
  try {
    const issue = await CivicIssue.findById(req.params.id)
      .populate('reporter', 'name email phone')
      .populate('assignedOfficial', 'name email role phone')
      .populate('progress.updatedBy', 'name email role')
      .populate('comments.user', 'name email role')
      .populate('upvotes.user', 'name')
      .populate('downvotes.user', 'name')
      .populate('workOrders');

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      });
    }

    // Get related updates
    const updates = await IssueUpdate.find({ issue: issue._id })
      .populate('updatedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      issue,
      updates
    });
  } catch (error) {
    console.error('Get issue by ID error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update issue
const updateIssue = async (req, res) => {
  try {
    const issue = await CivicIssue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      });
    }

    // Check permissions
    if (req.user.role === 'citizen' && !issue.reporter.equals(req.user._id)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    const updates = req.body;
    const previousStatus = issue.status;

    // Handle status changes
    if (updates.status && updates.status !== previousStatus) {
      await IssueUpdate.createStatusUpdate(
        issue._id,
        req.user._id,
        previousStatus,
        updates.status,
        `Status changed to ${updates.status}`
      );
    }

    // Handle assignment changes
    if (updates.assignedOfficial && !issue.assignedOfficial?.equals(updates.assignedOfficial)) {
      await IssueUpdate.createAssignmentUpdate(
        issue._id,
        req.user._id,
        updates.assignedOfficial,
        `Issue assigned to official`
      );
    }

    // Update the issue
    const updatedIssue = await CivicIssue.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('reporter', 'name email')
     .populate('assignedOfficial', 'name email role');

    res.json({
      message: 'Issue updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete issue
const deleteIssue = async (req, res) => {
  try {
    const issue = await CivicIssue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      });
    }

    // Check permissions
    if (req.user.role === 'citizen' && !issue.reporter.equals(req.user._id)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    await CivicIssue.findByIdAndDelete(req.params.id);
    await IssueUpdate.deleteMany({ issue: req.params.id });

    res.json({
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add comment to issue
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await CivicIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      });
    }

    await issue.addComment(req.user._id, text, req.user.role !== 'citizen');
    await IssueUpdate.createCommentUpdate(req.params.id, req.user._id, text, req.user.role !== 'citizen');

    // Populate the updated issue
    await issue.populate('comments.user', 'name email role');

    res.json({
      message: 'Comment added successfully',
      issue
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Vote on issue
const voteOnIssue = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const issue = await CivicIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      });
    }

    // Check if user already voted
    const hasUpvoted = issue.upvotes.some(vote => vote.user.equals(req.user._id));
    const hasDownvoted = issue.downvotes.some(vote => vote.user.equals(req.user._id));

    if (voteType === 'upvote' && hasUpvoted) {
      return res.status(400).json({
        message: 'You have already upvoted this issue'
      });
    }

    if (voteType === 'downvote' && hasDownvoted) {
      return res.status(400).json({
        message: 'You have already downvoted this issue'
      });
    }

    await issue.vote(req.user._id, voteType);
    await IssueUpdate.createVoteUpdate(req.params.id, req.user._id, voteType, `${voteType} on issue`);

    res.json({
      message: 'Vote recorded successfully',
      issue: {
        upvotes: issue.upvotes.length,
        downvotes: issue.downvotes.length,
        voteCount: issue.voteCount
      }
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add progress update
const addProgressUpdate = async (req, res) => {
  try {
    const { status, description } = req.body;
    const issue = await CivicIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      });
    }

    // Only officials and admins can add progress updates
    if (!['admin', 'official'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Only officials can add progress updates.'
      });
    }

    const images = req.files?.images ? 
      req.files.images.map(file => `/uploads/progressImages/${file.filename}`) : [];

    await issue.addProgress(status, description, req.user._id, images);
    await IssueUpdate.createProgressUpdate(req.params.id, req.user._id, description, images);

    res.json({
      message: 'Progress update added successfully',
      issue
    });
  } catch (error) {
    console.error('Add progress update error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user's issues
const getUserIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { reporter: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const issues = await CivicIssue.find(filter)
      .populate('assignedOfficial', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CivicIssue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalIssues: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user issues error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  addComment,
  voteOnIssue,
  addProgressUpdate,
  getUserIssues
};
