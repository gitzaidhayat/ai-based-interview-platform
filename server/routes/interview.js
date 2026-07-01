const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  startInterview,
  submitResponse,
  completeInterview,
  getInterview,
  getUserInterviews,
  getInterviewResponses
} = require('../controllers/interviewController');

router.post('/start', auth, startInterview);
router.post('/:id/response', auth, submitResponse);
router.post('/:id/complete', auth, completeInterview);
router.post('/:id/submit', auth, completeInterview);
router.get('/user/history', auth, getUserInterviews);
router.get('/:id/responses', auth, getInterviewResponses);
router.get('/:id', auth, getInterview);

module.exports = router;