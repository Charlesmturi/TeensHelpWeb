const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    trim: true,
    maxlength: [5000, 'Answer cannot exceed 5000 characters']
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isExpertAnswer: {
    type: Boolean,
    default: false
  },
  isBestAnswer: {
    type: Boolean,
    default: false
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  helpfulVotes: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'flagged', 'removed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question content is required'],
    trim: true,
    maxlength: [5000, 'Question cannot exceed 5000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['general-questions', 'addiction', 'mental-health', 'relationships', 'school-issues', 'family-issues', 'peer-pressure', 'self-esteem', 'bullying', 'drugs', 'stress', 'depression', 'anxiety', 'porn', 'masturbation'],
    default: 'general-questions'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'answered'],
    default: 'pending'
  },
  answers: [answerSchema], // Array of answers
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
    status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'answered'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },

}, {
  timestamps: true
});



// Indexes
questionSchema.index({ category: 1, status: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ status: 1 });

module.exports = mongoose.model('Question', questionSchema);