import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import Stats from './Stats.jsx';
import { SERVER_URL } from '../../utils/apiConfig.js';


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({
    role: '',
    company: '',
    type: 'practice',
    difficulty: 'medium',
    timeLimit: 30
  });
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user's interview history
      const interviewsRes = await axios.get(`${SERVER_URL}/api/interview/user/history`);
      setInterviews(interviewsRes.data);

      // Load available roles for interview setup
      const rolesRes = await axios.get(`${SERVER_URL}/api/questions/roles`);
      
      
      // If no roles found, use defaults
      if (rolesRes.data && rolesRes.data.length > 0) {
        setAvailableRoles(rolesRes.data);
      } else {
        console.warn('No roles found in database, using defaults');
        setAvailableRoles(['Software Engineer', 'Product Manager', 'Frontend Developer', 'Backend Developer', 'Data Scientist']);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Set default roles on error
      setAvailableRoles(['Software Engineer', 'Product Manager', 'Frontend Developer', 'Backend Developer', 'Data Scientist']);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!interviewConfig.role) {
      alert('Please select a role for the interview');
      return;
    }

    try {
      const res = await axios.post(`${SERVER_URL}/api/interview/start`, interviewConfig);
      navigate(`/interview/${res.data._id}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Failed to start interview. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-200 text-xl bg-gray-950">Loading dashboard...</div>;
  }

  const recentInterviews = interviews.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-200px] left-[-200px] w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 py-8 bg-gradient-to-b from-gray-950/80 to-transparent">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-400 text-lg">Ready to ace your next interview?</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="relative z-5 max-w-7xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-3">
            <Stats user={user} interviews={interviews} />
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/50 border border-blue-500/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-blue-500/20 hover:-translate-y-1 hover:shadow-3xl">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => setShowStartModal(true)}
                className="relative w-full bg-gradient-to-r from-blue-500 to-blue-600 border-none rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 overflow-hidden group"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 py-5 text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Start New Interview
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </button>
              <button 
                onClick={() => navigate('/history')}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-gray-200 font-medium cursor-pointer transition-all duration-300 hover:bg-white/8 hover:border-white/20 hover:-translate-y-0.5 backdrop-blur-sm flex items-center justify-center gap-3 py-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                View History
              </button>
            </div>
          </div>

          {/* Recent Interviews */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-blue-500/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-blue-500/20 hover:-translate-y-1 hover:shadow-3xl">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Interviews</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            {recentInterviews.length > 0 ? (
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div key={interview._id} className="relative bg-white/3 border border-white/8 rounded-xl p-6 transition-all duration-300 hover:bg-white/5 hover:border-blue-500/30 hover:-translate-y-0.5 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                    <div className="relative z-10 flex justify-between items-center">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{interview.role}</h3>
                        <p className="text-gray-400 text-sm">{interview.company || 'Practice Session'}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          interview.status === 'completed' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : interview.status === 'in-progress'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {interview.overallScore && (
                          <div className="text-center">
                            <span className="block text-2xl font-bold text-emerald-400">{interview.overallScore}%</span>
                            <span className="block text-xs text-gray-400 uppercase tracking-wider">Score</span>
                          </div>
                        )}
                        <button 
                          onClick={() => {
                            if (interview.status === 'completed') {
                              navigate(`/results/${interview._id}`);
                            } else {
                              navigate(`/interview/${interview._id}`);
                            }
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 border-none rounded-lg text-white font-medium cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 text-sm"
                        >
                          {interview.status === 'completed' ? 'View Results' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">No interviews yet</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">Start your first practice interview to see your progress here!</p>
                <button 
                  onClick={() => setShowStartModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 border-none rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  Start Your First Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Interview Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 border border-blue-500/20 rounded-2xl w-full max-w-lg backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Start New Interview</h2>
              <button 
                onClick={() => setShowStartModal(false)}
                className="bg-none border-none text-gray-400 cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6 pt-4">
              <div className="mb-6">
                <label htmlFor="role" className="block font-medium text-gray-200 mb-2 text-sm">Target Role*</label>
                <select
                  id="role"
                  value={interviewConfig.role}
                  onChange={(e) => setInterviewConfig({...interviewConfig, role: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/8"
                >
                  <option value="" className="bg-gray-800 text-white">Select a role</option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role} className="bg-gray-800 text-white">{role}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="company" className="block font-medium text-gray-200 mb-2 text-sm">Target Company (Optional)</label>
                <input
                  id="company"
                  type="text"
                  value={interviewConfig.company}
                  onChange={(e) => setInterviewConfig({...interviewConfig, company: e.target.value})}
                  placeholder="e.g., Google, Amazon, Microsoft"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/8 placeholder-gray-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="type" className="block font-medium text-gray-200 mb-2 text-sm">Interview Type</label>
                <select
                  id="type"
                  value={interviewConfig.type}
                  onChange={(e) => setInterviewConfig({...interviewConfig, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/8"
                >
                  <option value="practice" className="bg-gray-800 text-white">Practice Session</option>
                  <option value="mock" className="bg-gray-800 text-white">Mock Interview</option>
                  <option value="assessment" className="bg-gray-800 text-white">Assessment</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="difficulty" className="block font-medium text-gray-200 mb-2 text-sm">Difficulty Level</label>
                <select
                  id="difficulty"
                  value={interviewConfig.difficulty}
                  onChange={(e) => setInterviewConfig({...interviewConfig, difficulty: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/8"
                >
                  <option value="easy" className="bg-gray-800 text-white">Easy</option>
                  <option value="medium" className="bg-gray-800 text-white">Medium</option>
                  <option value="hard" className="bg-gray-800 text-white">Hard</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="timeLimit" className="block font-medium text-gray-200 mb-2 text-sm">Time Limit (minutes)</label>
                <input
                  id="timeLimit"
                  type="number"
                  min="5"
                  max="180"
                  value={interviewConfig.timeLimit}
                  onChange={(e) => setInterviewConfig({...interviewConfig, timeLimit: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/8"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 pt-0">
              <button 
                onClick={() => setShowStartModal(false)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 font-medium cursor-pointer transition-all duration-300 hover:bg-white/8 hover:border-white/20 hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleStartInterview}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 border-none rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
