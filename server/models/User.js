const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['teen', 'admin', 'parent', 'counselor', 'therapist', 'schoolAdmin', 'other'],
    default: 'teen'
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'moderator', 'expert'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [19, 'Maximum age is 19']
    },
    location: {
      type: String,
      default: ''
    }
  },

  // ✅ Expert Application
  expertApplication: {
    status: {
      type: String,
      enum: ['not-applied', 'pending', 'approved', 'rejected'],
      default: 'not-applied'
    },
    appliedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  },

  // ✅ Expert Profile
  expertProfile: {
    qualifications: [{
      type: String,
      trim: true
    }],
    specialization: {
      type: String,
      trim: true
    },
    yearsOfExperience: {
      type: Number,
      min: 0
    },
    licenseNumber: {
      type: String,
      trim: true
    },
    organization: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 1000
    },
    hourlyRate: {
      type: Number,
      min: 0
    },
    availableForConsultation: {
      type: Boolean,
      default: false
    }
  },

  // ✅ Stats
  stats: {
    answersCount: {
      type: Number,
      default: 0
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    bestAnswers: {
      type: Number,
      default: 0
    }
  },

  online: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ online: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
