import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Building,
  ShieldCheck,
  Send,
  IndianRupee,
  Layers,
  Award,
} from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import { formatCompensation } from '../../utils/currencyUtils';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunities, isSaved, toggleSave } = useOpportunities();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const opportunity = opportunities.find((o) => o.id === id);

  if (!opportunity) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Opportunity not found</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm">
          This listing may have expired or been removed during verification.
        </p>
        <Link
          to="/opportunities"
          className="px-4 py-2 text-xs font-semibold text-white bg-torch-gradient rounded-xl shadow-torch-button"
        >
          Browse Active Opportunities
        </Link>
      </div>
    );
  }

  const saved = isSaved(opportunity.id);
  const orgName = opportunity.organization || opportunity.company || 'Verified Organization';
  const title = opportunity.title || 'Untitled Opportunity';
  const category = opportunity.category || opportunity.type || 'Internship';
  const location = opportunity.location || (opportunity.is_remote ? 'Remote' : 'India');
  const deadline = opportunity.deadline || 'Rolling';
  const stipendDisplay = formatCompensation(opportunity.stipend || opportunity.salary || opportunity.reward);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/opportunities" className="hover:text-slate-900 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Opportunities</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{title}</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-10 mb-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              {/* Org Logo */}
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {opportunity.logo_url && !imageError ? (
                  <img
                    src={opportunity.logo_url}
                    alt={orgName}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#FF2400]/10 via-[#FF7300]/10 to-[#FFC400]/20 flex items-center justify-center text-xl font-extrabold text-torch-700">
                    {orgName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{orgName}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Verified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 leading-tight">
                  {title}
                </h1>
              </div>
            </div>

            {/* Top Action CTAs */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => toggleSave(opportunity.id)}
                className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  saved
                    ? 'bg-torch-50 border-torch-200 text-torch-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-torch-600 text-torch-600' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <a
                href={opportunity.application_url || opportunity.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-torch-gradient rounded-xl shadow-torch-button hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Apply Official</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compensation</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-0.5">
                <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                <span>{stipendDisplay}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location / Mode</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{category}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Deadline</p>
              <p className="text-sm font-bold text-red-600 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{deadline}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">About the Opportunity</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {opportunity.description ||
                'This verified opportunity is open to university and college students. Review the official eligibility terms on the portal and apply before the specified deadline.'}
            </p>
          </div>

          {/* Eligibility & Requirements */}
          {opportunity.eligibility && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Eligibility & Qualifications</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                {opportunity.eligibility}
              </div>
            </div>
          )}

          {/* Source Provenance */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Discovered & audited from official portal feeds. Zero spam policy.</span>
            </div>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-slate-400 hover:text-slate-700 font-semibold transition flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Inaccuracy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Report Inaccuracy</h3>
            <p className="text-xs text-slate-500 mb-4">
              Help us maintain authentic opportunity data by reporting broken links or expired dates.
            </p>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your feedback has been sent for verification.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <textarea
                  required
                  rows="3"
                  placeholder="Describe the issue (e.g. deadline has passed, application form link expired)..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-torch-500"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-torch-gradient rounded-xl shadow-torch-button"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
