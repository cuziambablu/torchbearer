import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Link2Off,
  Clock,
  ShieldAlert,
  FileQuestion,
  Copy,
  HelpCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const REPORT_REASONS = [
  {
    id: 'broken_link',
    label: 'Broken / Dead Apply Link',
    desc: 'The official application URL 404s or does not open the correct form.',
    icon: Link2Off,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'expired',
    label: 'Expired or Registration Closed',
    desc: 'The opportunity deadline has passed or applications are no longer accepted.',
    icon: Clock,
    color: 'text-red-600 bg-red-50 border-red-200'
  },
  {
    id: 'fake_scam',
    label: 'Suspicious / Scam / Paid Requirement',
    desc: 'Listing asks students for money, feels fake, or is an unofficial impersonator.',
    icon: ShieldAlert,
    color: 'text-rose-600 bg-rose-50 border-rose-200'
  },
  {
    id: 'incorrect_info',
    label: 'Incorrect Stipend / Eligibility / Dates',
    desc: 'Discrepancies in stipend amount, eligibility branch, year, or location.',
    icon: FileQuestion,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'duplicate',
    label: 'Duplicate Listing',
    desc: 'This exact opportunity already exists under a different listing ID.',
    icon: Copy,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'other',
    label: 'Other Quality Issue',
    desc: 'Any other discrepancy or quality concern that needs moderation.',
    icon: HelpCircle,
    color: 'text-slate-600 bg-slate-50 border-slate-200'
  }
];

export default function ReportModal({ isOpen, onClose, opportunity }) {
  const { reportOpportunity } = useOpportunities();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [reason, setReason] = useState('broken_link');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      addToast('Please select a reason for reporting', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await reportOpportunity({
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        reason,
        details,
        reportedBy: user?.id || 'anonymous-student',
        reporterEmail: email || user?.email || 'student@college.edu'
      });

      setSubmitted(true);
      addToast('Thank you! Your report has been submitted for admin verification.', 'success');
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1500);
    } catch (err) {
      addToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Report Opportunity</h3>
              <p className="text-xs text-rose-100 truncate max-w-[280px]">
                {opportunity.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Submitted</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Our moderation team reviews student reports within 24 hours to keep CampusLaunch trustworthy and 100% verified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                What is the issue with this listing?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map((r) => {
                  const Icon = r.icon;
                  const isSelected = reason === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 ${r.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900">{r.label}</div>
                        <div className="text-[11px] text-slate-500 leading-snug">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="E.g., Link shows 404 page, or official website says the deadline was yesterday..."
                rows={3}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>

            {/* Contact email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Your Email (for notification upon resolution)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
