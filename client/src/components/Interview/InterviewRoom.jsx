import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import SpeechRecognition from './SpeechRecognition.jsx';
import QuestionCard from './QuestionCard.jsx';
import VideoRecorder from './VideoRecorder.jsx';
import './InterviewRoom.css';
import { SERVER_URL } from '../../utils/apiConfig.js';

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [answerStartTime, setAnswerStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadInterview();
    }
  }, [id]);

  const loadInterview = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/interview/${id}`);
      setInterview(res.data);
      setQuestionStartTime(Date.now());
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to load interview');
      navigate('/dashboard');
    }
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

      const currentQuestion = interview.questions[currentQuestionIndex];

      await axios.post(`${SERVER_URL}/api/interview/${id}/response`, {
        questionId: currentQuestion.question._id,
        transcript,
        thinkingTime,
        responseTime
      });

      // Move to next question
      if (currentQuestionIndex < interview.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTranscript('');
        setQuestionStartTime(Date.now());
        setAnswerStartTime(null);
      } else {
        // Complete interview
        await axios.post(`${SERVER_URL}/api/interview/${id}/complete`);
        navigate(`/results/${id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading interview...</div>;
  }

  if (!interview) {
    return <div className="error">Interview not found</div>;
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className="interview-room">
      <div className="interview-header">
        <h2>{interview.role} Interview - {interview.company}</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Question {currentQuestionIndex + 1} of {interview.questions.length}
        </p>
      </div>

      <div className="interview-content">
        <div className="video-section">
          <VideoRecorder />
        </div>

        <div className="question-section">
          <QuestionCard 
            question={currentQuestion.question}
            questionNumber={currentQuestionIndex + 1}
          />

          <SpeechRecognition
            isRecording={isRecording}
            onTranscriptChange={setTranscript}
            transcript={transcript}
          />

          <div className="controls">
            {!isRecording ? (
              <button 
                onClick={startAnswering} 
                className="btn-start"
                disabled={submitting}
              >
                🎤 Start Answering
              </button>
            ) : (
              <button 
                onClick={stopAnswering} 
                className="btn-stop"
                disabled={submitting}
              >
                ⏹️ {submitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            )}
          </div>

          {transcript && (
            <div className="transcript-preview">
              <h4>Your Answer:</h4>
              <p>{transcript}</p>
              <p className="word-count text-black">Words: {transcript.trim().split(/\s+/).length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;