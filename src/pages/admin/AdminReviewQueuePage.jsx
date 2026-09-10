import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit3,
  ExternalLink,
  Building,
  Calendar,
  DollarSign,
  Layers,
  AlertTriangle,
  Sparkles,
  Bot,
  Filter,
  Check,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';

export default function AdminReviewQueuePage() {
  const { reviewQueue, approveReviewItem, rejectReviewItem } = useOpportunities();
  const { addToast } = useToast();

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleOpenEdit = (item) => {
    const opp = item.opportunity_data || item;
    setEditingItem(item);
    setEditFormData({
      title: opp.title || '',
      company: opp.company || opp.organization || '',
      category: opp.category || 'Software Development',
      stipend: opp.stipend || '',
      deadline: opp.deadline || opp.applicationDeadline || '',
      applyUrl: opp.applyUrl || opp.applicationUrl || ''
    });
  };

  const handleSaveAndApprove = async () => {
    if (!editingItem) return;
    try {
      await approveReviewItem(editingItem.id, editFormData);
      addToast(`Opportunity "${editFormData.title}" updated and approved!`, 'success');
      setEditingItem(null);
    } catch (err) {
      addToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleApprove = async (id, title) => {
    try {
      await approveReviewItem(id);
      addToast(`"${title}" approved and published to student catalog!`, 'success');
    } catch (err) {
      addToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleReject = async (id, title) => {
    try {
      await rejectReviewItem(id, 'Rejected by Administrator');
      addToast(`"${title}" rejected from review queue.`, 'info');
    } catch (err) {
      addToast(`Rejection failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Human-in-the-Loop Quality Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            AI Opportunity Review Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Opportunities scoring between 50%–74% require human verification before being published live to students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/agent"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
          >
            <Bot className="w-4 h-4 text-brand-400" />
            <span>Agent Control Panel →</span>
          </Link>
        </div>
      </div>

      {/* Review Queue Items List */}
      {reviewQueue.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Review Queue is Clear!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All newly discovered opportunities meet high-confidence verification criteria (&ge; 75%) or have been approved.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/admin/agent"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition"
            >
              <Bot className="w-4 h-4" />
              <span>Run Opportunity Agent to Scan for New Postings</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Awaiting Human Verification ({reviewQueue.length} Opportunities)
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reviewQueue.map((item) => {
              const opp = item.opportunity_data || item;
              const score = item.verification_score || opp.verificationScore || 65;
              const flagReasons = item.flag_reasons || opp.flagReasons || ['Requires manual authenticity audit'];

              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Verification Score: {score}/100
                        </span>
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          <span>{opp.company || opp.organization}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-indigo-300 font-semibold">{opp.category}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white pt-0.5">{opp.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Edit & Fix</span>
                      </button>

                      <button
                        onClick={() => handleReject(item.id, opp.title)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition"
                      >
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(item.id, opp.title)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>

                  {/* Flag reasons banner */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Why this opportunity was held for review:</span>
                    </div>
                    <ul className="list-disc list-inside text-amber-200/90 pl-1 space-y-0.5 text-[11px]">
                      {flagReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Extracted Details Pill Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Stipend / Prize</div>
                      <div className="text-slate-200 font-semibold mt-0.5 truncate">{opp.stipend || 'Unspecified'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Work Mode / Location</div>
                      <div className="text-slate-200 font-semibold mt-0.5 truncate">{opp.workMode || opp.mode} • {opp.location}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Deadline</div>
                      <div className="text-slate-200 font-semibold mt-0.5 truncate">
                        {opp.deadline || opp.applicationDeadline ? new Date(opp.deadline || opp.applicationDeadline).toLocaleDateString() : 'No Deadline'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Official Application Link</div>
                      <a
                        href={opp.applyUrl || opp.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-400 hover:text-brand-300 font-semibold mt-0.5 truncate flex items-center gap-1"
                      >
                        <span className="truncate">{opp.applyUrl || opp.applicationUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title="Edit & Approve Opportunity"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Internship Title</label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={editFormData.company}
                  onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stipend</label>
                <input
                  type="text"
                  value={editFormData.stipend}
                  onChange={(e) => setEditFormData({ ...editFormData, stipend: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={editFormData.deadline ? editFormData.deadline.split('T')[0] : ''}
                  onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application URL</label>
                <input
                  type="url"
                  value={editFormData.applyUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, applyUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveAndApprove}>
                Save & Approve Live
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
