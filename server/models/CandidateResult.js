const mongoose = require('mongoose');

const candidateResultSchema = new mongoose.Schema({
  interviewId: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  scores: {
    cs: { // Communication Skills
      type: Number,
      min: 0,
      max: 100
    },
    lds: { // Logical & Domain Skills
      type: Number,
      min: 0,
      max: 100
    },
    rfs: { // Response Fluency & Structure
      type: Number,
      min: 0,
      max: 100
    },
    ci: { // Confidence & Impact
      type: Number,
      min: 0,
      max: 100
    }
  },
  finalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  responses: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CandidateResult', candidateResultSchema);
