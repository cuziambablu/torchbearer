import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bookmark,
  Send,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  AlertCircle
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import DeadlineBadge from '../../components/opportunities/DeadlineBadge';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useOpportunities } from '../../context/OpportunityContext';
import { getRecommendedOpportunities } from '../../utils/recommendation';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { opportunities = [], savedIds = [], applications = [] } = useOpportunities();

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeSavedIds = Array.isArray(savedIds) ? savedIds : [];
  const safeApplications = Array.isArray(applications) ? applications : [];

  // Greeting based on time of day
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
      .filter((o) => trackedIds.has(o.id) && o.status === 'published')
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
    return getRecommendedOpportunities(safeOpportunities, user, 4);
  }, [safeOpportunities, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Dashboard Welcome Hero */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-sm">
              <span>🎓 {user?.college || 'Engineering Student'}</span>
              <span>•</span>
              <span>{user?.branch || 'CSE'} ({user?.year || '3rd Year'})</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have <span className="font-bold text-white">{trackedOpportunities.length} deadlines</span> approaching this week and <span className="font-bold text-white">{recommendedOpportunities.length} high-fit matches</span> based on your skills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/opportunities">
              <Button
                variant="primary"
                size="md"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-none font-bold"
                icon={Compass}
              >
                Browse All
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Edit Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-xs text-brand-200 font-medium">Saved Items</p>
            <p className="text-2xl font-black text-white mt-0.5">{savedIds.length}</p>
          </div>
          <div>
            <p className="text-xs text-brand-200 font-medium">Active Applications</p>
            <p className="text-2xl font-black text-white mt-0.5">{applications.length}</p>
          </div>
          <div>
            <p className="text-xs text-brand-200 font-medium">Closing in &lt; 7 Days</p>
            <p className="text-2xl font-black text-amber-300 mt-0.5">{trackedOpportunities.length}</p>
          </div>
          <div>
            <p className="text-xs text-brand-200 font-medium">Profile Readiness</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs font-black text-emerald-300">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Deadlines Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Your Upcoming Deadlines
            </h2>
          </div>
          <Link
            to="/saved"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View all saved</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trackedOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trackedOpportunities.map((opp) => (
              <Link
                key={opp.id}
                to={`/opportunities/${opp.id}`}
                className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card hover:shadow-card-hover hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      {opp.type}
                    </span>
                    <DeadlineBadge deadline={opp.deadline} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-brand-600 transition">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{opp.organization}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{opp.stipend || 'Apply Now'}</span>
                  <span className="text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs text-slate-500">
              No immediate closing deadlines found. Explore opportunities and bookmark them to receive deadline alerts!
            </p>
          </div>
        )}
      </section>

      {/* 3. Personalized Opportunities Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Matched against your branch (<span className="font-semibold">{user?.branch}</span>), year (<span className="font-semibold">{user?.year}</span>), and skills.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Explore all recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {recommendedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              showRecommendationBadge={true}
            />
          ))}
        </div>
      </section>

      {/* 4. Active Applications Quick View */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Active Application Pipeline
            </h2>
          </div>
          <Link
            to="/applications"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 3).map((app) => {
                const opp = opportunities.find((o) => o.id === app.opportunityId);
                return (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} size="sm" />
                        <span className="text-xs text-slate-400">
                          Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                      <Link
                        to={`/opportunities/${opp?.id || '#'}`}
                        className="text-sm font-bold text-slate-900 hover:text-brand-600 transition block"
                      >
                        {opp?.title || 'Tracked Application'}
                      </Link>
                      <p className="text-xs text-slate-500 font-medium">
                        {opp?.organization || 'Organization'} • {opp?.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to="/applications">
                        <Button variant="outline" size="sm">
                          Update Status
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3">
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't tracked any applications yet. When you apply to an internship or hackathon, add it here to track interview progress.
            </p>
            <Link to="/opportunities">
              <Button variant="outline" size="sm">
                Explore Listings
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
