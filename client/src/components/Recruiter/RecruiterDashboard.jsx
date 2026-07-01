import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  ClipboardList,
  Copy,
  Plus,
  Star,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';
import ResultsTable from './ResultsTable';
import RecruiterLayout from './RecruiterLayout.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { buildRecruiterShareLink } from '../../utils/recruiterInterviewLinks.js';
import { fetchRecruiterInterviewResults } from '../../utils/recruiterApi.js';
import { SERVER_URL } from '../../utils/apiConfig.js';

const StatCard = ({ label, value, sub, badgeText, badgeClassName, iconClassName, Icon }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#081227]/80 p-5">
    <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl ${iconClassName}`} />
    <div className="relative z-10 mb-5 flex items-start justify-between">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <Icon size={16} className="text-slate-400" />
    </div>
    <p className="text-4xl font-black leading-none text-slate-100">{value}</p>
    <p className="mt-2 text-sm text-slate-400">{sub}</p>
    <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClassName}`}>
      <Check size={10} />
      {badgeText}
    </span>
  </div>
);

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState(false);
  const [stats, setStats] = useState({ totalInterviews: 0, activeInterviews: 0, totalCandidates: 0, avgScore: 0 });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://ai-based-interview-platform.onrender.com/api/recruiter/interviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const interviewList = Array.isArray(data) ? data : [];
      const normalizedInterviews = interviewList.map((interview) => ({
        ...interview,
        shareableLink: buildRecruiterShareLink(interview),
      }));

      const interviewsWithCounts = await Promise.all(
        normalizedInterviews.map(async (interview) => {
          if ((interview.candidateCount || 0) > 0) {
            return interview;
          }

          const interviewId = interview.interviewId || interview._id;
          if (!interviewId) {
            return { ...interview, candidateCount: 0 };
          }

          try {
            const results = await fetchRecruiterInterviewResults(interviewId);
            return { ...interview, candidateCount: results.length };
          } catch {
            return { ...interview, candidateCount: interview.candidateCount || 0 };
          }
        })
      );

      const active = interviewsWithCounts.filter((i) => i.isActive).length;
      setInterviews(interviewsWithCounts);
      setStats({
        totalInterviews: interviewsWithCounts.length,
        activeInterviews: active,
        totalCandidates: interviewsWithCounts.reduce((acc, i) => acc + (i.candidateCount || 0), 0),
        avgScore: 75,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = (interview) => {
    setSelectedInterview(interview);
    setShowResults(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview and all candidate results?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${SERVER_URL}/api/recruiter/delete-interview/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInterviews();
    } catch (error) {
      console.error(error);
      alert('Failed to delete interview.');
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050a14] text-slate-400">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <p className="mt-3 text-sm">Loading your workspace...</p>
      </div>
    );
  }

  if (showResults && selectedInterview) {
    return (
      <RecruiterLayout activePage="dashboard" onLogout={handleLogout} userName={user?.name}>
        <button
          onClick={() => {
            setShowResults(false);
            setSelectedInterview(null);
          }}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-200"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="mb-6 rounded-2xl border border-white/10 bg-[#081227]/80 p-5">
          <h2 className="text-2xl font-bold text-slate-100">{selectedInterview.jobRole}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <ClipboardList size={14} />
              {selectedInterview.interviewId}
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap size={14} />
              {selectedInterview.difficulty}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} />
              {new Date(selectedInterview.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <ResultsTable interviewId={selectedInterview.interviewId} />
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout activePage="dashboard" onLogout={handleLogout} userName={user?.name}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
      <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">Recruiter Dashboard</h1>

      <button
        onClick={() => navigate('/recruiter/create-interview')}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-base font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] transition hover:from-blue-400 hover:to-blue-500"
      >
        <Plus size={18} />
        New Interview
      </button>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Interviews"
          value={stats.totalInterviews}
          sub="All time"
          badgeText="Tracked"
          badgeClassName="bg-blue-500/15 text-blue-300"
          iconClassName="bg-blue-500/25"
          Icon={ClipboardList}
        />
        <StatCard
          label="Live Now"
          value={stats.activeInterviews}
          sub="Currently active"
          badgeText="Live"
          badgeClassName="bg-emerald-500/15 text-emerald-300"
          iconClassName="bg-emerald-500/25"
          Icon={Zap}
        />
        <StatCard
          label="Candidates"
          value={stats.totalCandidates}
          sub="Across all sessions"
          badgeText="Total"
          badgeClassName="bg-cyan-500/15 text-cyan-300"
          iconClassName="bg-cyan-500/25"
          Icon={Users}
        />
        <StatCard
          label="Avg. Score"
          value={`${stats.avgScore}%`}
          sub="Performance index"
          badgeText="Benchmark"
          badgeClassName="bg-amber-500/15 text-amber-300"
          iconClassName="bg-amber-500/25"
          Icon={Star}
        />
      </div>

      {interviews.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-white/10 bg-[#081227]/80 p-8 sm:p-10">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <ClipboardList size={28} className="text-slate-300" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100">No interviews yet</h3>
            <p className="mt-3 text-base text-slate-400">
              Create your first interview to start collecting candidate responses and streamline your hiring pipeline.
            </p>
            <button
              onClick={() => navigate('/recruiter/create-interview')}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-base font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] transition hover:from-blue-400 hover:to-blue-500"
            >
              <Plus size={18} />
              Create First Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-100">Interviews</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
              {interviews.length} total
            </span>
          </div>

          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview._id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#081227]/80">
                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-slate-100">{interview.jobRole}</h3>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          interview.isActive
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                            : 'border-slate-500/30 bg-slate-500/15 text-slate-300'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {interview.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Interview ID</p>
                        <p className="mt-1 font-mono text-sm font-semibold text-sky-300">{interview.interviewId}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Difficulty</p>
                        <p className="mt-1 text-sm font-semibold text-slate-200">{interview.difficulty}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Questions</p>
                        <p className="mt-1 text-sm font-semibold text-slate-200">{interview.questionCount}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Time Limit</p>
                        <p className="mt-1 text-sm font-semibold text-slate-200">{interview.timeLimit} min</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {interview.topics?.map((topic) => (
                        <span
                          key={`${interview._id}-${topic}`}
                          className="rounded-md border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={14} />
                      Created{' '}
                      {new Date(interview.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {' · '}
                      {new Date(interview.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex w-full shrink-0 flex-col gap-2 lg:w-44">
                    <button
                      onClick={() => handleViewResults(interview)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-blue-400/40 hover:bg-blue-500/15"
                    >
                      <BarChart3 size={14} />
                      View Results
                    </button>
                    <button
                      onClick={() => copyLink(interview.shareableLink || buildRecruiterShareLink(interview))}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-400/40 hover:bg-white/10"
                    >
                      <Copy size={14} />
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleDelete(interview.interviewId)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-slate-400">
                  <span>{interview.candidateCount || 0} candidates attempted</span>
                  {interview.isActive && (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300">
                      {interview.candidateCount || 0} completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#081227] px-4 py-2 text-sm font-medium text-emerald-300 shadow-lg shadow-emerald-950/40">
          <Check size={14} />
          Link copied to clipboard
        </div>
      )}
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
