const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recruiterController = require('../controllers/recruiterController');

// Recruiter routes
router.post('/create-interview', auth, recruiterController.createInterview);
router.get('/interviews', auth, recruiterController.getInterviews);
router.get('/results/:interviewId', auth, recruiterController.getResults);
router.post('/submit-result', recruiterController.submitResult);
router.get('/interview/:interviewId', recruiterController.getInterviewDetails);
router.delete('/delete-interview/:interviewId', auth, recruiterController.deleteInterview);

module.exports = router;
