const RecruiterInterview = require('../models/RecruiterInterview');
const CandidateResult = require('../models/CandidateResult');
const { nanoid } = require('nanoid');

// @route   POST /api/recruiter/create-interview
// @desc    Create a new recruiter interview
exports.createInterview = async (req, res) => {
  try {
    const { jobRole, topics, difficulty, questionCount, timeLimit } = req.body;
    
    // Generate unique interview ID
    const interviewId = nanoid(8);
    const shareableLink = `http://localhost:5174/interview/${interviewId}`;
    
    const interview = new RecruiterInterview({
      interviewId,
      recruiterId: req.user._id,
      jobRole,
      topics,
      difficulty,
      questionCount,
      timeLimit,
      shareableLink
    });
    
    await interview.save();
    
    res.status(201).json({
      interviewId,
      shareableLink,
      message: 'Interview created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/recruiter/interviews
// @desc    Get all interviews created by recruiter
exports.getInterviews = async (req, res) => {
  try {
    const interviews = await RecruiterInterview.find({ 
      recruiterId: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/recruiter/results/:interviewId
// @desc    Get all candidate results for a specific interview
exports.getResults = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Verify interview belongs to recruiter
    const interview = await RecruiterInterview.findOne({
      interviewId,
      recruiterId: req.user._id
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    const results = await CandidateResult.find({ interviewId })
      .sort({ completedAt: -1 });
    
    res.json({
      interview: {
        jobRole: interview.jobRole,
        topics: interview.topics,
        difficulty: interview.difficulty,
        createdAt: interview.createdAt
      },
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/recruiter/submit-result
// @desc    Submit candidate interview result
exports.submitResult = async (req, res) => {
  try {
    const { 
      interviewId, 
      candidateName, 
      email, 
      scores, 
      finalScore, 
      responses 
    } = req.body;
    
    // Verify interview exists and is active
    const interview = await RecruiterInterview.findOne({
      interviewId,
      isActive: true
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found or inactive' });
    }
    
    const result = new CandidateResult({
      interviewId,
      candidateName,
      email,
      scores,
      finalScore,
      responses
    });
    
    await result.save();
    
    res.status(201).json({
      message: 'Result submitted successfully',
      resultId: result._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/recruiter/interview/:interviewId
// @desc    Get interview details for candidate
exports.getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await RecruiterInterview.findOne({
      interviewId,
      isActive: true
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found or inactive' });
    }
    
    res.json({
      jobRole: interview.jobRole,
      topics: interview.topics,
      difficulty: interview.difficulty,
      questionCount: interview.questionCount,
      timeLimit: interview.timeLimit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/recruiter/delete-interview/:interviewId
// @desc    Delete an interview and its results
exports.deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Verify interview belongs to recruiter
    const interview = await RecruiterInterview.findOne({
      interviewId,
      recruiterId: req.user._id
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Delete the interview
    await RecruiterInterview.deleteOne({ interviewId });
    
    // Optionally delete all results for this interview
    await CandidateResult.deleteMany({ interviewId });
    
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
