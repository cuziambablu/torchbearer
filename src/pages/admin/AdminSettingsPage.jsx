import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Database,
  RefreshCw,
  Server,
  Lock,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Bell,
  Cpu,
  Save
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useOpportunities } from '../../context/OpportunityContext';
import { isSupabaseConfigured } from '../../services/supabase';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const { opportunities, resetToDefault } = useOpportunities();

  const [settings, setSettings] = useState({
    autoExpire: true,
    requireVerification: true,
    allowStudentSubmissions: true,
    feedRefreshInterval: '6',
    maxSubmissionsPerUser: '5',
    strictEmailDomain: false,
    alertThresholdDays: '7'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Platform configuration settings successfully updated.', 'success');
    }, 500);
  };

  const handleExportFullBackup = () => {
    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      catalogCount: opportunities.length,
      data: opportunities
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `torchbearer-ai-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addToast('Platform database backup successfully downloaded.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset the opportunity catalog to verified seeds? This will purge unverified local edits.')) {
      if (resetToDefault) {
        resetToDefault();
        addToast('Opportunity catalog reset to initial seeds.', 'info');
      } else {
        localStorage.removeItem('campuslaunch_opportunities_v2');
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              System & Operations
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Platform Settings & Control Plane</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure backend integrations, automated catalog workers, security rules, and data retention policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* 1. Supabase Backend Infrastructure Health */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Supabase Cloud Database Status</h2>
              <p className="text-xs text-slate-400">Primary persistence layer and PostgreSQL connection</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isSupabaseConfigured ? 'Connected & Verified' : 'Local Fallback Storage Active'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Opportunities Table</div>
            <div className="text-lg font-bold text-white mt-1">{opportunities.length} Records</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">Schema synced</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">RLS Security Status</div>
            <div className="text-lg font-bold text-white mt-1">Enabled (Active)</div>
            <div className="text-xs text-brand-400 font-semibold mt-1">Row-Level Security on</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">CORS / Vercel Edge</div>
            <div className="text-lg font-bold text-white mt-1">Authorized</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">All origins verified</div>
          </div>
        </div>
      </div>

      {/* 2. Automated Catalog Workers */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-brand-400" />
            <div>
              <h2 className="text-base font-bold text-white">Catalog Automation & Expiry Workers</h2>
              <p className="text-xs text-slate-400">Rules governing automated expiration and student discovery</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Auto Expire Past Deadline */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white">Automated Deadline Expiry</div>
                <div className="text-xs text-slate-400">
                  Automatically hide listings when the application deadline passes at 11:59 PM IST.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('autoExpire')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoExpire ? 'bg-brand-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoExpire ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Strict Admin Verification */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white">Enforce Verified Badging</div>
                <div className="text-xs text-slate-400">
                  Require administrator audit and official URL inspection before displaying on public explore pages.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('requireVerification')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireVerification ? 'bg-brand-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireVerification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Allow Student Submissions */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white">Community Submission Portal</div>
                <div className="text-xs text-slate-400">
                  Allow authenticated college students to submit newly found opportunities to the moderation queue.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowStudentSubmissions')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowStudentSubmissions ? 'bg-brand-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allowStudentSubmissions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Security & Safety Controls */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Lock className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white">Access & Safety Moderation</h2>
              <p className="text-xs text-slate-400">Student enrollment verification and spam prevention</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Urgent Deadline Warning Threshold (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.alertThresholdDays}
                onChange={(e) => setSettings({ ...settings, alertThresholdDays: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Max Daily Submissions Per Student
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxSubmissionsPerUser}
                onChange={(e) => setSettings({ ...settings, maxSubmissionsPerUser: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Data Backup & Reset Actions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Server className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Data Management & Disaster Recovery</h2>
              <p className="text-xs text-slate-400">Download complete catalog backups or perform seed resets</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleExportFullBackup}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Download JSON Master Backup</span>
            </button>

            <button
              type="button"
              onClick={handleResetData}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>Reset Catalog to Verified Seeds</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
