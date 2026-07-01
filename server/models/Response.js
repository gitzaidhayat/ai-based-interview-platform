const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // User's answer
  transcript: {
    type: String,
    required: true
  },
  // Timing metrics
  thinkingTime: Number, // seconds before starting to speak
  responseTime: Number, // total time taken to answer
  
  // Basic text analysis (we'll calculate these)
  wordCount: Number,
  sentenceCount: Number,
  
  // Simple scoring (0-100)
  scores: {
    relevance: Number,      // How relevant to question
    completeness: Number,   // Did they cover key points
    clarity: Number,        // How clear was the answer
    confidence: Number,     // Detected from speech patterns
    overall: Number
  },
  
  // Feedback
  strengths: [String],
  improvements: [String],
  keywordsCovered: [String],
  keywordsMissed: [String],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', responseSchema);