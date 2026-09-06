import React from 'react';
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
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { useOpportunities } from '../../context/OpportunityContext';
import { OPPORTUNITY_TYPES } from '../../data/mockOpportunities';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';

export default function AdminDashboardPage() {
  const { opportunities, submissions } = useOpportunities();

  const totalCount = opportunities.length;
  const publishedCount = opportunities.filter((o) => o.status === 'published').length;
  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;
  const expiringSoonCount = opportunities.filter((o) => {
    if (o.status !== 'published') return false;
    const dl = getDeadlineStatus(o.deadline);
    return !dl.isExpired && dl.daysLeft <= 7;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Admin Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              CampusLaunch Moderation & Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage opportunity listings, moderate student submissions, and monitor student discovery traffic.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Listings</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalCount}</p>
          <p className="text-xs text-emerald-600 font-semibold">{publishedCount} published live</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{pendingSubmissionsCount}</p>
          <p className="text-xs text-amber-700 font-semibold">
            {pendingSubmissionsCount === 0 ? 'Queue is clear' : 'Awaiting moderation'}
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
          <p className="text-xs text-rose-600 font-semibold">&lt; 7 days left</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Students</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">1,240+</p>
          <p className="text-xs text-purple-600 font-semibold">Across 45+ Colleges</p>
        </div>
      </div>

      {/* Category Breakdown & Recent Submissions Grid */}
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

        {/* Pending Submissions Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pending Student Submissions ({pendingSubmissionsCount})
              </h2>
              <p className="text-xs text-slate-500">
                Review and approve community submitted opportunities before they go live
              </p>
            </div>
            <Link
              to="/admin/submissions"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {submissions.filter((s) => s.status === 'pending').length > 0 ? (
            <div className="divide-y divide-slate-100">
              {submissions
                .filter((s) => s.status === 'pending')
                .slice(0, 3)
                .map((sub) => (
                  <div key={sub.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
                          {sub.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          By {sub.studentName} ({sub.studentEmail})
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.title}</h4>
                      <p className="text-xs text-slate-500">{sub.organization} • {sub.location}</p>
                    </div>

                    <Link to="/admin/submissions">
                      <Button variant="outline" size="xs">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-700">All student submissions are reviewed!</p>
              <p className="text-slate-400 mt-0.5">New submissions will appear here instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
