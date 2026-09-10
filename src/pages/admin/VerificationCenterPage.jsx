import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Building,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const VERIFICATION_STATUSES = [
  { id: 'all', label: 'All Listings' },
  { id: 'verified', label: 'Verified Active', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'pending', label: 'Pending Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'under_review', label: 'Under Review', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'rejected', label: 'Rejected / Invalid', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'expired', label: 'Expired', color: 'bg-slate-800 text-slate-400 border-slate-700' }
];

export default function VerificationCenterPage() {
  const { opportunities, updateOpportunity } = useOpportunities();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);

  const filteredOpps = useMemo(() => {
    return opportunities.filter((opp) => {
      const status = opp.verificationStatus || 'verified';
      if (activeTab !== 'all' && status !== activeTab) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (opp.title || '').toLowerCase().includes(q);
        const orgMatch = (opp.organization || '').toLowerCase().includes(q);
        const typeMatch = (opp.type || '').toLowerCase().includes(q);
        return titleMatch || orgMatch || typeMatch;
      }
      return true;
    });
  }, [opportunities, activeTab, searchQuery]);

  const handleSetVerification = async (oppId, newStatus) => {
    try {
      await updateOpportunity(
        oppId,
        {
          verificationStatus: newStatus,
          verifiedAt: newStatus === 'verified' ? new Date().toISOString() : null,
          lastVerifiedAt: new Date().toISOString()
        },
        user?.email || 'admin@torchbearer.ai'
      );

      addToast(`Updated status to ${newStatus.toUpperCase()}`, 'success');
      if (selectedOpp && selectedOpp.id === oppId) {
        setSelectedOpp({
          ...selectedOpp,
          verificationStatus: newStatus,
          verifiedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      addToast('Failed to update verification status.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Quality Assurance & Trust Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit opportunity links, official source validity, deadlines, and eligibility criteria before public distribution.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {VERIFICATION_STATUSES.map((tab) => {
            const count =
              tab.id === 'all'
                ? opportunities.length
                : opportunities.filter((o) => (o.verificationStatus || 'verified') === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, org, type..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Verification Data Grid */}
      {filteredOpps.length > 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800">
            {filteredOpps.map((opp) => {
              const currentStatus = opp.verificationStatus || 'verified';
              const statusCfg =
                VERIFICATION_STATUSES.find((s) => s.id === currentStatus) ||
                VERIFICATION_STATUSES[1];

              return (
                <div
                  key={opp.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {opp.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        Deadline: {formatDate(opp.deadline)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {opp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="text-slate-200 font-semibold">{opp.organization}</span>
                      <span>•</span>
                      <span>Source: <span className="text-slate-300">{opp.sourceName || 'Official'}</span></span>
                      {opp.applyUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={opp.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Official Apply Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>

                    {opp.eligibility && (
                      <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        🎓 <span className="font-semibold text-slate-300">Eligibility:</span> {opp.eligibility}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSetVerification(opp.id, 'verified')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentStatus === 'verified'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </button>

                    <button
                      onClick={() => handleSetVerification(opp.id, 'under_review')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentStatus === 'under_review'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => handleSetVerification(opp.id, 'rejected')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentStatus === 'rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title="No listings matching verification filter"
          description="All listings in this queue have been verified or resolved."
        />
      )}
    </div>
  );
}
