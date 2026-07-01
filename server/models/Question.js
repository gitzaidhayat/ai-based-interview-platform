const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['behavioral', 'technical', 'situational', 'hr']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  role: {
    type: String,
    required: true // e.g., 'Software Engineer', 'Product Manager'
  },
  company: {
    type: String // e.g., 'Google', 'Amazon', 'Generic'
  },
  suggestedAnswer: {
    type: String // Model answer for reference
  },
  keywords: [String], // Important keywords to look for
  timeLimit: {
    type: Number,
    default: 120 // seconds
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);