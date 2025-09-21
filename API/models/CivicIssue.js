const mongoose = require('mongoose');

const civicIssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Issue category is required'],
    enum: [
      'infrastructure',
      'sanitation',
      'water_supply',
      'electricity',
      'roads',
      'public_transport',
      'waste_management',
      'safety',
      'environment',
      'healthcare',
      'education',
      'other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['reported', 'under_review', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'reported'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedOfficial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    ward: String,
    zone: String,
    landmark: String
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  estimatedCost: {
    amount: Number,
    currency: { type: String, default: 'INR' }
  },
  estimatedTime: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days'
    }
  },
  progress: [{
    status: String,
    description: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: { type: Date, default: Date.now },
    images: [String]
  }],
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: { type: Date, default: Date.now }
  }],
  downvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: { type: Date, default: Date.now },
    isOfficial: { type: Boolean, default: false }
  }],
  resolution: {
    description: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    beforeImages: [String],
    afterImages: [String],
    actualCost: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    actualTime: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    }
  },
  workOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkOrder'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for geospatial queries
civicIssueSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
civicIssueSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for vote count
civicIssueSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for comment count
civicIssueSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add progress update
civicIssueSchema.methods.addProgress = function(status, description, updatedBy, images = []) {
  this.progress.push({
    status,
    description,
    updatedBy,
    images
  });
  this.status = status;
  return this.save();
};

// Method to add comment
civicIssueSchema.methods.addComment = function(userId, text, isOfficial = false) {
  this.comments.push({
    user: userId,
    text,
    isOfficial
  });
  return this.save();
};

// Method to vote
civicIssueSchema.methods.vote = function(userId, voteType) {
  if (voteType === 'upvote') {
    // Remove from downvotes if exists
    this.downvotes = this.downvotes.filter(vote => !vote.user.equals(userId));
    // Add to upvotes if not already there
    if (!this.upvotes.some(vote => vote.user.equals(userId))) {
      this.upvotes.push({ user: userId });
    }
  } else if (voteType === 'downvote') {
    // Remove from upvotes if exists
    this.upvotes = this.upvotes.filter(vote => !vote.user.equals(userId));
    // Add to downvotes if not already there
    if (!this.downvotes.some(vote => vote.user.equals(userId))) {
      this.downvotes.push({ user: userId });
    }
  }
  return this.save();
};

module.exports = mongoose.model('CivicIssue', civicIssueSchema);
