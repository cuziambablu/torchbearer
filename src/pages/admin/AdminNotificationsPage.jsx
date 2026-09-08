import React, { useState } from 'react';
import {
  Bell,
  Send,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Clock,
  Filter,
  Megaphone,
  Radio,
  Trash2
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const INITIAL_BROADCASTS = [
  {
    id: 'bc-1',
    title: '🚨 Smart India Hackathon (SIH 2026) Final Registration Warning',
    type: 'urgent',
    target: 'All Engineering Students',
    recipients: 1420,
    sentAt: '2026-09-08T10:00:00Z',
    status: 'delivered',
    message:
      'College internal nomination portals close in 48 hours. Ensure team leads submit team rosters on SIH before September 15.'
  },
  {
    id: 'bc-2',
    title: 'Google Summer of Code 2027 Mentorship Session Announced',
    type: 'spotlight',
    target: 'Open Source Community (All Years)',
    recipients: 890,
    sentAt: '2026-09-06T14:30:00Z',
    status: 'delivered',
    message:
      'Join the live prep AMA with past GSoC contributors this Saturday at 6:00 PM IST on Discord.'
  },
  {
    id: 'bc-3',
    title: 'Scheduled System Maintenance Notice',
    type: 'info',
    target: 'All Users',
    recipients: 2450,
    sentAt: '2026-09-01T08:00:00Z',
    status: 'delivered',
    message:
      'Platform database optimization scheduled for Sunday 2:00 AM - 4:00 AM IST. Application tracking will be temporarily read-only.'
  }
];

export default function AdminNotificationsPage() {
  const { addToast } = useToast();
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  const [formData, setFormData] = useState({
    title: '',
    type: 'urgent',
    target: 'All Registered Students',
    message: '',
    actionUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      addToast('Please enter both a title and message content.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newBroadcast = {
        id: `bc-${Date.now()}`,
        title: formData.title,
        type: formData.type,
        target: formData.target,
        recipients: formData.target === 'All Registered Students' ? 2450 : 640,
        sentAt: new Date().toISOString(),
        status: 'delivered',
        message: formData.message
      };

      setBroadcasts([newBroadcast, ...broadcasts]);
      setFormData({
        title: '',
        type: 'urgent',
        target: 'All Registered Students',
        message: '',
        actionUrl: ''
      });
      setIsSubmitting(false);
      addToast(`Broadcast successfully sent to ${newBroadcast.recipients} students!`, 'success');
    }, 600);
  };

  const handleDelete = (id) => {
    setBroadcasts(broadcasts.filter((b) => b.id !== id));
    addToast('Broadcast record removed.', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Engagement & Alerts
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Broadcast Alerts & Push Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish targeted notifications, urgent deadline reminders, and platform announcements to student portals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Broadcast Form */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm sticky top-24 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Megaphone className="w-5 h-5 text-brand-400" />
              <h2 className="text-base font-bold text-white">New Broadcast Alert</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ⚡ Amazon ML Summer School Applications Open"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Alert Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="urgent">🚨 Urgent / Deadline</option>
                    <option value="spotlight">⭐ Opportunity Spotlight</option>
                    <option value="info">ℹ️ System Info</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Group
                  </label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="All Registered Students">All Students</option>
                    <option value="Pre-Final & Final Year (2026/2027)">Final Years (2026/27)</option>
                    <option value="Computer Science & IT">CSE / IT Depts</option>
                    <option value="Active Applicants">Active Applicants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide concise details, instructions, or deadlines for students..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Action Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://campuslaunch.org/opportunities/..."
                  value={formData.actionUrl}
                  onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Broadcast...' : 'Broadcast to Students'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Broadcast History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Broadcast Dispatch History</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{broadcasts.length} total dispatches</span>
          </div>

          <div className="space-y-3">
            {broadcasts.map((b) => {
              const isUrgent = b.type === 'urgent';
              const isSpotlight = b.type === 'spotlight';

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isUrgent
                              ? 'bg-rose-500/20 text-rose-300'
                              : isSpotlight
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {b.type}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{b.target}</span>
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{b.recipients} delivered</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white pt-1">{b.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    {b.message}
                  </p>

                  <div className="text-[11px] text-slate-400">
                    Dispatched on {new Date(b.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
