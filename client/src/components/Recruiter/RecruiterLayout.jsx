import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/recruiter/dashboard' },
  { id: 'analysis', label: 'Analysis', path: '/recruiter/analysis' },
  { id: 'candidates', label: 'Candidates', path: '/recruiter/candidates' },
  { id: 'settings', label: 'Settings', path: '/recruiter/settings' },
];

const RecruiterLayout = ({ children, activePage, onLogout, userName }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100">
      <div className="pointer-events-none fixed inset-y-0 left-0 w-40 bg-gradient-to-r from-blue-600/25 to-transparent blur-3xl" />
      <div className="pointer-events-none fixed inset-y-0 right-0 w-40 bg-gradient-to-l from-blue-600/25 to-transparent blur-3xl" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050a14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-bold text-white">
              H
            </div>
            <span className="text-xl font-bold text-slate-100">HireAI</span>
          </div>

          <nav className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  activePage === item.id
                    ? 'bg-white/10 font-medium text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
            >
              <LogOut size={14} />
              Logout
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-300">
              {(userName?.charAt(0) || 'R').toUpperCase()}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-2 md:hidden">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition ${
                  activePage === item.id
                    ? 'bg-white/10 font-semibold text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-7 sm:px-6">{children}</main>
    </div>
  );
};

export default RecruiterLayout;
