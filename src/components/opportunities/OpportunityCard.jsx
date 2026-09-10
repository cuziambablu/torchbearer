import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  MapPin,
  Building,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Trophy,
  GraduationCap
} from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from './DeadlineBadge';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateUtils';
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'Internship':
        return 'brand';
      case 'Hackathon':
        return 'purple';
      case 'Job':
        return 'emerald';
      case 'Freelance':
        return 'amber';
      case 'Scholarship':
        return 'success';
      case 'Fellowship':
        return 'warning';
      case 'Competition':
        return 'indigo';
      case 'Research':
        return 'sky';
      case 'Workshop':
        return 'indigo';
      case 'Certification':
        return 'brand';
      case 'Open Source':
        return 'teal';
      case 'Campus Exclusive':
      case 'Placement':
        return 'purple';
      case 'Career Event':
        return 'rose';
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
        {/* Header: Type Badge, Verification Badge & Save Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={getTypeColor(opportunity.type)} size="sm">
              {opportunity.type}
            </Badge>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {workMode}
            </span>

            {opportunity.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{verificationScore ? `Verified ${verificationScore}%` : 'Verified'}</span>
              </span>
            )}

            {lastVerified && (
              <span className="text-[10px] text-slate-400 font-medium">
                {formatRelativeVerificationTime(lastVerified)}
              </span>
            )}

            {opportunity.isCollegeExclusive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80">
                <GraduationCap className="w-3 h-3 text-purple-600" />
                <span>College Exclusive</span>
              </span>
            )}
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

        {/* Organization, Source & Location */}
        <div className="space-y-1 mb-3 text-xs text-slate-500">
          <div className="flex items-center justify-between gap-1 font-medium text-slate-700">
            <div className="flex items-center gap-1.5 truncate">
              <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{opportunity.organization}</span>
            </div>
            {opportunity.sourceName && (
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                via {opportunity.sourceName}
              </span>
            )}
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
        {(() => {
          const safeSkills = Array.isArray(opportunity.skills)
            ? opportunity.skills
            : typeof opportunity.skills === 'string'
            ? opportunity.skills.split(',').map((s) => s.trim()).filter(Boolean)
            : [];

          if (safeSkills.length === 0) return null;

          return (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {safeSkills.slice(0, 3).map((skill, index) => {
                const isMatched = userSkills.includes(String(skill).toLowerCase());
                return (
                  <span
                    key={index}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isMatched && <span className="mr-0.5 text-emerald-600">✓</span>}
                    {skill}
                  </span>
                );
              })}
              {safeSkills.length > 3 && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                  +{safeSkills.length - 3}
                </span>
              )}
            </div>
          );
        })()}
      </div>

      {/* Card Footer: Stipend / Prize, Deadline & Action Button */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          {opportunity.stipend ? (
            <div className="text-xs font-bold text-slate-900 truncate">
              {opportunity.stipend}
            </div>
          ) : opportunity.prize ? (
            <div className="text-xs font-bold text-amber-700 truncate flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-600" />
              <span className="truncate">{opportunity.prize}</span>
            </div>
          ) : (
            <div className="text-xs font-medium text-slate-500 truncate">Certificate & Perks</div>
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
