import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ClipboardList, TrendingUp, Trophy, Users, Zap } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import RecruiterLayout from './RecruiterLayout.jsx';
import { fetchRecruiterInterviewResults, fetchRecruiterInterviews } from '../../utils/recruiterApi.js';

const StatCard = ({ icon: Icon, label, value, subtext, glowClass }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#081227]/80 p-5">
    <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl ${glowClass}`} />
    <div className="relative z-10">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">{label}</p>
        <Icon size={16} className="text-slate-400" />
      </div>
      <p className="text-3xl font-black text-slate-100">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{subtext}</p>
    </div>
  </div>
);

const RecruiterAnalysis = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const loadAnalysis = async () => {
      setLoading(true);
      setError('');

      try {
        const recruiterInterviews = await fetchRecruiterInterviews();
        const interviewsWithStats = await Promise.all(
          recruiterInterviews.map(async (interview) => {
            const interviewId = interview.interviewId || interview._id;
            if (!interviewId) {
              return {
                ...interview,
                candidateResults: 0,
                averageScore: 0,
                topScore: 0,
              };
            }

            const results = await fetchRecruiterInterviewResults(interviewId);
            const totalScore = results.reduce((sum, result) => sum + (result.finalScore || 0), 0);
            const topScore = results.reduce((max, result) => Math.max(max, result.finalScore || 0), 0);

            return {
              ...interview,
              candidateResults: results.length,
              averageScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
              topScore,
            };
          })
        );

        setInterviews(interviewsWithStats);
      } catch {
        setError('Failed to load analysis data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, []);

  const summary = useMemo(() => {
    const totalInterviews = interviews.length;
    const activeInterviews = interviews.filter((interview) => interview.isActive).length;
    const totalCandidates = interviews.reduce((sum, interview) => sum + (interview.candidateResults || 0), 0);
    const weightedScoreSum = interviews.reduce(
      (sum, interview) => sum + (interview.averageScore || 0) * (interview.candidateResults || 0),
      0
    );
    const averageScore = totalCandidates > 0 ? Math.round(weightedScoreSum / totalCandidates) : 0;
    const bestScore = interviews.reduce((max, interview) => Math.max(max, interview.topScore || 0), 0);

    return {
      totalInterviews,
      activeInterviews,
      totalCandidates,
      averageScore,
      bestScore,
    };
  }, [interviews]);

  const topInterviews = useMemo(
    () =>
      interviews
        .filter((interview) => (interview.candidateResults || 0) > 0)
        .sort((a, b) => {
          if (b.averageScore !== a.averageScore) {
            return b.averageScore - a.averageScore;
          }
          return (b.candidateResults || 0) - (a.candidateResults || 0);
        })
        .slice(0, 5),
    [interviews]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050a14] text-slate-400">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <p className="mt-3 text-sm">Loading analysis...</p>
      </div>
    );
  }

  return (
    <RecruiterLayout activePage="analysis" onLogout={handleLogout} userName={user?.name}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Insights</p>
      <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">Analysis</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Monitor interview performance, candidate outcomes, and hiring quality from one place.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={ClipboardList}
          label="Interviews"
          value={summary.totalInterviews}
          subtext="Total sessions"
          glowClass="bg-blue-500/25"
        />
        <StatCard
          icon={Zap}
          label="Active"
          value={summary.activeInterviews}
          subtext="Currently running"
          glowClass="bg-emerald-500/25"
        />
        <StatCard
          icon={Users}
          label="Candidates"
          value={summary.totalCandidates}
          subtext="Responses received"
          glowClass="bg-cyan-500/25"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Score"
          value={`${summary.averageScore}%`}
          subtext="All candidate attempts"
          glowClass="bg-amber-500/25"
        />
        <StatCard
          icon={Trophy}
          label="Top Score"
          value={`${summary.bestScore}%`}
          subtext="Best candidate result"
          glowClass="bg-fuchsia-500/25"
        />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#081227]/80">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-100">Top Interviews by Score</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            <BarChart3 size={12} />
            Ranked
          </span>
        </div>

        {topInterviews.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            No candidate data available yet. Share an interview link to start collecting responses.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {topInterviews.map((interview, index) => (
              <div
                key={interview._id || interview.interviewId || `${interview.jobRole}-${index}`}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    #{index + 1} {interview.jobRole}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Interview ID: <span className="font-mono text-slate-300">{interview.interviewId}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                    Candidates: <span className="font-semibold">{interview.candidateResults}</span>
                  </span>
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
                    Avg Score: <span className="font-semibold">{interview.averageScore}%</span>
                  </span>
                  <span className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300">
                    Top Score: <span className="font-semibold">{interview.topScore}%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterAnalysis;
