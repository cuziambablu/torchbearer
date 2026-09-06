import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const STAGES = ['All', 'Saved', 'Applied', 'Interview', 'Selected', 'Rejected'];

export default function ApplicationTrackerPage() {
  const { applications, opportunities, updateApplicationStatus, removeApplication, addApplication } = useOpportunities();
  const { addToast } = useToast();

  const [activeStage, setActiveStage] = useState('All');
  const [editingApp, setEditingApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Applied');
  const [newNotes, setNewNotes] = useState('');

  // Filter applications by stage tab
  const filteredApps = applications.filter((app) => {
    if (activeStage === 'All') return true;
    return (app.status || '').toLowerCase() === activeStage.toLowerCase();
  });

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setNewStatus(app.status);
    setNewNotes(app.notes || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingApp) {
      updateApplicationStatus(editingApp.id, newStatus, newNotes);
      addToast(`Updated application status to ${newStatus}`, 'success');
      setEditingApp(null);
    }
  };

  const handleDelete = (appId, title) => {
    if (window.confirm(`Are you sure you want to remove this application from your tracker?`)) {
      removeApplication(appId);
      addToast(`Removed application for "${title}"`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Student Career Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Application Tracker ({applications.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track interview rounds, offers, and submitted applications in one place.
          </p>
        </div>

        <Link to="/opportunities">
          <Button variant="primary" size="sm" icon={Plus}>
            Track New Opportunity
          </Button>
        </Link>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {STAGES.map((stage) => {
          const count =
            stage === 'All'
              ? applications.length
              : applications.filter((a) => (a.status || '').toLowerCase() === stage.toLowerCase()).length;

          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeStage === stage
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{stage}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeStage === stage ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => {
              const opp = opportunities.find((o) => o.id === app.opportunityId);
              const title = opp?.title || 'External Application';

              return (
                <div
                  key={app.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={app.status} size="sm" />
                      <span className="text-xs text-slate-400 font-medium">
                        Applied: {formatDate(app.appliedAt)}
                      </span>
                      {opp?.type && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {opp.type}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/opportunities/${opp?.id || '#'}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-600 transition block"
                    >
                      {title}
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp?.organization || 'Organization'}</span>
                      <span>•</span>
                      <span>{opp?.location || 'Remote'}</span>
                      {opp?.stipend && (
                        <>
                          <span>•</span>
                          <span className="text-slate-700 font-semibold">{opp.stipend}</span>
                        </>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-2 italic">
                        "{app.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                    {opp?.applyUrl && (
                      <a
                        href={opp.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-brand-600 rounded-xl hover:bg-slate-100 transition"
                        title="Open official portal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit3}
                      onClick={() => handleOpenEdit(app)}
                    >
                      Update
                    </Button>

                    <button
                      onClick={() => handleDelete(app.id, title)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title={`No applications in "${activeStage}" stage`}
          description="Track your application progress from initial submission to final interview and selection."
          actionLabel="Browse Opportunities"
          onAction={() => window.location.assign('/opportunities')}
        />
      )}

      {/* Edit Status Modal */}
      <Modal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        title="Update Application Stage"
        subtitle="Keep your timeline up-to-date as you progress through interview rounds"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Current Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Saved', 'Applied', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewStatus(status)}
                  className={`text-xs py-2 px-3 rounded-xl font-semibold border transition text-center ${
                    newStatus === status
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
              Interview Notes & Deadlines
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Technical round completed. Expecting HR call on Tuesday."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingApp(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Update Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
