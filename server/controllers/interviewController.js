const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Response = require('../models/Response');
const User = require('../models/User');

// @route   POST /api/interview/start
// @desc    Start a new interview
const startInterview = async (req, res) => {
  try {
    const { role, company, type, timeLimit = 30 } = req.body;
    const userId = req.user._id;

    console.log('Starting interview for role:', role);

    // Get random questions based on role
    const questions = await Question.find({ role })
      .limit(5)
      .sort({ difficulty: 1 }); // Start with easier questions

    console.log(`Found ${questions.length} questions for role: ${role}`);

    if (questions.length === 0) {
      return res.status(404).json({ 
        message: 'No questions found for this role. Please run the seed script to populate questions.',
        hint: 'Run: cd server && node seedQuestions.js'
      });
    }

    // Create new interview
    const interview = new Interview({
      user: userId,
      role,
      company: company || 'Generic',
      type: type || 'practice',
      timeLimit: timeLimit || 30,
      questions: questions.map(q => ({
        question: q._id,
        askedAt: new Date()
      })),
      startedAt: new Date()
    });

    await interview.save();

    // Populate question details
    await interview.populate('questions.question');

    res.json({
      _id: interview._id,
      role: interview.role,
      company: interview.company,
      type: interview.type,
      timeLimit: interview.timeLimit,
      questions: interview.questions,
      startedAt: interview.startedAt,
      status: interview.status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/interview/:id/response
// @desc    Submit answer to a question and get next adaptive question
const submitResponse = async (req, res) => {
  try {
    const { transcript, thinkingTime, responseTime, questionId } = req.body;
    const interviewId = req.params.id;
    const userId = req.user._id;

    // Find interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Analyze response (simple text analysis)
    const analysis = analyzeResponse(transcript, question);

    // Create response
    const response = new Response({
      interview: interviewId,
      question: questionId,
      user: userId,
      transcript,
      thinkingTime,
      responseTime,
      wordCount: analysis.wordCount,
      sentenceCount: analysis.sentenceCount,
      scores: analysis.scores,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      keywordsCovered: analysis.keywordsCovered,
      keywordsMissed: analysis.keywordsMissed
    });

    await response.save();

    // Update interview question status
    const questionIndex = interview.questions.findIndex(
      q => q.question.toString() === questionId
    );
    if (questionIndex !== -1) {
      interview.questions[questionIndex].answeredAt = new Date();
    }
    await interview.save();

    // Determine next question difficulty based on performance
    const overallScore = analysis.scores.overall;
    const nextDifficulty = getAdaptiveDifficulty(overallScore, question.difficulty);

    // Get next adaptive question
    const askedQuestionIds = interview.questions.map(q => q.question.toString());
    const nextQuestion = await Question.findOne({
      role: interview.role,
      difficulty: nextDifficulty,
      _id: { $nin: askedQuestionIds }
    });

    res.json({
      responseId: response._id,
      scores: response.scores,
      feedback: {
        strengths: response.strengths,
        improvements: response.improvements,
        keywordsCovered: response.keywordsCovered,
        keywordsMissed: response.keywordsMissed
      },
      nextQuestion: nextQuestion ? {
        _id: nextQuestion._id,
        text: nextQuestion.text,
        difficulty: nextQuestion.difficulty,
        category: nextQuestion.category
      } : null,
      adaptiveMessage: getAdaptiveMessage(overallScore)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/interview/:id/complete
// @desc    Complete interview and calculate final score
const completeInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user._id;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Get all responses for this interview
    const responses = await Response.find({ interview: interviewId });

    // Calculate overall score
    const totalScore = responses.reduce((sum, r) => sum + r.scores.overall, 0);
    const averageScore = responses.length > 0 ? totalScore / responses.length : 0;

    // Update interview
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.duration = Math.floor((interview.completedAt - interview.startedAt) / 1000);
    interview.overallScore = Math.round(averageScore);
    await interview.save();

    // Update user stats
    const user = await User.findById(userId);
    user.stats.totalInterviews += 1;
    user.stats.totalPracticeTime += interview.duration;
    
    // Recalculate average score
    const allInterviews = await Interview.find({ 
      user: userId, 
      status: 'completed' 
    });
    const avgScore = allInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / allInterviews.length;
    user.stats.averageScore = Math.round(avgScore);
    
    await user.save();

    res.json({
      message: 'Interview completed',
      overallScore: interview.overallScore,
      duration: interview.duration,
      totalQuestions: responses.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/interview/:id
// @desc    Get interview details
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('questions.question')
      .populate('user', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/interview/user/history
// @desc    Get user's interview history
const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const interviews = await Interview.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('questions.question', 'text category');

    res.json(interviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Simple response analysis function
function analyzeResponse(transcript, question) {
  const words = transcript.trim().split(/\s+/);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const wordCount = words.length;
  const sentenceCount = sentences.length;

  // Check for keywords
  const keywords = question.keywords || [];
  const lowerTranscript = transcript.toLowerCase();
  
  const keywordsCovered = keywords.filter(keyword => 
    lowerTranscript.includes(keyword.toLowerCase())
  );
  
  const keywordsMissed = keywords.filter(keyword => 
    !lowerTranscript.includes(keyword.toLowerCase())
  );

  // Calculate scores (0-100)
  let relevanceScore = 50; // Base score
  
  // Bonus for covering keywords
  if (keywords.length > 0) {
    relevanceScore += (keywordsCovered.length / keywords.length) * 30;
  }

  // Check word count (optimal: 100-300 words)
  let completenessScore = 50;
  if (wordCount >= 100 && wordCount <= 300) {
    completenessScore = 90;
  } else if (wordCount < 100) {
    completenessScore = Math.max(30, (wordCount / 100) * 70);
  } else if (wordCount > 300) {
    completenessScore = Math.max(60, 90 - ((wordCount - 300) / 100) * 10);
  }

  // Clarity score based on sentence structure
  const avgWordsPerSentence = wordCount / Math.max(1, sentenceCount);
  let clarityScore = 70;
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
    clarityScore = 85;
  } else if (avgWordsPerSentence < 10 || avgWordsPerSentence > 25) {
    clarityScore = 60;
  }

  // Confidence score (based on filler words, hedging)
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
  const hedgeWords = ['maybe', 'perhaps', 'might', 'possibly', 'i think', 'i guess'];
  
  let fillerCount = 0;
  let hedgeCount = 0;
  
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    fillerCount += (lowerTranscript.match(regex) || []).length;
  });
  
  hedgeWords.forEach(hedge => {
    const regex = new RegExp(`\\b${hedge}\\b`, 'gi');
    hedgeCount += (lowerTranscript.match(regex) || []).length;
  });

  let confidenceScore = 80;
  confidenceScore -= Math.min(30, fillerCount * 5);
  confidenceScore -= Math.min(20, hedgeCount * 3);
  confidenceScore = Math.max(30, confidenceScore);

  // Overall score
  const overallScore = Math.round(
    (relevanceScore * 0.3) + 
    (completenessScore * 0.25) + 
    (clarityScore * 0.25) + 
    (confidenceScore * 0.2)
  );

  // Generate feedback
  const strengths = [];
  const improvements = [];

  if (keywordsCovered.length > keywords.length * 0.7) {
    strengths.push('Covered most key points');
  }
  if (wordCount >= 100 && wordCount <= 300) {
    strengths.push('Good answer length');
  }
  if (confidenceScore >= 70) {
    strengths.push('Confident delivery');
  }
  if (clarityScore >= 75) {
    strengths.push('Clear and well-structured');
  }

  if (keywordsMissed.length > 0) {
    improvements.push(`Consider mentioning: ${keywordsMissed.slice(0, 3).join(', ')}`);
  }
  if (wordCount < 80) {
    improvements.push('Provide more detailed examples');
  }
  if (fillerCount > 5) {
    improvements.push('Reduce filler words (um, uh, like)');
  }
  if (hedgeCount > 3) {
    improvements.push('Be more assertive in your answers');
  }
  if (avgWordsPerSentence > 25) {
    improvements.push('Break down complex sentences for clarity');
  }

  return {
    wordCount,
    sentenceCount,
    scores: {
      relevance: Math.round(relevanceScore),
      completeness: Math.round(completenessScore),
      clarity: Math.round(clarityScore),
      confidence: Math.round(confidenceScore),
      overall: overallScore
    },
    strengths,
    improvements,
    keywordsCovered,
    keywordsMissed
  };
}

// @route   GET /api/interview/:id/responses
// @desc    Get all responses for an interview
const getInterviewResponses = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user._id;

    // Verify interview belongs to user
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get all responses
    const responses = await Response.find({ interview: interviewId })
      .populate('question')
      .sort({ createdAt: 1 });

    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Determine next question difficulty based on score
function getAdaptiveDifficulty(score, currentDifficulty) {
  // Score 0-50: Go to easy
  if (score < 50) {
    return 'easy';
  }
  // Score 50-70: Stay at current or go to medium
  else if (score < 70) {
    return currentDifficulty === 'easy' ? 'medium' : currentDifficulty;
  }
  // Score 70-85: Go to hard if not already
  else if (score < 85) {
    return currentDifficulty === 'hard' ? 'hard' : 'hard';
  }
  // Score 85+: Stay at hard
  else {
    return 'hard';
  }
}

// Generate adaptive encouraging message
function getAdaptiveMessage(score) {
  if (score >= 85) {
    return '🎉 Excellent! This was challenging. Next question will test your depth even more!';
  } else if (score >= 70) {
    return '✅ Good job! You got most of it right. Let\'s move to a harder question!';
  } else if (score >= 50) {
    return '👍 Not bad! You have the basics. Next question will help strengthen your foundation.';
  } else {
    return '💡 No worries! Let\'s try an easier question to build confidence and understanding.';
  }
}

module.exports = {
  startInterview,
  submitResponse,
  completeInterview,
  getInterview,
  getUserInterviews,
  getInterviewResponses
};