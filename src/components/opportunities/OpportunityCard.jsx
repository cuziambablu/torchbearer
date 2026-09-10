import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  MapPin,
  Building2,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Trophy,
  DollarSign,
  GraduationCap,
  Clock,
  Flame,
  CheckCircle2,
  Share2
} from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from './DeadlineBadge';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getDeadlineStatus } from '../../utils/dateUtils';
import { MOCK_DEFAULT_STUDENT } from '../../data/mockOpportunities';
import { formatRelativeVerificationTime } from '../../services/opportunityAgent/freshnessEngine';

export default function OpportunityCard({ opportunity, showRecommendationBadge = false }) {
  const { isSaved, toggleSave } = useOpportunities();
  const { addToast } = useToast();
  const { profile } = useAuth();

  const studentProfile = profile || MOCK_DEFAULT_STUDENT;
  const userSkills = Array.isArray(studentProfile?.skills)
    ? studentProfile.skills.map((s) => String(s).toLowerCase())
    : typeof studentProfile?.skills === 'string'
    ? studentProfile.skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  const saved = isSaved(opportunity.id);
  const workMode = opportunity.workMode || opportunity.mode || 'Remote';
  const verificationScore = opportunity.verificationScore || opportunity.verification_score;
  const lastVerified = opportunity.lastVerifiedAt || opportunity.last_verified_at;
  const deadlineInfo = getDeadlineStatus(opportunity.deadline);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willBeSaved = toggleSave(opportunity.id);
    addToast(
      willBeSaved
        ? `Saved "${opportunity.title}" to your bookmarks`
        : `Removed "${opportunity.title}" from saved`,
      willBeSaved ? 'success' : 'info'
    );
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Internship':
        return { badge: 'brand', text: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200' };
      case 'Hackathon':
        return { badge: 'purple', text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' };
      case 'Job':
        return { badge: 'emerald', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case 'Scholarship':
        return { badge: 'success', text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' };
      case 'Fellowship':
        return { badge: 'warning', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'Competition':
        return { badge: 'indigo', text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' };
      case 'Research':
        return { badge: 'sky', text: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' };
      default:
        return { badge: 'default', text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const typeConfig = getTypeStyle(opportunity.type);
  const rawSkills = Array.isArray(opportunity.skills)
    ? opportunity.skills
    : typeof opportunity.skills === 'string'
    ? opportunity.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const displaySkills = rawSkills.slice(0, 3);
  const remainingSkillsCount = rawSkills.length - displaySkills.length;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-brand-400/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1">
      {/* Top recommendation highlight banner if applicable */}
      {showRecommendationBadge && opportunity.matchScore && (
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 px-4 py-1.5 text-white flex items-center justify-between text-xs font-bold tracking-wide">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            {opportunity.matchScore}% Match for you
          </span>
          <span className="text-[11px] opacity-90 truncate max-w-[170px] font-medium">
            {opportunity.matchReasons?.[0] || 'Top Student Fit'}
          </span>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Top Meta Bar: Badges + Save Button */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
              {opportunity.type}
            </span>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {workMode}
            </span>

            {opportunity.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>{verificationScore ? `${verificationScore}% Verified` : 'Verified'}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
              saved
                ? 'bg-brand-50 text-brand-600 hover:bg-brand-100 ring-2 ring-brand-300/60 scale-105'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-brand-600' : ''}`} />
          </button>
        </div>

        {/* Opportunity Title & Organization */}
        <div className="mb-3 space-y-1">
          <Link
            to={`/opportunities/${opportunity.id}`}
            className="block group-hover:text-brand-600 transition-colors"
          >
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight line-clamp-2">
              {opportunity.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{opportunity.organization}</span>
          </div>
        </div>

        {/* Location & Compensation / Prize */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3.5">
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span className="truncate max-w-[140px]">{opportunity.location}</span>
          </div>

          {opportunity.stipend && (
            <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/60 truncate">
              <DollarSign className="w-3 h-3 flex-shrink-0" />
              <span>{opportunity.stipend}</span>
            </div>
          )}

          {opportunity.prize && !opportunity.stipend && (
            <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 truncate">
              <Trophy className="w-3 h-3 flex-shrink-0" />
              <span>{opportunity.prize}</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {opportunity.aiSummary || opportunity.description}
        </p>

        {/* Skills Pills */}
        {displaySkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {displaySkills.map((skill, i) => {
              const isMatched = userSkills.includes(skill.toLowerCase());
              return (
                <span
                  key={i}
                  className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition ${
                    isMatched
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 font-bold'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
            {remainingSkillsCount > 0 && (
              <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5">
                +{remainingSkillsCount} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Deadline + CTA Link */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <DeadlineBadge deadline={opportunity.deadline} />
          {lastVerified && (
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              Verified {formatRelativeVerificationTime(lastVerified)}
            </span>
          )}
        </div>

        <Link
          to={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition group-hover:translate-x-0.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
