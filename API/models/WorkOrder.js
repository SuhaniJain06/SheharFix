const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Work order title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Work order description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  civicIssue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CivicIssue',
    required: true
  },
  assignedTo: {
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    department: String,
    team: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String
    }]
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true,
    enum: [
      'repair',
      'maintenance',
      'construction',
      'installation',
      'cleaning',
      'inspection',
      'emergency_response',
      'other'
    ]
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
  budget: {
    estimated: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    approved: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvedAt: Date
    },
    actual: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    }
  },
  timeline: {
    estimated: {
      startDate: Date,
      endDate: Date,
      duration: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'weeks', 'months'],
          default: 'days'
        }
      }
    },
    actual: {
      startDate: Date,
      endDate: Date,
      duration: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'weeks', 'months']
        }
      }
    }
  },
  requirements: {
    materials: [{
      name: String,
      quantity: Number,
      unit: String,
      estimatedCost: Number,
      supplier: String,
      status: {
        type: String,
        enum: ['required', 'ordered', 'delivered', 'used'],
        default: 'required'
      }
    }],
    equipment: [{
      name: String,
      type: String,
      quantity: Number,
      source: String,
      status: {
        type: String,
        enum: ['required', 'arranged', 'in_use', 'returned'],
        default: 'required'
      }
    }],
    manpower: [{
      role: String,
      count: Number,
      skills: [String],
      duration: Number
    }]
  },
  progress: [{
    date: { type: Date, default: Date.now },
    status: String,
    description: String,
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    images: [String],
    notes: String
  }],
  qualityChecks: [{
    checkType: String,
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['passed', 'failed', 'pending']
    },
    notes: String,
    images: [String]
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now }
  }],
  completion: {
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    finalReport: String,
    beforeImages: [String],
    afterImages: [String],
    qualityRating: {
      type: Number,
      min: 1,
      max: 5
    },
    clientSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  issues: [{
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved'],
      default: 'open'
    },
    resolution: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
workOrderSchema.index({ civicIssue: 1, status: 1 });
workOrderSchema.index({ 'assignedTo.contractor': 1, status: 1 });
workOrderSchema.index({ 'assignedBy': 1 });
workOrderSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for progress percentage
workOrderSchema.virtual('currentProgress').get(function() {
  if (this.progress.length === 0) return 0;
  return this.progress[this.progress.length - 1].completionPercentage || 0;
});

// Method to add progress update
workOrderSchema.methods.addProgress = function(status, description, completionPercentage, updatedBy, images = [], notes = '') {
  this.progress.push({
    status,
    description,
    completionPercentage,
    updatedBy,
    images,
    notes
  });
  this.status = status;
  return this.save();
};

// Method to add quality check
workOrderSchema.methods.addQualityCheck = function(checkType, description, performedBy, status, notes = '', images = []) {
  this.qualityChecks.push({
    checkType,
    description,
    performedBy,
    status,
    notes,
    images
  });
  return this.save();
};

// Method to add issue
workOrderSchema.methods.addIssue = function(description, severity, reportedBy) {
  this.issues.push({
    description,
    severity,
    reportedBy
  });
  return this.save();
};

// Method to complete work order
workOrderSchema.methods.complete = function(completedBy, finalReport, beforeImages = [], afterImages = [], qualityRating, clientSatisfaction) {
  this.status = 'completed';
  this.completion = {
    completedAt: new Date(),
    completedBy,
    finalReport,
    beforeImages,
    afterImages,
    qualityRating,
    clientSatisfaction
  };
  this.timeline.actual.endDate = new Date();
  return this.save();
};

module.exports = mongoose.model('WorkOrder', workOrderSchema);
