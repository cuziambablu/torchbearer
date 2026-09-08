import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Flame,
  Calendar,
  Building,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  Bookmark
} from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';
import DeadlineBadge from '../../components/opportunities/DeadlineBadge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export default function DeadlineCenterPage() {
  const { opportunities, savedIds, applications, isSaved, toggleSave } = useOpportunities();
  const { addToast } = useToast();
  const [filterSource, setFilterSource] = useState('all'); // 'all' | 'saved' | 'applied'

  const categorizedDeadlines = useMemo(() => {
    const now = new Date();
    // Normalize today's date boundary
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const startOfNextDay = new Date(startOfTomorrow.getTime() + 86400000);
    const endOfWeek = new Date(startOfToday.getTime() + 86400000 * 7);
    const endOfNextWeek = new Date(startOfToday.getTime() + 86400000 * 14);

    const buckets = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      nextWeek: [],
      later: []
    };

    const targetList = opportunities.filter((opp) => {
      if (opp.status !== 'published') return false;
      if (!opp.deadline) return false;

      if (filterSource === 'saved') return savedIds.includes(opp.id);
      if (filterSource === 'applied') return applications.some((a) => a.opportunityId === opp.id);
      return true;
    });

    targetList.forEach((opp) => {
      const deadlineDate = new Date(opp.deadline);
      if (deadlineDate < startOfToday) {
        // Expired, excluded from active deadline buckets
        return;
      }

      if (deadlineDate < startOfTomorrow) {
        buckets.today.push(opp);
      } else if (deadlineDate < startOfNextDay) {
        buckets.tomorrow.push(opp);
      } else if (deadlineDate <= endOfWeek) {
        buckets.thisWeek.push(opp);
      } else if (deadlineDate <= endOfNextWeek) {
        buckets.nextWeek.push(opp);
      } else {
        buckets.later.push(opp);
      }
    });

    // Sort each bucket by earliest deadline
    Object.keys(buckets).forEach((k) => {
      buckets[k].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    });

    return buckets;
  }, [opportunities, savedIds, applications, filterSource]);

  const totalActive =
    categorizedDeadlines.today.length +
    categorizedDeadlines.tomorrow.length +
    categorizedDeadlines.thisWeek.length +
    categorizedDeadlines.nextWeek.length +
    categorizedDeadlines.later.length;

  const sections = [
    {
      id: 'today',
      title: 'Closing Today',
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
      items: categorizedDeadlines.today,
      desc: 'Applications close in less than 24 hours. Submit immediately!'
    },
    {
      id: 'tomorrow',
      title: 'Closing Tomorrow',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      items: categorizedDeadlines.tomorrow,
      desc: 'Last day to finalize your resume and portfolio.'
    },
    {
      id: 'thisWeek',
      title: 'Closing This Week (< 7 Days)',
      icon: Calendar,
      color: 'text-brand-600 bg-brand-50 border-brand-200',
      badge: 'bg-brand-100 text-brand-800',
      items: categorizedDeadlines.thisWeek,
      desc: 'Approaching application deadlines in the next 7 days.'
    },
    {
      id: 'nextWeek',
      title: 'Closing Next Week (7–14 Days)',
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
      items: categorizedDeadlines.nextWeek,
      desc: 'Good window to prepare project submissions and essays.'
    },
    {
      id: 'later',
      title: 'Upcoming & Open (> 14 Days)',
      icon: Calendar,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
      badge: 'bg-slate-100 text-slate-800',
      items: categorizedDeadlines.later,
      desc: 'Active registrations with plenty of preparation time.'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Urgency & Timeline Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Opportunity Deadline Center ({totalActive})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay ahead of registration deadlines categorized by urgency with automatic time zone synchronization.
          </p>
        </div>

        {/* Source filter tabs */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-subtle">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'saved', label: `Saved (${savedIds.length})` },
            { id: 'applied', label: `Applied (${applications.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSource(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterSource === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadline Sections */}
      {totalActive === 0 ? (
        <EmptyState
          icon={Clock}
          title="No active deadlines matching your filter"
          description="Explore opportunities and bookmark them to keep track of upcoming deadlines."
          actionLabel="Explore Opportunities"
          onAction={() => window.location.assign('/student/opportunities')}
        />
      ) : (
        <div className="space-y-8">
          {sections.map((sec) => {
            if (sec.items.length === 0) return null;
            const Icon = sec.icon;

            return (
              <div key={sec.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${sec.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{sec.title}</h2>
                      <p className="text-xs text-slate-500">{sec.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sec.badge}`}>
                    {sec.items.length} {sec.items.length === 1 ? 'opportunity' : 'opportunities'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sec.items.map((opp) => {
                    const saved = isSaved(opp.id);
                    return (
                      <div
                        key={opp.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {opp.type}
                            </span>
                            <DeadlineBadge deadline={opp.deadline} />
                          </div>

                          <Link
                            to={`/student/opportunities/${opp.id}`}
                            className="text-sm font-bold text-slate-900 hover:text-brand-600 line-clamp-2 transition leading-snug"
                          >
                            {opp.title}
                          </Link>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{opp.organization}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="text-[11px] font-bold text-slate-700 truncate">
                            {opp.stipend || opp.prize || 'Perks & Vouchers'}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                toggleSave(opp.id);
                                addToast(saved ? 'Removed from saved' : 'Bookmarked opportunity', 'info');
                              }}
                              className={`p-1.5 rounded-lg border transition ${
                                saved
                                  ? 'bg-brand-50 border-brand-200 text-brand-600'
                                  : 'border-slate-200 text-slate-400 hover:text-slate-700'
                              }`}
                              title={saved ? 'Unsave' : 'Save'}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                            </button>

                            <Link
                              to={`/student/opportunities/${opp.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                            >
                              <span>Apply</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
