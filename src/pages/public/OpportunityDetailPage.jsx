import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Bookmark,
  Send,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Award,
  BookOpen,
  DollarSign,
  Briefcase,
  GraduationCap,
  Clock,
  Trophy,
  AlertTriangle,
  Flame,
  Check,
  X,
  Lock,
  ChevronRight
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import DeadlineBadge from '../../components/opportunities/DeadlineBadge';
import OrganizationLogo from '../../components/common/OrganizationLogo';
import { resolveOrganizationIdentity } from '../../utils/organizationUtils';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ReportModal from '../../components/opportunities/ReportModal';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateUtils';
import { calculateOpportunityMatch } from '../../utils/recommendation';
import { MOCK_DEFAULT_STUDENT } from '../../data/mockOpportunities';

const TRACKING_STAGES = [
  { id: 'Saved', label: 'Saved', color: 'bg-slate-100 text-slate-700' },
  { id: 'Applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  { id: 'Assessment', label: 'Assessment / OA', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'Interview', label: 'Interview Scheduled', color: 'bg-amber-100 text-amber-700' },
  { id: 'Offer', label: 'Offer Received 🎉', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-100 text-rose-700' },
  { id: 'Withdrawn', label: 'Withdrawn', color: 'bg-slate-100 text-slate-500' }
];

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { opportunities, isSaved, toggleSave, addApplication, updateApplicationStatus, applications } = useOpportunities();
  const { addToast } = useToast();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Applied');
  const [appNotes, setAppNotes] = useState('');

  const opportunity = opportunities.find((o) => o.id === id);

  // Use student profile or fallback default profile for personalized recommendations
  const studentProfile = profile || MOCK_DEFAULT_STUDENT;
  const matchResult = opportunity ? calculateOpportunityMatch(opportunity, studentProfile) : null;

  const existingApp = opportunity ? applications.find((a) => a.opportunityId === opportunity.id) : null;

  useEffect(() => {
    if (existingApp) {
      setSelectedStatus(existingApp.status);
      setAppNotes(existingApp.notes || '');
    }
  }, [existingApp]);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (opportunity) {
      document.title = `${opportunity.title} at ${opportunity.organization} — Torchbearer AI`;
    } else {
      document.title = 'Torchbearer AI — Light the way to your future.';
    }
  }, [opportunity]);

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Opportunity Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The opportunity you are looking for may have expired or been removed.
        </p>
        <Link to="/opportunities">
          <Button variant="primary" size="md">
            Browse All Opportunities
          </Button>
        </Link>
      </div>
    );
  }

  const saved = isSaved(opportunity.id);

  const handleSave = () => {
    if (!isAuthenticated) {
      addToast('Please create a student account to save and track opportunities 🎓', 'info');
      navigate(`/student/signup?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const willBeSaved = toggleSave(opportunity.id);
    addToast(
      willBeSaved ? `Saved "${opportunity.title}" to bookmarks` : `Removed from bookmarks`,
      willBeSaved ? 'success' : 'info'
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      addToast('Create your free student account to unlock the official application link 🚀', 'info');
      navigate(`/student/signup?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (opportunity.applyUrl) {
      window.open(opportunity.applyUrl, '_blank', 'noopener,noreferrer');
      if (!existingApp) {
        addApplication(opportunity.id, 'Applied', 'Applied via official portal');
        addToast('Application recorded in your Tracker as "Applied"!', 'success');
      }
    } else {
      addToast('No official application link provided.', 'warning');
    }
  };

  const handleSaveTracking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/student/signup?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (existingApp) {
      updateApplicationStatus(existingApp.id, selectedStatus, appNotes);
    } else {
      addApplication(opportunity.id, selectedStatus, appNotes);
    }
    setTrackModalOpen(false);
    addToast(`Updated application stage to "${selectedStatus}"`, 'success');
  };

  // Check deadline days remaining
  const daysLeft = opportunity.deadline
    ? Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 shadow-subtle transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Report Issue</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Deadline Urgency Banner if closing within 7 days */}
      {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-yellow-200 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold">
              Applications closing soon! Only {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left to apply before the deadline on {formatDate(opportunity.deadline)}.
            </span>
          </div>
          <button
            onClick={handleApplyClick}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-yellow-50 transition"
          >
            <span>{isAuthenticated ? 'Apply Now' : 'Sign In to Apply'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start gap-5 max-w-3xl">
            {/* Organization Logo */}
            <OrganizationLogo
              organization={opportunity.organization || opportunity.company}
              logoUrl={opportunity.organizationLogo || opportunity.companyLogo || opportunity.imageUrl}
              websiteUrl={opportunity.applyUrl || opportunity.sourceUrl}
              size="xl"
              shape="rounded-2xl"
              className="border border-slate-200/90 shadow-sm mt-1"
            />

            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand" size="md">
                  {opportunity.type}
                </Badge>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {opportunity.mode}
                </span>
                <DeadlineBadge deadline={opportunity.deadline} />

                {opportunity.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Opportunity</span>
                  </span>
                )}

                {opportunity.isCollegeExclusive && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>College Exclusive</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>{opportunity.organization}</span>
                  {(opportunity.applyUrl || opportunity.sourceUrl) && (
                    <a
                      href={opportunity.applyUrl || opportunity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-[11px] font-bold text-brand-600 hover:text-brand-800 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{opportunity.location}</span>
                </div>
                {opportunity.stipend && (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <DollarSign className="w-4 h-4" />
                    <span>{opportunity.stipend}</span>
                  </div>
                )}
                {opportunity.prize && (
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>{opportunity.prize}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={ExternalLink}
              iconPosition="right"
              onClick={handleApplyClick}
              className="w-full justify-center shadow-md shadow-brand-500/20 font-bold"
            >
              {isAuthenticated ? 'Apply on Official Website' : 'Sign Up to Unlock Apply Link'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={saved ? 'soft' : 'outline'}
                size="md"
                icon={Bookmark}
                onClick={handleSave}
                className={saved ? 'text-brand-700' : ''}
              >
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant={existingApp ? 'primary' : 'outline'}
                size="md"
                icon={Send}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(`/student/signup?redirect=${encodeURIComponent(window.location.pathname)}`);
                  } else {
                    setTrackModalOpen(true);
                  }
                }}
              >
                {existingApp ? `Stage: ${existingApp.status}` : 'Track Status'}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Application Deadline</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              {formatDate(opportunity.deadline, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Target Branches</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1 truncate">
              {opportunity.targetBranches?.join(', ') || 'All Branches'}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Eligible Years</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              {opportunity.targetYears?.join(', ') || 'All Years'}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Live Verification</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Genuine
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Activity Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Verified by Torchbearer AI Integrity Engine • Anti-Scam Passed • Official Portal Linked</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span>🔥 High Student Demand</span>
          <span>•</span>
          <span>⚡ 180+ Views This Week</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GUEST ACCOUNT GATE: IF NOT LOGGED IN, SHOW GATE WALL      */}
      {/* ========================================================= */}
      {!isAuthenticated ? (
        <div className="relative rounded-3xl overflow-hidden border border-brand-200 shadow-2xl">
          {/* Blurred Background Preview of full details */}
          <div className="p-8 filter blur-md select-none pointer-events-none opacity-40 bg-slate-100 space-y-6">
            <div className="h-6 w-1/3 bg-slate-300 rounded-md" />
            <div className="h-24 w-full bg-slate-200 rounded-xl" />
            <div className="h-40 w-full bg-slate-200 rounded-xl" />
            <div className="h-32 w-full bg-slate-200 rounded-xl" />
          </div>

          {/* Floating High-Conversion Auth Card */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scale-up">
              <div className="w-14 h-14 bg-gradient-to-tr from-brand-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-brand-500/25">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Unlock Full Opportunity & Application Details
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Create your free student account in 30 seconds to access direct official application links, AI skill-match analysis, deadline alerts, and career roadmap tips.
                </p>
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">
                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-semibold">Official Application URL</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-semibold">AI Skill Match & Gap Matrix</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-semibold">Automated Deadline Tracker</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <GraduationCap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-semibold">Personalized Recommendations</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <Link
                  to={`/student/signup?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-700 hover:to-orange-600 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Free Student Account</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="text-xs text-slate-500">
                  <span>Already have an account? </span>
                  <Link
                    to={`/student/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* AUTHENTICATED DETAIL SECTIONS                             */
        /* ========================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Description, Responsibilities, Requirements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                About the Opportunity
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </div>

            {/* AI Advisor Prep Card */}
            {((opportunity.preparationTips && opportunity.preparationTips.length > 0) || (opportunity.aiSummary && opportunity.aiSummary !== opportunity.description)) && (
              <div className="bg-gradient-to-r from-brand-50/80 via-indigo-50/60 to-purple-50/80 rounded-3xl border border-brand-200/80 p-6 sm:p-8 shadow-card space-y-4">
                <div className="flex items-center gap-2 text-brand-900 pb-2 border-b border-brand-200/50">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <h2 className="text-lg font-black tracking-tight">AI Preparation & Application Strategy</h2>
                  <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-200/80 text-brand-900 font-mono">
                    {opportunity.aiModel || 'z-ai/glm-5.3-free'}
                  </span>
                </div>
                {opportunity.aiSummary && opportunity.aiSummary !== opportunity.description && (
                  <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white/80 p-4 rounded-2xl border border-brand-100">
                    💡 {opportunity.aiSummary}
                  </p>
                )}
                {Array.isArray(opportunity.preparationTips) && opportunity.preparationTips.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-950">Recommended Preparation:</h3>
                    <ul className="space-y-2">
                      {opportunity.preparationTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white/70 p-3 rounded-xl border border-brand-100">
                          <span className="font-black text-brand-600 flex-shrink-0">0{idx + 1}.</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Responsibilities */}
            {(() => {
              const safeResp = Array.isArray(opportunity.responsibilities)
                ? opportunity.responsibilities
                : typeof opportunity.responsibilities === 'string'
                ? opportunity.responsibilities.split('\n').map((r) => r.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
                : [];

              if (safeResp.length === 0) return null;

              return (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                    Key Responsibilities & Deliverables
                  </h2>
                  <ul className="space-y-2.5">
                    {safeResp.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Requirements & Eligibility */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Eligibility & Prerequisites
              </h2>
              <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                🎓 {opportunity.eligibility || 'Open to all college students'}
              </p>

              {(() => {
                const safeReqs = Array.isArray(opportunity.requirements)
                  ? opportunity.requirements
                  : typeof opportunity.requirements === 'string'
                  ? opportunity.requirements.split('\n').map((r) => r.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
                  : [];

                if (safeReqs.length === 0) return null;

                return (
                  <ul className="space-y-2.5 pt-2">
                    {safeReqs.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>

            {/* Benefits & Perks */}
            {(() => {
              const safeBenefits = Array.isArray(opportunity.benefits)
                ? opportunity.benefits
                : typeof opportunity.benefits === 'string'
                ? opportunity.benefits.split('\n').map((b) => b.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
                : [];

              if (safeBenefits.length === 0) return null;

              return (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Benefits & Perks
                  </h2>
                  <ul className="space-y-2.5">
                    {safeBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Application Process */}
            {opportunity.applicationProcess && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
                <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Application & Selection Process
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed bg-brand-50/50 p-4 rounded-2xl border border-brand-100 text-brand-950 font-medium">
                  {opportunity.applicationProcess}
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar (1 Col): Match & Skill Gap Analysis, Required Skills, Source Trust Card */}
          <div className="space-y-6">
            {/* Personalized Match & Skill Gap Breakdown */}
            {matchResult && (
              <div className="bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm tracking-wide">Match Analysis</h3>
                  </div>
                  <div className="text-xl font-black bg-white/10 px-3 py-1 rounded-xl text-amber-300 border border-white/10">
                    {matchResult.score}%
                  </div>
                </div>

                {/* Match reasons */}
                {Array.isArray(matchResult.reasons || matchResult.matchReasons) && (
                  <div className="space-y-1 text-xs text-slate-200">
                    {(matchResult.reasons || matchResult.matchReasons || []).map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skill Gap Matrix */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  {Array.isArray(matchResult.matchedSkills) && matchResult.matchedSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] uppercase font-bold text-emerald-300">
                        Your Matched Skills ({matchResult.matchedSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {matchResult.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(matchResult.missingSkills) && matchResult.missingSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] uppercase font-bold text-rose-300">
                        Skills to Learn ({matchResult.missingSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {matchResult.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-200 border border-rose-400/30"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Required Skills */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(opportunity.skills)
                  ? opportunity.skills
                  : typeof opportunity.skills === 'string'
                  ? opportunity.skills.split(',').map((s) => s.trim()).filter(Boolean)
                  : []
                ).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust & Source Verification Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Source & Verification
              </h3>
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1 text-xs text-slate-700">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
                  <span>✓ Verified by Torchbearer AI</span>
                </p>
                <p className="text-slate-500">
                  Source: <span className="font-semibold text-slate-800">{opportunity.sourceName || 'Official Portal'}</span>
                </p>
                <p className="text-slate-400 text-[11px]">
                  Last checked: {formatDate(opportunity.lastVerifiedAt || opportunity.createdAt)}
                </p>
              </div>
              {opportunity.sourceUrl && (
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <span>View original post / careers portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Sticky Quick Apply Banner */}
            <div className="bg-gradient-to-br from-brand-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <h3 className="text-base font-bold">Ready to apply?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Applications are reviewed on a rolling basis. Ensure your portfolio and resume are up-to-date before submitting.
              </p>
              <Button
                variant="primary"
                size="md"
                icon={ExternalLink}
                iconPosition="right"
                onClick={handleApplyClick}
                className="w-full justify-center bg-brand-500 hover:bg-brand-600 text-white font-bold"
              >
                Apply on Official Website
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application Status Tracker Modal with 7 Stages */}
      <Modal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        title="Track Application Status"
        subtitle={`Update your pipeline stage for ${opportunity.title}`}
      >
        <form onSubmit={handleSaveTracking} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Application Pipeline Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRACKING_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStatus(stage.id)}
                  className={`text-xs py-2 px-3 rounded-xl font-semibold border transition text-center ${
                    selectedStatus === stage.id
                      ? 'bg-brand-50 text-brand-700 border-brand-300 ring-2 ring-brand-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Personal Notes / Next Steps
            </label>
            <textarea
              rows={3}
              value={appNotes}
              onChange={(e) => setAppNotes(e.target.value)}
              placeholder="e.g. Submitted on portal, waiting for Round 1 assessment on Oct 2nd..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setTrackModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Tracker Stage
            </Button>
          </div>
        </form>
      </Modal>

      {/* Interactive Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        opportunity={opportunity}
      />
    </div>
  );
}

