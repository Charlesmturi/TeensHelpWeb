// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'counselor', 'therapist', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: String,
    lastName: String,
    age: Number,
    bio: String,
    avatar: String
  },
  // NEW: Add savedTips and completedTips functionality
  savedTips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WellnessTip'
  }],
  completedTips: [{
    tipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WellnessTip'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);