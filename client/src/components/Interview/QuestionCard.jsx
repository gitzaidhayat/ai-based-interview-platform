import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, questionNumber }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical':
        return '💻';
      case 'behavioral':
        return '🤝';
      case 'situational':
        return '🎯';
      case 'hr':
        return '👥';
      default:
        return '❓';
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-number">
          <span className="number-badge text-black ">Q{questionNumber}</span>
        </div>
        <div className="question-meta">
          <span 
            className="difficulty-badge text-black"
            style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
          >
            {question.difficulty}
          </span>
          <span className="category-badge text-black">
            {getCategoryIcon(question.category)} {question.category}
          </span>
        </div>
      </div>
      
      <div className="question-content text-black">
        <h3 className="question-text">{question.text}</h3>
        
        {question.timeLimit && (
          <div className="time-limit">
            <span className="time-icon">⏱️</span>
            <span className="time-text">Suggested time: {question.timeLimit} min</span>
          </div>
        )}
        
        {question.keywords && question.keywords.length > 0 && (
          <div className="keywords">
            <span className="keywords-label">Keywords to consider:</span>
            <div className="keywords-list">
              {question.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="question-footer">
        {question.company && (
          <span className="company-tag text-black ">🏢 {question.company}</span>
        )}
        {question.role && (
          <span className="role-tag text-black ">💼 {question.role}</span>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
