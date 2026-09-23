import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  MapPin,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  Share2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import OrganizationLogo from '../common/OrganizationLogo';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getDeadlineStatus } from '../../utils/dateUtils';
import { formatCompensation } from '../../utils/currencyUtils';
import { formatRelativeVerificationTime } from '../../services/opportunityAgent/freshnessEngine';

export default function OpportunityCard({ opportunity, showRecommendationBadge = false }) {
  const { isSaved, toggleSave } = useOpportunities();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!opportunity) return null;

  const saved = isSaved(opportunity.id);
  const workMode = opportunity.workMode || opportunity.mode || 'Remote';
  const lastVerified = opportunity.lastVerifiedAt || opportunity.last_verified_at;
  const deadlineInfo = getDeadlineStatus(opportunity.deadline || opportunity.applicationDeadline);

  const orgName = opportunity.organization || opportunity.company || 'Official Organization';
  const applyUrl = opportunity.applyUrl || opportunity.applicationUrl || opportunity.sourceUrl || '#';
  const rawSkills = Array.isArray(opportunity.skills)
    ? opportunity.skills
    : typeof opportunity.skills === 'string'
    ? opportunity.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const displaySkills = rawSkills.slice(0, 3);
  const remainingSkillsCount = rawSkills.length - displaySkills.length;

  const compensationDisplay = formatCompensation({
    stipend: opportunity.stipend,
    salary: opportunity.salary,
    prize: opportunity.prize,
    currency: opportunity.currency,
    country: opportunity.country,
    amount: opportunity.stipendAmount
  });

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast('Sign in to bookmark and track opportunities.', 'info');
      navigate('/student/login?redirect=/opportunities/' + opportunity.id);
      return;
    }

    const willBeSaved = toggleSave(opportunity.id);
    addToast(
      willBeSaved
        ? 'Saved "' + opportunity.title + '" to bookmarks'
        : 'Removed "' + opportunity.title + '" from saved',
      willBeSaved ? 'success' : 'info'
    );
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = window.location.origin + '/opportunities/' + opportunity.id;
    if (navigator.share) {
      try {
        await navigator.share({
          title: opportunity.title + ' — Torchbearer AI',
          text: 'Check out this opportunity at ' + orgName + ' on Torchbearer AI:',
          url: shareUrl
        });
        return;
      } catch (_) {}
    }

    navigator.clipboard.writeText(shareUrl);
    addToast('Opportunity link copied to clipboard!', 'success');
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Internship':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Hackathon':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Job':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Scholarship':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      case 'Fellowship':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'Research':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Competition':
      case 'Coding Contests':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Open Source':
        return 'bg-orange-50 text-orange-800 border-orange-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Optional Top Recommendation Match Bar */}
      {showRecommendationBadge && opportunity.matchScore && (
        <div className="bg-slate-900 px-4 py-1.5 text-white flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{opportunity.matchScore}% Match Signal</span>
          </span>
          <span className="text-[11px] text-slate-300 truncate max-w-[180px]">
            {opportunity.matchReasons?.[0] || 'High Profile Alignment'}
          </span>
        </div>
      )}

      {/* Main Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={'text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ' + getTypeStyle(opportunity.type || opportunity.category)}>
              {opportunity.type || opportunity.category || 'Opportunity'}
            </span>

            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
              {workMode}
            </span>

            {/* Smart Urgency Pill */}
            {deadlineInfo.isClosingSoon && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                {deadlineInfo.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShareClick}
              aria-label="Share opportunity"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              aria-label={saved ? 'Remove from bookmarks' : 'Save opportunity'}
              className={'p-1.5 rounded-lg transition ' + (saved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100')}
              title={saved ? 'Saved' : 'Bookmark'}
            >
              <Bookmark className={'w-4 h-4 ' + (saved ? 'fill-current text-amber-600' : '')} />
            </button>
          </div>
        </div>

        {/* Opportunity Header: Logo + Title + Org */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <OrganizationLogo
            organization={orgName}
            logoUrl={opportunity.organizationLogo || opportunity.companyLogo || opportunity.imageUrl}
            websiteUrl={applyUrl}
            size="md"
            shape="rounded-xl"
            className="flex-shrink-0 mt-0.5 border border-slate-200/90 shadow-2xs"
          />

          <div className="flex-1 min-w-0">
            <Link
              to={'/opportunities/' + opportunity.id}
              className="block group-hover:text-amber-600 transition-colors"
            >
              <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight line-clamp-2">
                {opportunity.title}
              </h3>
            </Link>
            <div className="text-xs text-slate-600 font-semibold mt-0.5 truncate">
              {orgName}
            </div>
          </div>
        </div>

        {/* Key Info: Location + Compensation */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate max-w-[150px]">{opportunity.location || 'Remote'}</span>
          </div>

          {compensationDisplay && (
            <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-200/80">
              <IndianRupee className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{compensationDisplay}</span>
            </div>
          )}
        </div>

        {/* Short Summary Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1 font-normal">
          {opportunity.aiSummary || opportunity.description}
        </p>

        {/* Skills & Eligibility Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {opportunity.eligibility && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 truncate max-w-[200px]">
              🎓 {opportunity.eligibility}
            </span>
          )}

          {displaySkills.map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60"
            >
              {skill}
            </span>
          ))}

          {remainingSkillsCount > 0 && (
            <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
              +{remainingSkillsCount}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Verification Status + Dual CTAs */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">
              {lastVerified ? 'Verified ' + formatRelativeVerificationTime(lastVerified) : 'Verified source'}
            </span>
          </div>
          {opportunity.deadline && (
            <div className="text-[10px] text-slate-400 font-medium">
              Deadline: {deadlineInfo.label}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={'/opportunities/' + opportunity.id}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 transition"
          >
            Details
          </Link>

          {applyUrl && applyUrl !== '#' ? (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <Link
              to={'/opportunities/' + opportunity.id}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              <span>View</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
