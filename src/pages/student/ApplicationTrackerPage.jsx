import React, { useState, useMemo } from 'react';
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
  Briefcase,
  LayoutGrid,
  List,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Trophy,
  DollarSign
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const PIPELINE_STAGES = [
  { id: 'Saved', label: 'Saved', color: 'border-slate-300 bg-slate-50/50 text-slate-700', badge: 'bg-slate-100 text-slate-800' },
  { id: 'Applied', label: 'Applied', color: 'border-blue-300 bg-blue-50/30 text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  { id: 'Assessment', label: 'Assessment / OA', color: 'border-indigo-300 bg-indigo-50/30 text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' },
  { id: 'Interview', label: 'Interview', color: 'border-amber-300 bg-amber-50/30 text-amber-700', badge: 'bg-amber-100 text-amber-800' },
  { id: 'Offer', label: 'Offer Received 🎉', color: 'border-emerald-300 bg-emerald-50/30 text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'Rejected', label: 'Rejected', color: 'border-rose-300 bg-rose-50/30 text-rose-700', badge: 'bg-rose-100 text-rose-800' },
  { id: 'Withdrawn', label: 'Withdrawn', color: 'border-slate-200 bg-slate-50/20 text-slate-500', badge: 'bg-slate-100 text-slate-600' }
];

export default function ApplicationTrackerPage() {
  const { applications, opportunities, updateApplicationStatus, removeApplication } = useOpportunities();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [activeStageTab, setActiveStageTab] = useState('All');
  const [editingApp, setEditingApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Applied');
  const [newNotes, setNewNotes] = useState('');

  // Applications map by stage for Kanban
  const appsByStage = useMemo(() => {
    const map = {};
    PIPELINE_STAGES.forEach((s) => {
      map[s.id] = [];
    });
    applications.forEach((app) => {
      const stage = app.status || 'Applied';
      if (map[stage]) {
        map[stage].push(app);
      } else {
        if (!map['Applied']) map['Applied'] = [];
        map['Applied'].push(app);
      }
    });
    return map;
  }, [applications]);

  // Filtered applications for List View
  const filteredApps = useMemo(() => {
    if (activeStageTab === 'All') return applications;
    return applications.filter((app) => (app.status || '').toLowerCase() === activeStageTab.toLowerCase());
  }, [applications, activeStageTab]);

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setNewStatus(app.status || 'Applied');
    setNewNotes(app.notes || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingApp) {
      updateApplicationStatus(editingApp.id, newStatus, newNotes);
      addToast(`Updated application stage to "${newStatus}"`, 'success');
      setEditingApp(null);
    }
  };

  const handleQuickMove = (appId, nextStatus) => {
    updateApplicationStatus(appId, nextStatus);
    addToast(`Moved to ${nextStatus}`, 'success');
  };

  const handleDelete = (appId, title) => {
    if (window.confirm(`Are you sure you want to remove this application from your tracker?`)) {
      removeApplication(appId);
      addToast(`Removed application for "${title}"`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
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
            Visual pipeline to track your applications through online assessments, interview rounds, and offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Link to="/opportunities">
            <Button variant="primary" size="sm" icon={Plus}>
              Find More
            </Button>
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No applications tracked yet"
          description="Start applying to internships, hackathons, and research fellowships. You can track your progress here."
          actionLabel="Explore Opportunities"
          onAction={() => window.location.assign('/opportunities')}
        />
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-6">
          {PIPELINE_STAGES.map((stage) => {
            const stageApps = appsByStage[stage.id] || [];
            return (
              <div
                key={stage.id}
                className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[240px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {stage.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>
                    {stageApps.length}
                  </span>
                </div>

                {/* Stage Column Cards */}
                <div className="space-y-3 flex-1">
                  {stageApps.map((app) => {
                    const opp = opportunities.find((o) => o.id === app.opportunityId);
                    const title = opp?.title || 'External Application';

                    return (
                      <div
                        key={app.id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-subtle hover:shadow-card transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            to={`/opportunities/${opp?.id || '#'}`}
                            className="text-xs font-bold text-slate-900 hover:text-brand-600 line-clamp-2 leading-snug"
                          >
                            {title}
                          </Link>
                        </div>

                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {opp?.organization || 'Organization'}
                        </div>

                        {opp?.stipend && (
                          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 truncate">
                            {opp.stipend}
                          </div>
                        )}

                        {app.notes && (
                          <p className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 italic line-clamp-2">
                            "{app.notes}"
                          </p>
                        )}

                        {/* Quick stage mover dropdown */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          <select
                            value={app.status || 'Applied'}
                            onChange={(e) => handleQuickMove(app.id, e.target.value)}
                            className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(app)}
                              className="p-1 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
                              title="Edit notes"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(app.id, title)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {stageApps.length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-[11px] font-medium border border-dashed border-slate-200 rounded-xl">
                      No items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {/* Stage Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
            <button
              onClick={() => setActiveStageTab('All')}
              className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeStageTab === 'All'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>All Stages</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeStageTab === 'All' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {applications.length}
              </span>
            </button>

            {PIPELINE_STAGES.map((stage) => {
              const count = (appsByStage[stage.id] || []).length;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageTab(stage.id)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeStageTab === stage.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{stage.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeStageTab === stage.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

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
                          Updated: {formatDate(app.updatedAt || app.appliedAt)}
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
                        Update Stage
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
        </div>
      )}

      {/* Edit Status Modal with 7 Stages */}
      <Modal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        title="Update Pipeline Stage"
        subtitle="Record your latest interview status, technical assessment notes, or offer details"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pipeline Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setNewStatus(stage.id)}
                  className={`text-xs py-2 px-3 rounded-xl font-semibold border transition text-center ${
                    newStatus === stage.id
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
              Interview Notes, Next Steps & Deadlines
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Cleared round 1 online assessment. Scheduled for system design round on Friday."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingApp(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Application Stage
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

