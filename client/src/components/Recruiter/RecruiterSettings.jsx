import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, Shield, UserCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import RecruiterLayout from './RecruiterLayout.jsx';

const SETTINGS_KEY = 'recruiter-dashboard-settings';

const defaultSettings = {
  emailNotifications: true,
  interviewReminders: true,
  weeklySummary: false,
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      checked ? 'bg-blue-500' : 'bg-slate-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const RecruiterSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch {
        localStorage.removeItem(SETTINGS_KEY);
        setSettings(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <RecruiterLayout activePage="settings" onLogout={handleLogout} userName={user?.name}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Preferences</p>
      <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">Settings</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Manage recruiter notification and account preferences.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#081227]/80 p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-100">Account</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <UserCircle size={16} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Name</p>
                <p className="font-medium text-slate-100">{user?.name || 'Recruiter'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <Mail size={16} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p>
                <p className="font-medium text-slate-100">{user?.email || 'Not available'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <Shield size={16} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Role</p>
                <p className="font-medium capitalize text-slate-100">{user?.role || 'recruiter'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#081227]/80 p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-100">Notifications</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="pr-3">
                <p className="text-sm font-semibold text-slate-100">Email notifications</p>
                <p className="text-xs text-slate-400">Get updates for candidate submissions.</p>
              </div>
              <Toggle checked={settings.emailNotifications} onChange={() => updateSetting('emailNotifications')} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="pr-3">
                <p className="text-sm font-semibold text-slate-100">Interview reminders</p>
                <p className="text-xs text-slate-400">Receive reminders for active interview links.</p>
              </div>
              <Toggle checked={settings.interviewReminders} onChange={() => updateSetting('interviewReminders')} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="pr-3">
                <p className="text-sm font-semibold text-slate-100">Weekly summary</p>
                <p className="text-xs text-slate-400">Get a weekly report of scores and completions.</p>
              </div>
              <Toggle checked={settings.weeklySummary} onChange={() => updateSetting('weeklySummary')} />
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300">
            <Bell size={13} />
            Settings are saved automatically on this device.
          </div>
        </section>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterSettings;
