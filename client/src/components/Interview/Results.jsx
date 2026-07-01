import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Results.css';
import { SERVER_URL } from '../../utils/apiConfig.js';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      setLoading(true);
      
      // Fetch interview details
      const interviewRes = await axios.get(`${SERVER_URL}/api/interview/${id}`);
      setInterview(interviewRes.data);

      // Fetch responses
      const responsesRes = await axios.get(`${SERVER_URL}/api/interview/${id}/responses`);
      setResponses(responsesRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Error loading results:', err);
      setError('Failed to load interview results');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="results-loading">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="results-error">
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="results-error">
        <p>Interview not found</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const overallScore = interview.overallScore || 0;

  return (
    <div className="results-container">
      <div className="results-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Interview Results</h1>
        <div className="interview-info">
          <p><strong>Role:</strong> {interview.role}</p>
          <p><strong>Company:</strong> {interview.company}</p>
          <p><strong>Duration:</strong> {formatDuration(interview.duration || 0)}</p>
          <p><strong>Completed:</strong> {new Date(interview.completedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="overall-score-card">
        <div className="score-circle" style={{ borderColor: getScoreColor(overallScore) }}>
          <div className="score-value" style={{ color: getScoreColor(overallScore) }}>
            {overallScore}
          </div>
          <div className="score-label">{getScoreLabel(overallScore)}</div>
        </div>
        <div className="score-details">
          <h2>Overall Performance</h2>
          <p>You answered {responses.length} questions</p>
        </div>
      </div>

      <div className="responses-section">
        <h2>Question-by-Question Analysis</h2>
        {responses.map((response, index) => (
          <div key={response._id} className="response-card">
            <div className="question-header">
              <h3>Question {index + 1}</h3>
              <div className="question-score" style={{ backgroundColor: getScoreColor(response.scores.overall) }}>
                {response.scores.overall}
              </div>
            </div>
            
            <div className="question-text">
              <strong>Q:</strong> {response.question.text}
            </div>

            <div className="answer-text">
              <strong>Your Answer:</strong>
              <p>{response.transcript}</p>
            </div>

            <div className="response-metrics">
              <div className="metric">
                <span className="metric-label">Word Count:</span>
                <span className="metric-value">{response.wordCount}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Thinking Time:</span>
                <span className="metric-value">{response.thinkingTime}s</span>
              </div>
              <div className="metric">
                <span className="metric-label">Response Time:</span>
                <span className="metric-value">{response.responseTime}s</span>
              </div>
            </div>

            <div className="score-breakdown">
              <div className="score-item">
                <span className="score-name">Relevance</span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${response.scores.relevance}%`,
                      backgroundColor: getScoreColor(response.scores.relevance) 
                    }}
                  ></div>
                </div>
                <span className="score-percent">{response.scores.relevance}%</span>
              </div>

              <div className="score-item">
                <span className="score-name">Completeness</span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${response.scores.completeness}%`,
                      backgroundColor: getScoreColor(response.scores.completeness) 
                    }}
                  ></div>
                </div>
                <span className="score-percent">{response.scores.completeness}%</span>
              </div>

              <div className="score-item">
                <span className="score-name">Clarity</span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${response.scores.clarity}%`,
                      backgroundColor: getScoreColor(response.scores.clarity) 
                    }}
                  ></div>
                </div>
                <span className="score-percent">{response.scores.clarity}%</span>
              </div>

              <div className="score-item">
                <span className="score-name">Confidence</span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${response.scores.confidence}%`,
                      backgroundColor: getScoreColor(response.scores.confidence) 
                    }}
                  ></div>
                </div>
                <span className="score-percent">{response.scores.confidence}%</span>
              </div>
            </div>

            {response.strengths && response.strengths.length > 0 && (
              <div className="feedback-section strengths">
                <h4>✓ Strengths</h4>
                <ul>
                  {response.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.improvements && response.improvements.length > 0 && (
              <div className="feedback-section improvements">
                <h4>→ Areas for Improvement</h4>
                <ul>
                  {response.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.keywordsCovered && response.keywordsCovered.length > 0 && (
              <div className="keywords">
                <strong>Keywords Covered:</strong>{' '}
                {response.keywordsCovered.join(', ')}
              </div>
            )}

            {response.keywordsMissed && response.keywordsMissed.length > 0 && (
              <div className="keywords-missed">
                <strong>Keywords Missed:</strong>{' '}
                {response.keywordsMissed.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
        <button className="btn-secondary" onClick={() => navigate('/interview/start')}>
          Start New Interview
        </button>
      </div>
    </div>
  );
};

export default Results;
