const mongoose = require('mongoose');

const issueUpdateSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CivicIssue',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updateType: {
    type: String,
    required: true,
    enum: [
      'status_change',
      'assignment',
      'progress_update',
      'comment',
      'vote',
      'resolution',
      'rejection',
      'priority_change',
      'category_change',
      'location_update',
      'image_upload',
      'work_order_created',
      'work_order_completed'
    ]
  },
  previousValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  description: {
    type: String,
    required: true,
    maxlength: [500, 'Update description cannot exceed 500 characters']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  metadata: {
    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkOrder'
    },
    images: [String],
    documents: [String],
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    estimatedCost: Number,
    estimatedTime: Number,
    actualCost: Number,
    actualTime: Number
  },
  notifications: {
    sent: { type: Boolean, default: false },
    recipients: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      method: {
        type: String,
        enum: ['email', 'push', 'sms']
      },
      sentAt: Date
    }]
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
issueUpdateSchema.index({ issue: 1, createdAt: -1 });
issueUpdateSchema.index({ updatedBy: 1, createdAt: -1 });
issueUpdateSchema.index({ updateType: 1 });
issueUpdateSchema.index({ isOfficial: 1, createdAt: -1 });

// Virtual for formatted update text
issueUpdateSchema.virtual('formattedUpdate').get(function() {
  const updates = {
    status_change: `Status changed from "${this.previousValue}" to "${this.newValue}"`,
    assignment: `Assigned to ${this.newValue}`,
    progress_update: 'Progress updated',
    comment: 'New comment added',
    vote: `Vote ${this.newValue}`,
    resolution: 'Issue resolved',
    rejection: 'Issue rejected',
    priority_change: `Priority changed from "${this.previousValue}" to "${this.newValue}"`,
    category_change: `Category changed from "${this.previousValue}" to "${this.newValue}"`,
    location_update: 'Location updated',
    image_upload: 'Image uploaded',
    work_order_created: 'Work order created',
    work_order_completed: 'Work order completed'
  };
  
  return updates[this.updateType] || this.description;
});

// Static method to create status change update
issueUpdateSchema.statics.createStatusUpdate = function(issueId, updatedBy, previousStatus, newStatus, description) {
  return this.create({
    issue: issueId,
    updatedBy,
    updateType: 'status_change',
    previousValue: previousStatus,
    newValue: newStatus,
    description,
    isOfficial: true
  });
};

// Static method to create assignment update
issueUpdateSchema.statics.createAssignmentUpdate = function(issueId, updatedBy, assignedOfficial, description) {
  return this.create({
    issue: issueId,
    updatedBy,
    updateType: 'assignment',
    previousValue: null,
    newValue: assignedOfficial,
    description,
    isOfficial: true
  });
};

// Static method to create progress update
issueUpdateSchema.statics.createProgressUpdate = function(issueId, updatedBy, description, images = [], workOrderId = null) {
  return this.create({
    issue: issueId,
    updatedBy,
    updateType: 'progress_update',
    description,
    isOfficial: true,
    metadata: {
      images,
      workOrderId
    }
  });
};

// Static method to create comment update
issueUpdateSchema.statics.createCommentUpdate = function(issueId, updatedBy, comment, isOfficial = false) {
  return this.create({
    issue: issueId,
    updatedBy,
    updateType: 'comment',
    newValue: comment,
    description: comment,
    isOfficial
  });
};

// Static method to create vote update
issueUpdateSchema.statics.createVoteUpdate = function(issueId, updatedBy, voteType, description) {
  return this.create({
    issue: issueId,
    updatedBy,
    updateType: 'vote',
    newValue: voteType,
    description,
    isOfficial: false
  });
};

// Method to send notifications
issueUpdateSchema.methods.sendNotifications = async function(recipients) {
  // This would integrate with notification service
  // For now, just mark as sent
  this.notifications.sent = true;
  this.notifications.recipients = recipients.map(recipient => ({
    user: recipient.user,
    method: recipient.method,
    sentAt: new Date()
  }));
  return this.save();
};

module.exports = mongoose.model('IssueUpdate', issueUpdateSchema);
