const mongoose = require('mongoose');

const recruiterInterviewSchema = new mongoose.Schema({
  interviewId: {
    type: String,
    required: true,
    unique: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  topics: [{
    type: String,
    enum: ['DSA', 'DBMS', 'OS', 'HR']
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  questionCount: {
    type: Number,
    required: true
  },
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  shareableLink: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecruiterInterview', recruiterInterviewSchema);
