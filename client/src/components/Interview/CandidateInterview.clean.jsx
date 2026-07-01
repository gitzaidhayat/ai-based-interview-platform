import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import SpeechRecognition from './SpeechRecognition.jsx';
import QuestionCard from './QuestionCard.jsx';
import VideoRecorder from './VideoRecorder.jsx';

// Get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

const CandidateInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Check if user is logged in
  const isLoggedIn = !!user;
  
  const [step, setStep] = useState('form'); // 'form', 'instructions', 'interview', 'results'
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState({ 
    name: isLoggedIn ? user?.name || '' : '', 
    email: isLoggedIn ? user?.email || '' : '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  
  // Enhanced interview states
  const [transcript, setTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [answerStartTime, setAnswerStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInterviewDetails();
  }, [id]); // Only re-run when id changes

  // If user is logged in and interview details are loaded, skip form and go to instructions
  useEffect(() => {
    if (isLoggedIn && interviewDetails && step === 'form') {
      setStep('instructions');
    }
  }, [isLoggedIn, interviewDetails, step]);

  useEffect(() => {
    if (timer && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0 && timer) {
      handleSubmitInterview();
    }
  }, [timer, timeLeft]);

  const fetchInterviewDetails = async () => {
    try {
      if (!id) {
        setError('Invalid interview link');
        return;
      }
      
      // Try student interview API first (for practice interviews)
      let response;
      try {
        response = await axios.get(`${process.env.SERVER_URL}/api/interview/${id}`,
          getAuthHeaders()
        );
      } catch (studentError) {
        // If student interview not found, try recruiter interview API
        try {
          response = await axios.get(
            `${process.env.SERVER_URL}/api/recruiter/interview/${id}`,
            getAuthHeaders()
          );
        } catch (recruiterError) {
          throw new Error('Interview not found or inactive');
        }
      }
      
      setInterviewDetails(response.data);
      setTimeLeft(response.data.timeLimit * 60); // Convert to seconds
    } catch (error) {
      setError('Interview not found or inactive');
    }
  };

  const handleStartInterview = () => {
    setStep('interview');
    setCurrentQuestion(0);
    setResponses([]);
    setTranscript('');
    setQuestionStartTime(Date.now());
    setAnswerStartTime(null);
    setTimeLeft(interviewDetails.timeLimit * 60);
    setTimer(true);
  };

  const startAnswering = () => {
    setIsRecording(true);
    setAnswerStartTime(Date.now());
  };

  const stopAnswering = async () => {
    setIsRecording(false);
    
    if (!transcript.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const thinkingTime = Math.floor((answerStartTime - questionStartTime) / 1000);
      const responseTime = Math.floor((Date.now() - answerStartTime) / 1000);

      // Save response
      const currentQuestionData = interviewDetails.questions?.[currentQuestion] || {
        text: `Question ${currentQuestion + 1}`,
        difficulty: 'medium',
        category: 'general'
      };
      
      const newResponse = {
        question: currentQuestionData,
        transcript,
        thinkingTime,
        responseTime,
        timestamp: new Date().toISOString()
      };

      setResponses([...responses, newResponse]);

      // Move to next question or complete interview
      const totalQuestions = interviewDetails.questions?.length || 10;
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTranscript('');
        setQuestionStartTime(Date.now());
        setAnswerStartTime(null);
      } else {
        // Complete interview
        handleSubmitInterview();
      }
    } catch (err) {
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBeginInterview = () => {
    setStep('interview');
    setTimer(true);
    generateQuestions();
  };

  const generateQuestions = () => {
    // Mock questions based on topics and difficulty
    const questions = [
      "Tell me about yourself and your experience.",
      "Why are you interested in this role?",
      "Describe a challenging project you've worked on.",
      "How do you handle tight deadlines?",
      "What are your strengths and weaknesses?"
    ];
    
    setResponses(questions.map(q => ({
      question: q,
      answer: '',
      timestamp: new Date()
    })));
  };

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index].answer = value;
    setResponses(newResponses);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < responses.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmitInterview();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitInterview = async () => {
    setLoading(true);
    try {
      // Mock scoring - in real implementation, this would use AI analysis
      const scores = {
        cs: Math.floor(Math.random() * 30) + 70, // Communication Skills
        lds: Math.floor(Math.random() * 30) + 70, // Logical & Domain Skills  
        rfs: Math.floor(Math.random() * 30) + 70, // Response Fluency & Structure
        ci: Math.floor(Math.random() * 30) + 70  // Confidence & Impact
      };
      
      const finalScore = Math.round((scores.cs + scores.lds + scores.rfs + scores.ci) / 4);

      const resultData = {
        interviewId: id,
        candidateName: candidateInfo.name,
        email: candidateInfo.email,
        scores,
        finalScore,
        responses: responses.map(r => ({
          question: r.question,
          answer: r.answer,
          feedback: "Good response with clear communication",
          score: Math.floor(Math.random() * 30) + 70
        }))
      };

      // Try student interview submission first, then recruiter submission
      try {
        await axios.post(
          `http://localhost:5000/api/interview/${id}/submit`,
          resultData,
          getAuthHeaders()
        );
      } catch (studentSubmitError) {
        await axios.post(
          'http://localhost:5000/api/recruiter/submit-result',
          resultData,
          getAuthHeaders()
        );
      }

      setFinalResult({
        ...resultData,
        completedAt: new Date()
      });
      setStep('results');
    } catch (error) {
      setError('Failed to submit interview');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Interview Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!interviewDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading interview details...</div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Interview</h2>
            <p className="text-gray-600 mb-6">
              Position: {interviewDetails.jobRole || 'General Position'}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Interview Details</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• {interviewDetails.questionCount || 10} questions</p>
                <p>• Time limit: {interviewDetails.timeLimit || 30} minutes</p>
                <p>• Difficulty: {interviewDetails.difficulty || 'Medium'}</p>
                <p>• Topics: {interviewDetails.topics ? interviewDetails.topics.join(', ') : 'General'}</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleStartInterview(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Interview
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isLoggedIn ? `Welcome back, ${user?.name}!` : 'Interview Instructions'}
            </h2>
            {isLoggedIn && (
              <p className="text-gray-600 mb-6">
                Ready to practice your {interviewDetails?.jobRole || 'interview'} skills? Let's begin!
              </p>
            )}
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p className="text-gray-700">Answer each question to the best of your ability</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p className="text-gray-700">Take your time but be mindful of the time limit</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p className="text-gray-700">Be clear and concise in your responses</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <p className="text-gray-700">Your responses will be analyzed for communication, technical skills, and confidence</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-semibold text-yellow-800">Time Limit</span>
              </div>
              <p className="text-yellow-700 text-sm">
                You have {interviewDetails.timeLimit || 30} minutes to complete all {interviewDetails.questionCount || 10} questions.
              </p>
            </div>

            <button
              onClick={handleBeginInterview}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Begin Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'interview') {
    const progress = ((currentQuestion + 1) / (interviewDetails.questions?.length || 10)) * 100;
    const currentQuestionData = interviewDetails.questions?.[currentQuestion] || {
      text: "Tell me about yourself and your experience.",
      difficulty: "medium",
      category: "behavioral"
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {interviewDetails.jobRole || 'Interview'} Interview
                </h2>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {interviewDetails.questions?.length || 10}
                </p>
              </div>
              <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Feed</h3>
              <VideoRecorder />
            </div>

            {/* Question Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <QuestionCard 
                question={currentQuestionData}
                questionNumber={currentQuestion + 1}
              />

              <SpeechRecognition
                isRecording={isRecording}
                onTranscriptChange={setTranscript}
                transcript={transcript}
              />

              <div className="controls mt-6">
                {!isRecording ? (
                  <button 
                    onClick={startAnswering} 
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                    disabled={submitting}
                  >
                    🎤 Start Answering
                  </button>
                ) : (
                  <button 
                    onClick={stopAnswering} 
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                    disabled={submitting}
                  >
                    ⏹️ {submitting ? 'Submitting...' : 'Submit Answer'}
                  </button>
                )}
              </div>

              {transcript && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Your Answer:</h4>
                  <p className="text-gray-700">{transcript}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Words: {transcript.trim().split(/\s+/).length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && finalResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed!</h2>
              <p className="text-gray-600">Thank you for your time, {finalResult.candidateName}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Results</h3>
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold ${getScoreColor(finalResult.finalScore)}`}>
                  {finalResult.finalScore}/100
                </div>
                <p className="text-gray-600 mt-1">Overall Score</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(finalResult.scores.cs)}`}>
                    {finalResult.scores.cs}/100
                  </div>
                  <p className="text-sm text-gray-600">Communication</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(finalResult.scores.lds)}`}>
                    {finalResult.scores.lds}/100
                  </div>
                  <p className="text-sm text-gray-600">Technical</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(finalResult.scores.rfs)}`}>
                    {finalResult.scores.rfs}/100
                  </div>
                  <p className="text-sm text-gray-600">Fluency</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(finalResult.scores.ci)}`}>
                    {finalResult.scores.ci}/100
                  </div>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CandidateInterview;
