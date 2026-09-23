import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Share2,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import { formatCompensation } from '../../utils/currencyUtils';

export default function OpportunityCard({ opportunity, showMatchScore = false, matchScore = null }) {
  const { isSaved, toggleSave } = useOpportunities();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!opportunity) return null;

  const saved = isSaved(opportunity.id);

  // Formatting helpers
  const orgName = opportunity.organization || opportunity.company || 'Verified Organization';
  const title = opportunity.title || 'Untitled Opportunity';
  const category = opportunity.category || opportunity.type || 'Internship';
  const location = opportunity.location || (opportunity.is_remote ? 'Remote' : 'India');
  const deadline = opportunity.deadline;
  const verifiedAt = opportunity.last_verified_at || opportunity.verified_at;

  // Compute urgency
  const getUrgency = () => {
    if (!deadline) return { label: 'Open', color: 'bg-slate-100 text-slate-700' };
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return { label: 'Closed', color: 'bg-slate-100 text-slate-500' };
    if (days <= 2) return { label: 'Closing Soon', color: 'bg-red-50 text-red-700 border border-red-200' };
    if (days <= 7) return { label: `${days}d left`, color: 'bg-amber-50 text-amber-800 border border-amber-200' };
    return { label: `${days}d left`, color: 'bg-slate-100 text-slate-700' };
  };

  const urgency = getUrgency();

  // Compute relative verification string
  const getRelativeVerification = () => {
    if (!verifiedAt) return 'Recently verified';
    const diffHours = Math.max(1, Math.round((Date.now() - new Date(verifiedAt).getTime()) / (1000 * 60 * 60)));
    if (diffHours < 24) return `Verified ${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    return `Verified ${diffDays}d ago`;
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}`;
    if (navigator.share) {
      navigator.share({ title, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stipendDisplay = formatCompensation(opportunity.stipend || opportunity.salary || opportunity.reward);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-torch-400 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between">
      <div>
        {/* Header: Logo, Org & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Org Logo / Avatar */}
            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-torch-300 transition-colors">
              {opportunity.logo_url && !imageError ? (
                <img
                  src={opportunity.logo_url}
                  alt={orgName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#FF2400]/10 via-[#FF7300]/10 to-[#FFC400]/20 flex items-center justify-center text-sm font-extrabold text-torch-700">
                  {orgName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[170px]">
                {orgName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {getRelativeVerification()}
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions: Match Score / Urgency / Save */}
          <div className="flex items-center gap-1.5">
            {showMatchScore && matchScore && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-torch-gradient text-white rounded-md shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {matchScore}% Match
              </span>
            )}

            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${urgency.color}`}>
              {urgency.label}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(opportunity.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                saved
                  ? 'bg-torch-50 border-torch-200 text-torch-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={saved ? 'Remove Bookmark' : 'Save Opportunity'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-torch-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/opportunities/${opportunity.id}`} className="block group-hover:text-torch-600 transition-colors">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>

        {/* Metadata Chips: Category, Mode, Location */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 mb-4">
          <span className="px-2 py-0.5 bg-slate-100 font-medium rounded-md text-slate-700">
            {category}
          </span>
          <span className="px-2 py-0.5 bg-slate-100 font-medium rounded-md text-slate-600 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {location}
          </span>
        </div>
      </div>

      {/* Footer: Stipend + Action CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-medium">Stipend / Value</p>
          <p className="text-xs font-bold text-slate-900 flex items-center gap-0.5">
            <IndianRupee className="w-3 h-3 text-slate-500" />
            <span>{stipendDisplay}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <Link
            to={`/opportunities/${opportunity.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 group-hover:bg-torch-gradient rounded-lg transition-all shadow-xs"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
