import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { buildRecruiterShareLink } from '../../utils/recruiterInterviewLinks.js';

const RecruiterCreateInterview = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    jobRole: '',
    topics: [],
    difficulty: 'Medium',
    questionCount: 5,
    timeLimit: 30
  });
  const [loading, setLoading] = useState(false);
  const [interviewCreated, setInterviewCreated] = useState(null);

  const topics = ['DSA', 'DBMS', 'OS', 'HR'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicToggle = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.topics.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.SERVER_URL}/api/recruiter/create-interview`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterviewCreated({
        ...response.data,
        shareableLink: buildRecruiterShareLink(response.data)
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const createNewInterview = () => {
    setInterviewCreated(null);
    setFormData({
      jobRole: '',
      topics: [],
      difficulty: 'Medium',
      questionCount: 5,
      timeLimit: 30
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (interviewCreated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Created Successfully!</h2>
              <p className="text-gray-600">Share this link with candidates to start collecting responses</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={interviewCreated.shareableLink}
                  readOnly
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
                <button
                  onClick={() => copyToClipboard(interviewCreated.shareableLink)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Interview ID</p>
                <p className="font-semibold text-black">{interviewCreated.interviewId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Job Role</p>
                <p className="font-semibold text-black">{formData.jobRole}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/recruiter/dashboard')}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={createNewInterview}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create New Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Create New Interview</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Job Role *
              </label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                required
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Frontend Developer, Data Analyst"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Topics *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {topics.map(topic => (
                  <label
                    key={topic}
                    className={`text-black flex items-center px-3 py-2 border rounded-md cursor-pointer transition-colors ${
                      formData.topics.includes(topic)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.topics.includes(topic)}
                      onChange={() => handleTopicToggle(topic)}
                      className="sr-only"
                    />
                    {topic}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  name="questionCount"
                  value={formData.questionCount}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes) *
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min="5"
                  max="120"
                  required
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/recruiter/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Interview'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCreateInterview;
