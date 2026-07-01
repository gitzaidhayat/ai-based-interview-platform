import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Users } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import RecruiterLayout from './RecruiterLayout.jsx';
import { fetchRecruiterInterviewResults, fetchRecruiterInterviews } from '../../utils/recruiterApi.js';

const getScoreBadgeClass = (score) => {
  if (score >= 80) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  }

  if (score >= 60) {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  }

  return 'border-red-500/30 bg-red-500/10 text-red-300';
};

const RecruiterCandidates = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      setError('');

      try {
        const interviews = await fetchRecruiterInterviews();
        const candidateGroups = await Promise.all(
          interviews.map(async (interview) => {
            const interviewId = interview.interviewId || interview._id;
            if (!interviewId) {
              return [];
            }

            const results = await fetchRecruiterInterviewResults(interviewId);
            return results.map((result) => ({
              id: result._id || `${result.email}-${interviewId}`,
              candidateName: result.candidateName || 'Unknown Candidate',
              email: result.email || 'No email',
              finalScore: result.finalScore || 0,
              completedAt: result.completedAt,
              interviewId,
              jobRole: interview.jobRole,
              difficulty: interview.difficulty,
            }));
          })
        );

        const allCandidates = candidateGroups.flat().sort(
          (a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
        );
        setCandidates(allCandidates);
      } catch {
        setError('Failed to load candidate results. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobRole.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesScore =
        scoreFilter === 'all' ||
        (scoreFilter === 'high' && candidate.finalScore >= 80) ||
        (scoreFilter === 'medium' && candidate.finalScore >= 60 && candidate.finalScore < 80) ||
        (scoreFilter === 'low' && candidate.finalScore < 60);

      return matchesSearch && matchesScore;
    });
  }, [candidates, scoreFilter, searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050a14] text-slate-400">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <p className="mt-3 text-sm">Loading candidates...</p>
      </div>
    );
  }

  return (
    <RecruiterLayout activePage="candidates" onLogout={handleLogout} userName={user?.name}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pipeline</p>
      <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">Candidates</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Review all candidate attempts across interviews with score-based filtering.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-7 rounded-2xl border border-white/10 bg-[#081227]/80 p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by candidate, email, or role..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0d1832] py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none"
            />
          </label>

          <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1832] px-3 py-2 text-sm text-slate-300">
            <Filter size={15} className="text-slate-500" />
            <select
              value={scoreFilter}
              onChange={(event) => setScoreFilter(event.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none"
            >
              <option value="all" className="bg-[#0d1832]">
                All Scores
              </option>
              <option value="high" className="bg-[#0d1832]">
                High (80+)
              </option>
              <option value="medium" className="bg-[#0d1832]">
                Medium (60-79)
              </option>
              <option value="low" className="bg-[#0d1832]">
                Low (&lt;60)
              </option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#081227]/80">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-100">Candidate Attempts</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            <Users size={12} />
            {filteredCandidates.length}
          </span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            No candidates match the current search/filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-5 py-3 font-semibold">Candidate</th>
                  <th className="px-5 py-3 font-semibold">Interview</th>
                  <th className="px-5 py-3 font-semibold">Difficulty</th>
                  <th className="px-5 py-3 font-semibold">Score</th>
                  <th className="px-5 py-3 font-semibold">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="text-sm text-slate-300">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-100">{candidate.candidateName}</p>
                      <p className="text-xs text-slate-400">{candidate.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-100">{candidate.jobRole}</p>
                      <p className="text-xs text-slate-400">ID: {candidate.interviewId}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{candidate.difficulty}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${getScoreBadgeClass(candidate.finalScore)}`}>
                        {candidate.finalScore}/100
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {candidate.completedAt
                        ? new Date(candidate.completedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterCandidates;
