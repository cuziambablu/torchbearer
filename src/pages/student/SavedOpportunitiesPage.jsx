import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Compass, ArrowRight } from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';

export default function SavedOpportunitiesPage() {
  const { opportunities, savedIds, toggleSave } = useOpportunities();
  const { addToast } = useToast();

  const savedOpportunities = opportunities.filter((o) => savedIds.includes(o.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-torch-600 fill-torch-100" />
            <span className="text-xs font-bold uppercase tracking-wider text-torch-600">
              Saved Bookmarks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bookmarked Opportunities ({savedOpportunities.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review and track opportunities you've saved for application.
          </p>
        </div>

        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More</span>
        </Link>
      </div>

      {savedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved opportunities yet"
          description="Click the bookmark icon on any opportunity card across Torchbearer AI to save it here."
          actionLabel="Explore Opportunities"
          actionHref="/opportunities"
        />
      )}
    </div>
  );
}
