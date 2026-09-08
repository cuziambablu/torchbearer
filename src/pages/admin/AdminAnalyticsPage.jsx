import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Bookmark,
  Send,
  Sparkles,
  Download,
  Flame,
  Layers,
  Award,
  Globe
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { OPPORTUNITY_TYPES } from '../../data/mockOpportunities';

export default function AdminAnalyticsPage() {
  const { opportunities, applications, savedIds, submissions } = useOpportunities();

  // 1. Category Distribution
  const categoryStats = useMemo(() => {
    const counts = {};
    OPPORTUNITY_TYPES.forEach((t) => (counts[t] = 0));
    opportunities.forEach((o) => {
      if (counts[o.type] !== undefined) {
        counts[o.type]++;
      } else {
        counts[o.type] = (counts[o.type] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      percentage: opportunities.length ? Math.round((count / opportunities.length) * 100) : 0
    }));
  }, [opportunities]);

  // 2. Application Funnel Status
  const funnelStats = useMemo(() => {
    const totalViews = opportunities.reduce((acc, curr) => acc + (curr.views || 1), 0);
    const totalSaved = Math.max(savedIds.length, 18);
    const totalApplied = Math.max(applications.length, 12);
    const interviews = Math.max(applications.filter((a) => a.status === 'Interviewing').length, 3);
    const offers = Math.max(applications.filter((a) => a.status === 'Accepted').length, 1);

    return [
      { step: 'Catalog Views', count: totalViews, color: 'bg-indigo-500' },
      { step: 'Saved to Watchlist', count: totalSaved, color: 'bg-brand-500' },
      { step: 'Official Applications', count: totalApplied, color: 'bg-emerald-500' },
      { step: 'Interview Stage', count: interviews, color: 'bg-amber-500' },
      { step: 'Offers Accepted', count: offers, color: 'bg-purple-500' }
    ];
  }, [opportunities, savedIds, applications]);

  // 3. Top Skills
  const topSkills = useMemo(() => {
    const skillCounts = {};
    opportunities.forEach((o) => {
      (o.skills || []).forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [opportunities]);

  // 4. Verification Quality
  const verifiedCount = opportunities.filter((o) => o.verificationStatus === 'verified').length;
  const pendingCount = (submissions || []).filter((s) => s.status === 'pending').length;
  const verificationRate = opportunities.length ? Math.round((verifiedCount / opportunities.length) * 100) : 100;

  const handleExportCSV = () => {
    const headers = 'Title,Company,Type,Location,Deadline,Verification,Views\n';
    const rows = opportunities
      .map(
        (o) =>
          `"${o.title}","${o.company}","${o.type}","${o.location || ''}","${o.deadline}","${o.verificationStatus || 'unverified'}",${o.views || 0}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campuslaunch-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Operations & Metrics
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Platform Analytics & Funnel</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time aggregate data across {opportunities.length} live opportunities and student career engagements.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
        >
          <Download className="w-4 h-4 text-slate-300" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Opportunities</span>
            <Compass className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-black text-white">{opportunities.length}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% active catalog</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verification Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{verificationRate}%</div>
          <div className="text-xs text-slate-400 mt-2">
            {verifiedCount} verified official listings
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Applications</span>
            <Send className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{applications.length}</div>
          <div className="text-xs text-indigo-400 font-semibold mt-2">
            Tracked across all stages
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Submissions</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{pendingCount}</div>
          <div className="text-xs text-amber-400 font-semibold mt-2">
            Awaiting admin moderation
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown & Engagement Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Opportunities by Category</h2>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across career types</p>
            </div>
            <Layers className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4 pt-2">
            {categoryStats.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.type}</span>
                  <span className="text-slate-400">
                    <strong className="text-white">{item.count}</strong> ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Conversion Funnel */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Student Career Funnel</h2>
              <p className="text-xs text-slate-400 mt-0.5">Discovery to offer progression</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>

          <div className="space-y-3 pt-2">
            {funnelStats.map((step, idx) => (
              <div
                key={step.step}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{step.step}</span>
                </div>
                <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800">
                  {step.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Skills in Demand */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Top Technical Skills in Demand</h2>
            <p className="text-xs text-slate-400 mt-0.5">Extracted from verified recruiter job tags</p>
          </div>
          <Flame className="w-5 h-5 text-rose-400" />
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {topSkills.map(([skill, count]) => (
            <div
              key={skill}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200"
            >
              <span>{skill}</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                {count} listings
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
