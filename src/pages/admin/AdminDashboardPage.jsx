import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  Flame,
  ArrowRight,
  TrendingUp,
  FileText,
  UploadCloud,
  Bookmark,
  Send,
  AlertTriangle,
  Award,
  Play,
  RotateCw,
  Globe,
  Database,
  Layers,
  Sparkles,
  PlusCircle,
  Activity
} from 'lucide-react';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';
import { formatRelativeVerificationTime } from '../../services/opportunityAgent/freshnessEngine';

export default function AdminDashboardPage() {
  const {
    opportunities,
    submissions,
    reports,
    isAgentRunning,
    runAgentNow,
    lastSyncedAt,
    reviewQueue
  } = useOpportunities();

  const { addToast } = useToast();

  const totalCount = (opportunities || []).length;
  const activeCount = (opportunities || []).filter((o) => {
    if (o.status !== 'published') return false;
    const dl = getDeadlineStatus(o.deadline || o.applicationDeadline);
    return !dl.isExpired;
  }).length;

  const verifiedCount = (opportunities || []).filter((o) => o.verificationStatus === 'verified' || (o.verificationScore || 0) >= 80).length;
  const reviewRequiredCount = (reviewQueue || []).length;
  
  const expiredCount = (opportunities || []).filter((o) => {
    if (o.status === 'expired') return true;
    const dl = getDeadlineStatus(o.deadline || o.applicationDeadline);
    return dl.isExpired;
  }).length;

  const closingSoonCount = (opportunities || []).filter((o) => {
    const dl = getDeadlineStatus(o.deadline || o.applicationDeadline);
    return !dl.isExpired && dl.isClosingSoon;
  }).length;

  const handleScanSources = async () => {
    try {
      addToast('Initiating live multi-source discovery and verification scan...', 'info');
      const res = await runAgentNow({ minVerificationScore: 75, autoPublishThreshold: 80, autoPublish: true });
      addToast('Discovery scan complete! Discovered: ' + res.stats.discovered + ', Published: ' + res.stats.published, 'success');
    } catch (err) {
      addToast('Scan error: ' + err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in text-slate-900">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Platform Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Opportunity Intelligence Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage live discovery ingestion, source reliability, verification status, and student reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={RotateCw}
            loading={isAgentRunning}
            onClick={handleScanSources}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm"
          >
            Scan Sources Now
          </Button>
          <Link to="/admin/opportunities/new">
            <Button variant="outline" size="md" icon={PlusCircle}>
              Add Opportunity
            </Button>
          </Link>
          <Link to="/admin/sources">
            <Button variant="outline" size="md" icon={Globe}>
              Manage Sources
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Ingested</span>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Stored in database</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Live</span>
          <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Currently published</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Closing Soon</span>
          <div className="text-2xl font-black text-amber-600">{closingSoonCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">&lt; 7 days remaining</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Verified</span>
          <div className="text-2xl font-black text-blue-600">{verifiedCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Domain & link verified</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Review Queue</span>
          <div className="text-2xl font-black text-purple-600">{reviewRequiredCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Pending manual review</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Expired</span>
          <div className="text-2xl font-black text-rose-600">{expiredCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Deadlines passed</div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Source Registry & Health</h3>
              <p className="text-xs text-slate-500">Monitor active API, RSS & partner crawlers</p>
            </div>
          </div>
          <Link
            to="/admin/sources"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 transition"
          >
            <span>View 15+ Configured Sources ?</span>
          </Link>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Autonomous Agent Console</h3>
              <p className="text-xs text-slate-500">Configure 6-hour cron scan thresholds</p>
            </div>
          </div>
          <Link
            to="/admin/agent"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 transition"
          >
            <span>Open Agent Console & Logs ?</span>
          </Link>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Verification Center</h3>
              <p className="text-xs text-slate-500">Audit domain validity & flag broken links</p>
            </div>
          </div>
          <Link
            to="/admin/verification"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 transition"
          >
            <span>Run Verification Audits ?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
