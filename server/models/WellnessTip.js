// models/WellnessTip.js
const mongoose = require('mongoose');

const wellnessTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['mental-health', 'addiction', 'relationships', 'physical-health', 'general']
  },
  duration: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  // NEW: Add likes functionality
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better query performance
wellnessTipSchema.index({ status: 1, category: 1 });
wellnessTipSchema.index({ submittedBy: 1 });
wellnessTipSchema.index({ tags: 1 }); // NEW: Index for tags

module.exports = mongoose.model('WellnessTip', wellnessTipSchema);