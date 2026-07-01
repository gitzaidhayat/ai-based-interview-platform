import React from 'react';
import './Stats.css';

const Stats = ({ user, interviews }) => {
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  
  const calculateAverageScore = () => {
    if (completedInterviews.length === 0) return 0;
    const totalScore = completedInterviews.reduce((sum, interview) => sum + (interview.overallScore || 0), 0);
    return Math.round(totalScore / completedInterviews.length);
  };

  const calculateTotalPracticeTime = () => {
    const totalMinutes = completedInterviews.reduce((sum, interview) => sum + (interview.duration || 0), 0);
    const hours = Math.floor(totalMinutes / 3600);
    const minutes = Math.floor((totalMinutes % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const averageScore = calculateAverageScore();
  const totalPracticeTime = calculateTotalPracticeTime();

  return (
    <div className="stats-container">
      <h2>Your Progress</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Interviews</h3>
            <p className="stat-number">{completedInterviews.length}</p>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Average Score</h3>
            <p 
              className="stat-number" 
              style={{ color: getScoreColor(averageScore) }}
            >
              {averageScore}%
            </p>
            <span className="stat-label">Performance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Practice Time</h3>
            <p className="stat-number">{totalPracticeTime}</p>
            <span className="stat-label">Total Duration</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p className="stat-number">
              {completedInterviews.length > 0 
                ? Math.round((completedInterviews.filter(i => (i.overallScore || 0) >= 70).length / completedInterviews.length) * 100)
                : 0
              }%
            </p>
            <span className="stat-label">70%+ scores</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <h3>Weekly Goal Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(100, (completedInterviews.length % 7) * 14.3)}%` 
            }}
          ></div>
        </div>
        <p className="progress-text">
          {completedInterviews.length % 7}/7 interviews this week
        </p>
      </div>

      {/* Recent Performance Trend */}
      {completedInterviews.length > 0 && (
        <div className="trend-section">
          <h3>Recent Performance</h3>
          <div className="trend-chart">
            {completedInterviews.slice(-5).reverse().map((interview, index) => (
              <div key={interview._id} className="trend-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${interview.overallScore || 0}%`,
                    backgroundColor: getScoreColor(interview.overallScore || 0)
                  }}
                ></div>
                <span className="bar-label">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
