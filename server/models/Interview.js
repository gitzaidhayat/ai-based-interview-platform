const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['practice', 'mock', 'assessment'],
    default: 'practice'
  },
  role: {
    type: String,
    required: true
  },
  company: String,
  timeLimit: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    askedAt: Date,
    answeredAt: Date
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  duration: Number, // in seconds
  overallScore: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);