import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  ShieldCheck,
  Clock,
  CheckCircle,
  Users,
  Flame,
  ArrowRight,
  TrendingUp,
  FileText,
  UploadCloud,
  Bookmark,
  Send,
  AlertTriangle,
  Award
} from 'lucide-react';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { useOpportunities } from '../../context/OpportunityContext';
import { OPPORTUNITY_TYPES } from '../../data/mockOpportunities';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';

export default function AdminDashboardPage() {
  const { opportunities, submissions, savedIds, applications } = useOpportunities();

  const totalCount = opportunities.length;
  const publishedCount = opportunities.filter((o) => o.status === 'published').length;
  const verifiedCount = opportunities.filter((o) => o.verificationStatus === 'verified').length;
  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;
  const expiredCount = opportunities.filter((o) => {
    if (o.status === 'expired') return true;
    const dl = getDeadlineStatus(o.deadline);
    return dl.isExpired;
  }).length;

  const expiringSoonCount = opportunities.filter((o) => {
    if (o.status !== 'published') return false;
    const dl = getDeadlineStatus(o.deadline);
    return !dl.isExpired && dl.daysLeft <= 7;
  }).length;

  // Most viewed opportunities
  const mostViewedOpps = useMemo(() => {
    return [...opportunities]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);
  }, [opportunities]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Admin Welcome & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Platform Administration & Verification Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage opportunity verification, bulk CSV imports, student submissions, and real-time platform analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/import">
            <Button variant="outline" size="md" icon={UploadCloud}>
              CSV Import
            </Button>
          </Link>
          <Link to="/admin/submissions">
            <Button
              variant="outline"
              size="md"
              icon={Clock}
              className={pendingSubmissionsCount > 0 ? 'border-amber-300 bg-amber-50/50 text-amber-800' : ''}
            >
              Review Queue ({pendingSubmissionsCount})
            </Button>
          </Link>
          <Link to="/admin/opportunities/new">
            <Button variant="primary" size="md" icon={PlusCircle} className="shadow-sm shadow-brand-500/20">
              Create Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Analytics KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Listings</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalCount}</p>
          <p className="text-xs text-emerald-600 font-semibold">{publishedCount} active • {verifiedCount} verified</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{pendingSubmissionsCount}</p>
          <p className="text-xs text-amber-700 font-semibold">
            {pendingSubmissionsCount === 0 ? 'Queue is clear' : 'Awaiting admin verification'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Closing This Week</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{expiringSoonCount}</p>
          <p className="text-xs text-rose-600 font-semibold">&lt; 7 days left ({expiredCount} expired)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Engagement</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{applications.length}</p>
          <p className="text-xs text-purple-600 font-semibold">
            {savedIds.length} Saved Bookmarks
          </p>
        </div>
      </div>

      {/* Middle Section: Category Breakdown + Most Viewed Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {OPPORTUNITY_TYPES.filter((t) => t.id !== 'all').map((cat) => {
              const count = opportunities.filter((o) => o.type === cat.id).length;
              const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-slate-500">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Viewed Opportunities (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>Most Viewed Opportunities</span>
              </h2>
              <p className="text-xs text-slate-500">
                Top student demand and trending listings
              </p>
            </div>
            <Link
              to="/admin/opportunities"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {mostViewedOpps.map((opp) => (
              <div key={opp.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{opp.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">{opp.organization} • {opp.location}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900">
                    {opp.views?.toLocaleString() || 0} views
                  </span>
                  <div className="text-[11px] text-emerald-600 font-semibold">Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Quick Tools Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/import"
          className="p-5 bg-gradient-to-br from-brand-50 to-indigo-50/50 rounded-2xl border border-brand-200/80 hover:border-brand-400 transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition">
              Bulk CSV Importer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload batches of opportunities with duplicate detection and error validation.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/logs"
          className="p-5 bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl border border-purple-200/80 hover:border-purple-400 transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition">
              Administrator Audit Logs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review history of approvals, deletions, and publishing events.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
