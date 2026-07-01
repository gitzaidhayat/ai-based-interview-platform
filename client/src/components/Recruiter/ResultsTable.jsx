import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SERVER_URL } from '../../utils/apiConfig.js';

const ResultsTable = ({ interviewId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('finalScore');
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [interviewId]);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${SERVER_URL}/api/recruiter/results/${interviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results
    .filter(result => 
      result.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'finalScore') return b.finalScore - a.finalScore;
      if (sortBy === 'candidateName') return a.candidateName.localeCompare(b.candidateName);
      if (sortBy === 'date') return new Date(b.completedAt) - new Date(a.completedAt);
      return 0;
    });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAnalyticsData = () => {
    if (results.length === 0) return { radarData: [], barData: [] };

    const radarData = [
      {
        subject: 'Communication',
        A: results.reduce((acc, r) => acc + r.scores.cs, 0) / results.length,
        fullMark: 100
      },
      {
        subject: 'Technical',
        A: results.reduce((acc, r) => acc + r.scores.lds, 0) / results.length,
        fullMark: 100
      },
      {
        subject: 'Fluency',
        A: results.reduce((acc, r) => acc + r.scores.rfs, 0) / results.length,
        fullMark: 100
      },
      {
        subject: 'Confidence',
        A: results.reduce((acc, r) => acc + r.scores.ci, 0) / results.length,
        fullMark: 100
      }
    ];

    const barData = results.map(result => ({
      name: result.candidateName.split(' ')[0],
      score: result.finalScore
    })).slice(0, 10);

    return { radarData, barData };
  };

  const { radarData, barData } = getAnalyticsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="finalScore">Sort by Score</option>
              <option value="candidateName">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Skills Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Average Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Candidate Results ({filteredResults.length})
          </h3>
        </div>
        
        {filteredResults.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
            <p className="text-gray-600">Share the interview link to start collecting candidate responses</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Communication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technical
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fluency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${getScoreColor(result.finalScore)}`}>
                        {result.finalScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getScoreColor(result.scores.cs)}`}>
                        {result.scores.cs}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getScoreColor(result.scores.lds)}`}>
                        {result.scores.lds}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getScoreColor(result.scores.rfs)}`}>
                        {result.scores.rfs}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getScoreColor(result.scores.ci)}`}>
                        {result.scores.ci}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
