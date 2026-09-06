import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Building, Sparkles, ExternalLink, ArrowRight, DollarSign, Calendar } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from './DeadlineBadge';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

export default function OpportunityCard({ opportunity, showRecommendationBadge = false }) {
  const { isSaved, toggleSave } = useOpportunities();
  const { addToast } = useToast();

  const saved = isSaved(opportunity.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willBeSaved = toggleSave(opportunity.id);
    addToast(
      willBeSaved ? `Saved "${opportunity.title}" to your bookmarks` : `Removed "${opportunity.title}" from saved`,
      willBeSaved ? 'success' : 'info'
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Internship':
        return 'brand';
      case 'Hackathon':
        return 'purple';
      case 'Competition':
        return 'indigo';
      case 'Scholarship':
        return 'success';
      case 'Workshop':
        return 'sky';
      case 'Fellowship':
        return 'warning';
      case 'Placement':
        return 'purple';
      case 'Certification':
        return 'brand';
      default:
        return 'default';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top recommendation highlight banner if applicable */}
      {showRecommendationBadge && opportunity.matchScore && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-1.5 text-white flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {opportunity.matchScore}% Match for you
          </span>
          <span className="text-[11px] opacity-90 truncate max-w-[170px]">
            {opportunity.matchReasons?.[0] || 'Top Student Fit'}
          </span>
        </div>
      )}

      {/* Main Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Type Badge & Save Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getTypeColor(opportunity.type)} size="sm">
              {opportunity.type}
            </Badge>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {opportunity.mode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-2 rounded-xl transition-all ${
              saved
                ? 'bg-brand-50 text-brand-600 hover:bg-brand-100 ring-1 ring-brand-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Opportunity Title */}
        <Link to={`/opportunities/${opportunity.id}`} className="block group-hover:text-brand-600 transition">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-1">
            {opportunity.title}
          </h3>
        </Link>

        {/* Organization & Location */}
        <div className="space-y-1 mb-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{opportunity.organization}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {opportunity.description}
        </p>

        {/* Skills Chips */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {opportunity.skills.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                +{opportunity.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Stipend, Deadline & Action Button */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          {opportunity.stipend && (
            <div className="text-xs font-bold text-slate-900 truncate">
              {opportunity.stipend}
            </div>
          )}
          <div className="mt-0.5">
            <DeadlineBadge deadline={opportunity.deadline} />
          </div>
        </div>

        <Link
          to={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-white hover:bg-brand-50 text-brand-600 border border-slate-200 hover:border-brand-200 shadow-subtle transition-all active:scale-95 flex-shrink-0"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
