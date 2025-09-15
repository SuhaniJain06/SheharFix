const mongoose = require('mongoose');

const communityWatchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Community watch title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: true,
    enum: [
      'safety_alert',
      'crime_report',
      'suspicious_activity',
      'emergency',
      'community_event',
      'announcement',
      'lost_found',
      'neighborhood_watch',
      'environmental_concern',
      'traffic_alert'
    ]
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'investigating', 'resolved', 'false_alarm', 'closed'],
    default: 'active'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    landmark: String,
    radius: {
      type: Number,
      default: 500 // meters
    }
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  occurredAt: {
    type: Date,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    isEvidence: { type: Boolean, default: false }
  }],
  videos: [{
    url: String,
    caption: String,
    duration: Number
  }],
  tags: [String],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  updates: [{
    status: String,
    description: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: { type: Date, default: Date.now },
    isOfficial: { type: Boolean, default: false },
    images: [String]
  }],
  witnesses: [{
    name: String,
    contact: String,
    statement: String,
    isAnonymous: { type: Boolean, default: false }
  }],
  relatedIssues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CivicIssue'
  }],
  policeReport: {
    reportNumber: String,
    station: String,
    officerName: String,
    contact: String,
    filedAt: Date
  },
  communityResponse: {
    upvotes: [{
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
    shares: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sharedAt: { type: Date, default: Date.now },
      platform: String
    }]
  },
  alerts: {
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
    }],
    radius: { type: Number, default: 1000 } // meters
  },
  resolution: {
    description: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    actions: [{
      action: String,
      takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      takenAt: Date,
      outcome: String
    }],
    followUpRequired: { type: Boolean, default: false },
    followUpDate: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
communityWatchSchema.index({ 'location.coordinates': '2dsphere' });
communityWatchSchema.index({ type: 1, status: 1 });
communityWatchSchema.index({ severity: 1, status: 1 });
communityWatchSchema.index({ reporter: 1, createdAt: -1 });
communityWatchSchema.index({ assignedOfficer: 1, status: 1 });
communityWatchSchema.index({ tags: 1 });
communityWatchSchema.index({ text: 'text' });

// Virtual for community engagement
communityWatchSchema.virtual('engagement').get(function() {
  const upvotes = this.communityResponse.upvotes.length;
  const comments = this.communityResponse.comments.length;
  const shares = this.communityResponse.shares.length;
  return upvotes + (comments * 2) + (shares * 3);
});

// Virtual for age in hours
communityWatchSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// Method to add update
communityWatchSchema.methods.addUpdate = function(status, description, updatedBy, isOfficial = false, images = []) {
  this.updates.push({
    status,
    description,
    updatedBy,
    isOfficial,
    images
  });
  this.status = status;
  return this.save();
};

// Method to add comment
communityWatchSchema.methods.addComment = function(userId, text, isOfficial = false) {
  this.communityResponse.comments.push({
    user: userId,
    text,
    isOfficial
  });
  return this.save();
};

// Method to upvote
communityWatchSchema.methods.upvote = function(userId) {
  const existingVote = this.communityResponse.upvotes.find(vote => vote.user.equals(userId));
  if (!existingVote) {
    this.communityResponse.upvotes.push({ user: userId });
  }
  return this.save();
};

// Method to assign officer
communityWatchSchema.methods.assignOfficer = function(officerId, assignedBy) {
  this.assignedOfficer = officerId;
  this.assignedAt = new Date();
  this.addUpdate('assigned', `Assigned to officer`, assignedBy, true);
  return this.save();
};

// Method to verify report
communityWatchSchema.methods.verify = function(verifiedBy) {
  this.isVerified = true;
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.addUpdate('verified', 'Report verified', verifiedBy, true);
  return this.save();
};

// Method to resolve
communityWatchSchema.methods.resolve = function(description, resolvedBy, actions = []) {
  this.status = 'resolved';
  this.resolution = {
    description,
    resolvedBy,
    resolvedAt: new Date(),
    actions
  };
  this.addUpdate('resolved', 'Issue resolved', resolvedBy, true);
  return this.save();
};

// Static method to find nearby reports
communityWatchSchema.statics.findNearby = function(latitude, longitude, radius = 1000, limit = 10) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius
      }
    },
    isActive: true
  }).limit(limit);
};

module.exports = mongoose.model('CommunityWatch', communityWatchSchema);
