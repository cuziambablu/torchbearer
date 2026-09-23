import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bookmark,
  Send,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Compass,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import { useAuth } from '../../context/AuthContext';
import { useOpportunities } from '../../context/OpportunityContext';
import { getRecommendedOpportunities } from '../../utils/recommendation';
import { getDeadlineStatus } from '../../utils/dateUtils';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { opportunities = [], savedIds = [], applications = [] } = useOpportunities();

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeSavedIds = Array.isArray(savedIds) ? savedIds : [];
  const safeApplications = Array.isArray(applications) ? applications : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Saved Opportunities list
  const savedOpportunities = useMemo(() => {
    return safeOpportunities.filter((o) => safeSavedIds.includes(o.id));
  }, [safeOpportunities, safeSavedIds]);

  // Upcoming deadlines from saved & applied opportunities
  const trackedOpportunities = useMemo(() => {
    const trackedIds = new Set([
      ...safeSavedIds,
      ...safeApplications.map((a) => a?.opportunityId).filter(Boolean)
    ]);
    return safeOpportunities
      .filter((o) => trackedIds.has(o.id))
      .map((o) => ({
        ...o,
        deadlineInfo: getDeadlineStatus(o.deadline)
      }))
      .filter((o) => !o.deadlineInfo.isExpired)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);
  }, [safeOpportunities, safeSavedIds, safeApplications]);

  // Personalized Recommended Opportunities
  const recommendedOpportunities = useMemo(() => {
    return getRecommendedOpportunities(safeOpportunities, user, 6);
  }, [safeOpportunities, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* 1. Welcome Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle Torch Accent Light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-torch-400/15 via-torch-200/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>🎓 {user?.college || 'Engineering Student'}</span>
            <span>•</span>
            <span>{user?.branch || 'CSE'} ({user?.year || '3rd Year'})</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {greeting}, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Ready to discover your next opportunity? You have <span className="font-bold text-slate-900">{recommendedOpportunities.length} personalized AI matches</span> waiting for review.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-torch-gradient text-white text-xs font-semibold shadow-torch-button hover:opacity-95 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All</span>
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span>Edit Skills</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-torch-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Saved Opportunities</span>
            <Bookmark className="w-4 h-4 text-torch-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{safeSavedIds.length}</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-torch-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Applications</span>
            <Send className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{safeApplications.length}</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-torch-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Deadlines Approaching</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{trackedOpportunities.length}</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-torch-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Recommended for You</span>
            <Sparkles className="w-4 h-4 text-torch-500" />
          </div>
          <p className="text-2xl font-black text-torch-600">{recommendedOpportunities.length}</p>
        </div>
      </div>

      {/* 3. AI Personalized Recommendation Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-torch-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ Personalized for you</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Based on your skills & interests
            </h2>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-torch-600 hover:text-torch-700 flex items-center gap-1"
          >
            <span>View all matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedOpportunities.map((opp, idx) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              showMatchScore={true}
              matchScore={94 - idx * 3}
            />
          ))}
        </div>
      </div>

      {/* 4. Upcoming Deadlines Radar */}
      {trackedOpportunities.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Tracked Deadlines</h3>
            </div>
            <Link to="/applications" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              Open Tracker →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {trackedOpportunities.map((opp) => (
              <div key={opp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  {opp.organization}
                </p>
                <h4 className="text-xs font-bold text-slate-900 truncate">{opp.title}</h4>
                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <span className="text-red-600 font-semibold">{opp.deadlineInfo?.label}</span>
                  <Link to={`/opportunities/${opp.id}`} className="text-torch-600 font-bold hover:underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
