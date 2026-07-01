const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

// @route   GET /api/questions
// @desc    Get all questions (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { role, category, difficulty } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/questions
// @desc    Create new question (admin only for now)
router.post('/', auth, async (req, res) => {
  try {
    const { text, category, difficulty, role, company, suggestedAnswer, keywords, timeLimit } = req.body;

    const question = new Question({
      text,
      category,
      difficulty,
      role,
      company,
      suggestedAnswer,
      keywords,
      timeLimit,
      createdBy: req.user._id
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/questions/roles
// @desc    Get all available roles
router.get('/roles', auth, async (req, res) => {
  try {
    const roles = await Question.distinct('role');
    console.log('Roles found in database:', roles);
    
    // If no roles found, return default roles
    if (roles.length === 0) {
      const defaultRoles = ['Software Engineer', 'Product Manager', 'Frontend Developer', 'Backend Developer', 'Data Scientist'];
      console.log('No roles in database, returning defaults:', defaultRoles);
      return res.json(defaultRoles);
    }
    
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;