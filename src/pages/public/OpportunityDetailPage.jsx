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
  Award,
  BookOpen,
  DollarSign,
  Briefcase,
  GraduationCap,
  Clock,
  Trophy
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import DeadlineBadge from '../../components/opportunities/DeadlineBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateUtils';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { opportunities, isSaved, toggleSave, addApplication, applications } = useOpportunities();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Applied');
  const [appNotes, setAppNotes] = useState('');

  const opportunity = opportunities.find((o) => o.id === id);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (opportunity) {
      document.title = `${opportunity.title} at ${opportunity.organization} — CampusLaunch`;
    }
    return () => {
      document.title = 'CampusLaunch — Discover. Apply. Grow.';
    };
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
  const existingApp = applications.find((a) => a.opportunityId === opportunity.id);

  const handleSave = () => {
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
    if (opportunity.applyUrl) {
      window.open(opportunity.applyUrl, '_blank', 'noopener,noreferrer');
      if (!existingApp) {
        addApplication(opportunity.id, 'Applied', 'Applied via official portal');
        addToast('Application recorded in your Tracker!', 'success');
      }
    } else {
      addToast('No official application link provided.', 'warning');
    }
  };

  const handleSaveTracking = (e) => {
    e.preventDefault();
    addApplication(opportunity.id, selectedStatus, appNotes);
    setTrackModalOpen(false);
    addToast(`Updated application status to ${selectedStatus}`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3 max-w-3xl">
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
              <div className="flex items-center gap-1.5 text-slate-800">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>{opportunity.organization}</span>
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
              Apply on Official Website
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
                variant="outline"
                size="md"
                icon={Send}
                onClick={() => setTrackModalOpen(true)}
              >
                {existingApp ? `Status: ${existingApp.status}` : 'Track Status'}
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
            <p className="text-[11px] font-bold text-slate-400 uppercase">Verified Freshness</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Verified Active
            </p>
          </div>
        </div>
      </div>

      {/* Detail Sections Layout */}
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

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Key Responsibilities & Deliverables
              </h2>
              <ul className="space-y-2.5">
                {opportunity.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Eligibility */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              Eligibility & Prerequisites
            </h2>
            <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              🎓 {opportunity.eligibility}
            </p>

            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <ul className="space-y-2.5 pt-2">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Benefits & Perks */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Benefits & Perks
              </h2>
              <ul className="space-y-2.5">
                {opportunity.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

        {/* Right Sidebar (1 Col): Required Skills, Source Trust Card, Quick Apply */}
        <div className="space-y-6">
          {/* Required Skills */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills?.map((skill, idx) => (
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
                <span>✓ Verified by CampusLaunch</span>
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

      {/* Application Status Tracker Modal */}
      <Modal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        title="Track Application Status"
        subtitle={`Update your personal tracker for ${opportunity.title}`}
      >
        <form onSubmit={handleSaveTracking} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Current Application Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Saved', 'Applied', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`text-xs py-2 px-3 rounded-xl font-semibold border transition text-center ${
                    selectedStatus === status
                      ? 'bg-brand-50 text-brand-700 border-brand-300 ring-2 ring-brand-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
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
              Save Tracker Status
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
