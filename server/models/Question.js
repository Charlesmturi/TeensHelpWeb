const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'addiction', 'mental-health', 'relationships', 'school', 'family']
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'rejected'],
    default: 'pending'
  },
  answer: {
    type: String,
    default: ''
  },
  answeredAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);