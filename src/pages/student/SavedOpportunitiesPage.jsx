import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Trash2, ExternalLink, ArrowRight, Compass } from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';

export default function SavedOpportunitiesPage() {
  const { opportunities, savedIds, toggleSave, addApplication } = useOpportunities();
  const { addToast } = useToast();

  const savedOpportunities = opportunities.filter((o) => savedIds.includes(o.id));

  const handleRemove = (e, id, title) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(id);
    addToast(`Removed "${title}" from saved list`, 'info');
  };

  const handleApply = (opp) => {
    if (opp.applyUrl) {
      window.open(opp.applyUrl, '_blank', 'noopener,noreferrer');
      addApplication(opp.id, 'Applied', 'Applied from Saved list');
      addToast(`Recorded application for ${opp.title}`, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-brand-600 fill-brand-100" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Saved Bookmarks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved Opportunities ({savedOpportunities.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of upcoming deadlines and opportunities you intend to apply for.
          </p>
        </div>

        <Link to="/opportunities">
          <Button variant="outline" size="sm" icon={Compass}>
            Discover More
          </Button>
        </Link>
      </div>

      {/* Grid of Saved Opportunities */}
      {savedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp) => (
            <div key={opp.id} className="relative group">
              <OpportunityCard opportunity={opp} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved opportunities yet"
          description="You haven't bookmarked any opportunities. Browse internships, hackathons, and scholarships and click the bookmark icon to save them."
          actionLabel="Explore Opportunities"
          onAction={() => window.location.assign('/opportunities')}
        />
      )}
    </div>
  );
}
