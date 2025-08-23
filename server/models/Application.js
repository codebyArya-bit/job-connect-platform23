const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant reference is required']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    trim: true
  },
  resume: {
    filename: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: [
      'submitted',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'interview_completed',
      'offer_extended',
      'hired',
      'rejected',
      'withdrawn'
    ],
    default: 'submitted',
    required: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'submitted',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'interview_completed',
        'offer_extended',
        'hired',
        'rejected',
        'withdrawn'
      ],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      maxlength: [500, 'Status notes cannot exceed 500 characters'],
      trim: true
    }
  }],
  interview: {
    scheduledAt: {
      type: Date
    },
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'panel'],
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    meetingLink: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      maxlength: [1000, 'Interview notes cannot exceed 1000 characters'],
      trim: true
    },
    feedback: {
      type: String,
      maxlength: [2000, 'Interview feedback cannot exceed 2000 characters'],
      trim: true
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  },
  offer: {
    salary: {
      amount: {
        type: Number,
        min: [0, 'Salary amount cannot be negative']
      },
      currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
      },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly'
      }
    },
    startDate: {
      type: Date
    },
    benefits: [{
      type: String,
      trim: true,
      maxlength: [100, 'Benefit description cannot exceed 100 characters']
    }],
    terms: {
      type: String,
      maxlength: [1000, 'Offer terms cannot exceed 1000 characters'],
      trim: true
    },
    expiresAt: {
      type: Date
    },
    acceptedAt: {
      type: Date
    },
    rejectedAt: {
      type: Date
    }
  },
  recruiterNotes: {
    type: String,
    maxlength: [1000, 'Recruiter notes cannot exceed 1000 characters'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['direct', 'referral', 'job_board', 'social_media', 'company_website'],
    default: 'direct'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Other indexes for better query performance
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ job: 1, status: 1 });

// Virtual for application age
applicationSchema.virtual('applicationAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for current status info
applicationSchema.virtual('currentStatusInfo').get(function() {
  const statusLabels = {
    'submitted': 'Application Submitted',
    'under_review': 'Under Review',
    'shortlisted': 'Shortlisted',
    'interview_scheduled': 'Interview Scheduled',
    'interview_completed': 'Interview Completed',
    'offer_extended': 'Offer Extended',
    'hired': 'Hired',
    'rejected': 'Rejected',
    'withdrawn': 'Withdrawn'
  };
  
  return {
    status: this.status,
    label: statusLabels[this.status] || this.status,
    isActive: ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'offer_extended'].includes(this.status)
  };
});

// Pre-save middleware to add status to history
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  } else if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
  next();
});

// Ensure virtual fields are serialized
applicationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Application', applicationSchema);