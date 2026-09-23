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
  ArrowLeft,
  Share2,
  ShieldCheck,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Clock,
  AlertTriangle,
  Flame,
  FileText,
  Globe,
  Layers
} from 'lucide-react';
import OrganizationLogo from '../../components/common/OrganizationLogo';
import Button from '../../components/common/Button';
import ReportModal from '../../components/opportunities/ReportModal';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getDeadlineStatus } from '../../utils/dateUtils';
import { formatCompensation } from '../../utils/currencyUtils';
import { formatRelativeVerificationTime } from '../../services/opportunityAgent/freshnessEngine';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { opportunities, isSaved, toggleSave, addApplication, updateApplicationStatus, applications } = useOpportunities();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reportModalOpen, setReportModalOpen] = useState(false);

  const opportunity = (opportunities || []).find((o) => o.id === id);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (opportunity) {
      document.title = `${opportunity.title} at ${opportunity.organization || opportunity.company} — Torchbearer AI`;
    } else {
      document.title = 'Torchbearer AI — Opportunities Worth Chasing';
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
          The opportunity you are looking for may have expired or been updated in the catalog.
        </p>
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Opportunities</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(opportunity.id);
  const orgName = opportunity.organization || opportunity.company || 'Official Organization';
  const applyUrl = opportunity.applyUrl || opportunity.applicationUrl || opportunity.sourceUrl || '#';
  const workMode = opportunity.workMode || opportunity.mode || 'Remote';
  const lastVerified = opportunity.lastVerifiedAt || opportunity.last_verified_at;
  const deadlineInfo = getDeadlineStatus(opportunity.deadline || opportunity.applicationDeadline);

  const compensationDisplay = formatCompensation({
    stipend: opportunity.stipend,
    salary: opportunity.salary,
    prize: opportunity.prize,
    currency: opportunity.currency,
    country: opportunity.country,
    amount: opportunity.stipendAmount
  });

  const skills = Array.isArray(opportunity.skills)
    ? opportunity.skills
    : typeof opportunity.skills === 'string'
    ? opportunity.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const branches = Array.isArray(opportunity.targetBranches || opportunity.branches)
    ? opportunity.targetBranches || opportunity.branches
    : ['All Engineering Branches'];

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      addToast('Sign in to bookmark and track opportunities.', 'info');
      navigate(`/student/login?redirect=/opportunities/${opportunity.id}`);
      return;
    }
    const willBeSaved = toggleSave(opportunity.id);
    addToast(
      willBeSaved ? `Saved "${opportunity.title}"` : `Removed from saved`,
      willBeSaved ? 'success' : 'info'
    );
  };

  const handleShareClick = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${opportunity.title} — Torchbearer AI`,
          text: `Check out this opportunity at ${orgName} on Torchbearer AI:`,
          url: shareUrl
        });
        return;
      } catch (_) {}
    }
    navigator.clipboard.writeText(shareUrl);
    addToast('Opportunity link copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareClick}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className={`p-2 rounded-xl transition ${
              saved ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Save"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Report inaccurate listing"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <OrganizationLogo
              organization={orgName}
              logoUrl={opportunity.organizationLogo || opportunity.companyLogo || opportunity.imageUrl}
              websiteUrl={applyUrl}
              size="lg"
              shape="rounded-2xl"
              className="border border-slate-200/90 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {opportunity.type || opportunity.category || 'Opportunity'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {workMode}
                </span>
                {deadlineInfo.isClosingSoon && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    {deadlineInfo.label}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {opportunity.title}
              </h1>
              <div className="text-sm font-bold text-slate-600">
                {orgName}
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            {applyUrl && applyUrl !== '#' ? (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-xs text-slate-400 font-semibold">Direct Link Processing</span>
            )}
          </div>
        </div>

        {/* Verification & Source Provenance Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800">Verified Opportunity</span>
            <span>•</span>
            <span>Source: {opportunity.sourceName || 'Official Career Feed'}</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            {lastVerified ? `Last audited ${formatRelativeVerificationTime(lastVerified)}` : 'Audited recently'}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {compensationDisplay && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Compensation</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                {compensationDisplay}
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
              {opportunity.location || 'Remote'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Deadline</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
              {opportunity.deadline ? formatDate(opportunity.deadline) : 'Rolling / Open'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Duration</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
              {opportunity.duration || 'Flexible Term'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Eligibility, Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About the Opportunity</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
              {opportunity.description || opportunity.aiSummary}
            </p>
          </div>

          {/* Eligibility & Requirements */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Eligibility & Qualifications</h2>
            <div className="space-y-3 text-sm text-slate-600">
              {opportunity.eligibility && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Candidate Eligibility:</strong> {opportunity.eligibility}</span>
                </div>
              )}
              {opportunity.educationLevel && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Education Level:</strong> {opportunity.educationLevel}</span>
                </div>
              )}
              {opportunity.experienceRequired && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Experience:</strong> {opportunity.experienceRequired}</span>
                </div>
              )}
            </div>
          </div>

          {/* Required Skills */}
          {skills.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Technical Competencies & Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Important Guidelines & Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Application Guidelines
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />
                <span>Ensure your resume highlights the technical skills mentioned in the listing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />
                <span>Submit early before the official deadline ({opportunity.deadline ? formatDate(opportunity.deadline) : 'Open'}).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />
                <span>All applications are handled directly on the organization's official recruitment portal.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-100">
              {applyUrl && applyUrl !== '#' && (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
                >
                  <span>Proceed to Official Application</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        opportunity={opportunity}
      />
    </div>
  );
}
