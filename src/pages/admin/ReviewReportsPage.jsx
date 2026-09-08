import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Link2Off,
  Filter,
  Eye,
  Trash2,
  FileQuestion,
  ShieldAlert
} from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const REASON_LABELS = {
  broken_link: { label: 'Broken Apply Link', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  expired: { label: 'Expired / Closed', color: 'bg-red-50 text-red-700 border-red-200' },
  fake_scam: { label: 'Scam / Suspicious', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  incorrect_info: { label: 'Incorrect Info', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  duplicate: { label: 'Duplicate', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  other: { label: 'Quality Concern', color: 'bg-slate-50 text-slate-700 border-slate-200' }
};

export default function ReviewReportsPage() {
  const { reports, opportunities, resolveReport, dismissReport, togglePublishStatus } = useOpportunities();
  const { addToast } = useToast();

  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'resolved' | 'dismissed' | 'all'

  const filteredReports = (reports || []).filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleResolve = (reportId, actionTaken) => {
    resolveReport(reportId, actionTaken, 'Verified and corrected');
    addToast('Report marked as resolved', 'success');
  };

  const handleDismiss = (reportId) => {
    dismissReport(reportId, 'Listing verified as accurate and active');
    addToast('Report dismissed as invalid', 'info');
  };

  const handleUnpublishOpportunity = (opportunityId, reportId) => {
    togglePublishStatus(opportunityId);
    resolveReport(reportId, 'unpublish', 'Listing drafted due to report validation');
    addToast('Opportunity unpublished and report resolved', 'warning');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Moderation Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Reports & Quality Moderation ({(reports || []).length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review user-flagged broken links, expired opportunities, and suspicious listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {['pending', 'resolved', 'dismissed', 'all'].map((status) => {
          const count =
            status === 'all'
              ? (reports || []).length
              : (reports || []).filter((r) => r.status === status).length;

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-xs px-3.5 py-2 rounded-xl font-semibold capitalize transition flex items-center gap-1.5 ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterStatus === status ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const opp = opportunities.find((o) => o.id === report.opportunityId);
            const reasonConfig = REASON_LABELS[report.reason] || REASON_LABELS.other;

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${reasonConfig.color}`}>
                        {reasonConfig.label}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                        report.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : report.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {report.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        Reported on {formatDate(report.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {report.opportunityTitle || opp?.title || 'Unknown Opportunity'}
                    </h3>

                    {opp && (
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <span>{opp.organization}</span>
                        <span>•</span>
                        <span>Status: <span className="font-semibold text-slate-700">{opp.status}</span></span>
                      </div>
                    )}

                    {report.details && (
                      <p className="text-xs text-slate-700 bg-rose-50/50 p-3 rounded-xl border border-rose-100 mt-2">
                        <span className="font-bold text-rose-900">Reporter Comment:</span> {report.details}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Reported by: <span className="text-slate-600 font-medium">{report.reporterEmail}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {opp && (
                      <Link to={`/opportunities/${opp.id}`}>
                        <Button variant="outline" size="sm" icon={Eye}>
                          View Listing
                        </Button>
                      </Link>
                    )}

                    {report.status === 'pending' && (
                      <>
                        {opp && opp.status === 'published' && (
                          <button
                            onClick={() => handleUnpublishOpportunity(opp.id, report.id)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition"
                          >
                            Unpublish Opportunity
                          </button>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleResolve(report.id, 'resolved')}
                        >
                          Resolve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={XCircle}
                          onClick={() => handleDismiss(report.id)}
                        >
                          Dismiss
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title={`No ${filterStatus !== 'all' ? filterStatus : ''} reports found`}
          description="All opportunity listings are verified and no pending reports require moderation."
        />
      )}
    </div>
  );
}
