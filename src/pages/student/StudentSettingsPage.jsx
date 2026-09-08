import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Sliders,
  Shield,
  Save,
  CheckCircle2,
  Mail,
  Smartphone,
  Eye
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function StudentSettingsPage() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState({
    deadlineReminders: true,
    matchingOpportunities: true,
    statusUpdates: true,
    weeklyDigest: false,
    emailAlerts: true,
    browserPush: true
  });

  const [careerPrefs, setCareerPrefs] = useState({
    preferredMode: user?.preferredMode || 'Hybrid',
    willingToRelocate: true,
    instantApplyAlerts: true
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    addToast('Notification preferences successfully saved!', 'success');
  };

  const handleSaveCareerPrefs = (e) => {
    e.preventDefault();
    updateProfile({ preferredMode: careerPrefs.preferredMode });
    addToast('Career preferences updated!', 'success');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (passwordState.newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'warning');
      return;
    }
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    addToast('Password successfully updated!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-brand-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Account & Notification Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Student Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage how and when you receive opportunity alerts, deadline notifications, and security options.
        </p>
      </div>

      {/* 1. Notification Preferences Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Bell className="w-5 h-5 text-brand-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Notification Alerts</h2>
            <p className="text-xs text-slate-500">Choose which updates trigger notifications</p>
          </div>
        </div>

        <form onSubmit={handleSaveNotifications} className="space-y-4">
          <div className="space-y-3">
            {[
              {
                id: 'deadlineReminders',
                title: 'Deadline Approaching Alerts',
                desc: 'Receive alerts 3 days and 24 hours before saved opportunities close.'
              },
              {
                id: 'matchingOpportunities',
                title: 'High-Fit Match Notifications',
                desc: 'Get notified when a new opportunity matches > 75% of your profile skills.'
              },
              {
                id: 'statusUpdates',
                title: 'Application Pipeline Reminders',
                desc: 'Reminders to log interview rounds and assessment completions in your tracker.'
              },
              {
                id: 'weeklyDigest',
                title: 'Weekly Opportunity Digest',
                desc: 'Summary of top trending hackathons and internships sent every Monday.'
              }
            ].map((pref) => (
              <label
                key={pref.id}
                className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-200/80 cursor-pointer transition"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">{pref.title}</div>
                  <div className="text-[11px] text-slate-500">{pref.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(notifications[pref.id])}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [pref.id]: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-1 cursor-pointer"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Notification Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Career Alerts & Discovery Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Career Preferences</h2>
            <p className="text-xs text-slate-500">Fine-tune your preferred work modes and search criteria</p>
          </div>
        </div>

        <form onSubmit={handleSaveCareerPrefs} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Preferred Work Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCareerPrefs({ ...careerPrefs, preferredMode: mode })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition text-center ${
                    careerPrefs.preferredMode === mode
                      ? 'bg-brand-50 text-brand-700 border-brand-300 ring-2 ring-brand-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Career Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Account Security & Password */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Shield className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Security</h2>
            <p className="text-xs text-slate-500">Update your student portal password</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordState.newPassword}
                onChange={(e) =>
                  setPasswordState({ ...passwordState, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordState.confirmPassword}
                onChange={(e) =>
                  setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="outline" size="sm" icon={Lock}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
