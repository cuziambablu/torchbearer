import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  Building,
  User,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

export default function ReviewSubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useOpportunities();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected, all
  const [inspectingSub, setInspectingSub] = useState(null);

  const filteredSubmissions = submissions.filter((sub) => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

  const handleApprove = (sub) => {
    approveSubmission(sub.id);
    addToast(`Approved "${sub.title}" and published to platform!`, 'success');
    if (inspectingSub?.id === sub.id) {
      setInspectingSub(null);
    }
  };

  const handleReject = (sub) => {
    rejectSubmission(sub.id);
    addToast(`Rejected submission for "${sub.title}"`, 'info');
    if (inspectingSub?.id === sub.id) {
      setInspectingSub(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Content Moderation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Opportunity Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review community contributed opportunities, verify application URLs, and approve for student discovery.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'pending', label: 'Pending Review' },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'all', label: 'All Submissions' }
        ].map((tab) => {
          const count =
            tab.id === 'all'
              ? submissions.length
              : submissions.filter((s) => s.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length > 0 ? (
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={sub.status} size="sm" />
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
                    {sub.type}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {sub.mode}
                  </span>
                  <span className="text-xs text-slate-400">
                    Submitted {formatDate(sub.createdAt)} by <span className="font-semibold text-slate-700">{sub.studentName}</span> ({sub.studentEmail})
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {sub.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {sub.organization}
                  </span>
                  <span>•</span>
                  <span>{sub.location}</span>
                  {sub.stipend && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{sub.stipend}</span>
                    </>
                  )}
                  {sub.deadline && (
                    <>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">Deadline: {sub.deadline}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>

                {sub.applyUrl && (
                  <div className="pt-1 flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Application Portal:</span>
                    <a
                      href={sub.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline font-semibold flex items-center gap-1 truncate max-w-md"
                    >
                      <span className="truncate">{sub.applyUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectingSub(sub)}
                >
                  View Full Details
                </Button>

                {sub.status === 'pending' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleReject(sub)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handleApprove(sub)}
                    >
                      Approve & Publish
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShieldAlert}
          title={`No submissions in "${activeTab}" state`}
          description="When students submit internships or hackathons via the community form, they will show up here."
        />
      )}

      {/* Inspect Detail Modal */}
      <Modal
        isOpen={!!inspectingSub}
        onClose={() => setInspectingSub(null)}
        title="Review Opportunity Submission"
        subtitle={`Submitted by ${inspectingSub?.studentName} (${inspectingSub?.studentEmail})`}
      >
        {inspectingSub && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-600 uppercase">
                {inspectingSub.type} • {inspectingSub.mode}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{inspectingSub.title}</h3>
              <p className="text-xs text-slate-600 font-medium">
                {inspectingSub.organization} • {inspectingSub.location} • {inspectingSub.stipend}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">Eligibility:</p>
              <p>{inspectingSub.eligibility || 'Not specified'}</p>
              <p className="font-bold text-slate-900 pt-1">Skills:</p>
              <p>{inspectingSub.skills || 'Not specified'}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">Description:</p>
              <p className="text-xs text-slate-600 leading-relaxed max-h-40 overflow-y-auto">
                {inspectingSub.description}
              </p>
            </div>

            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-200 text-xs text-brand-900 flex items-center justify-between">
              <div>
                <p className="font-bold">Official Apply Link:</p>
                <a
                  href={inspectingSub.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline flex items-center gap-1 font-semibold mt-0.5"
                >
                  <span className="truncate max-w-sm">{inspectingSub.applyUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setInspectingSub(null)}>
                Close
              </Button>
              {inspectingSub.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => handleReject(inspectingSub)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleApprove(inspectingSub)}
                  >
                    Approve & Publish
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
