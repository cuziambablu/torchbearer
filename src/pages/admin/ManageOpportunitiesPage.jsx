import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Building
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import DeadlineBadge from '../../components/opportunities/DeadlineBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { OPPORTUNITY_TYPES } from '../../data/mockOpportunities';
import { formatDate } from '../../utils/dateUtils';

export default function ManageOpportunitiesPage() {
  const { opportunities, deleteOpportunity, togglePublishStatus } = useOpportunities();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const filteredOpps = opportunities.filter((opp) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.type.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedType !== 'all' && opp.type !== selectedType) return false;
    if (selectedStatus !== 'all' && opp.status !== selectedStatus) return false;
    return true;
  });

  const handleTogglePublish = (opp) => {
    togglePublishStatus(opp.id);
    const willPublish = opp.status !== 'published';
    addToast(
      willPublish ? `Published "${opp.title}" to student discovery` : `Unpublished "${opp.title}" (saved as draft)`,
      willPublish ? 'success' : 'info'
    );
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteOpportunity(deletingId);
      addToast('Opportunity permanently removed', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Opportunities ({filteredOpps.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, toggle visibility, and maintain student opportunity listings.
          </p>
        </div>

        <Link to="/admin/opportunities/new">
          <Button variant="primary" size="md" icon={PlusCircle} className="shadow-sm shadow-brand-500/20">
            Create Opportunity
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or company..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Types</option>
            {OPPORTUNITY_TYPES.filter((t) => t.id !== 'all').map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft / Unpublished</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {filteredOpps.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Opportunity</th>
                  <th scope="col" className="px-4 py-4">Type / Mode</th>
                  <th scope="col" className="px-4 py-4">Deadline</th>
                  <th scope="col" className="px-4 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{opp.title}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{opp.organization}</span>
                        <span>•</span>
                        <span>{opp.stipend || 'Unpaid'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800">{opp.type}</span>
                        <span className="text-[10px] text-slate-500">{opp.mode}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <DeadlineBadge deadline={opp.deadline} />
                      <div className="text-[10px] text-slate-400 mt-1">
                        {formatDate(opp.deadline)}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={opp.status} size="sm" />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(opp)}
                        className={`p-2 rounded-xl border transition ${
                          opp.status === 'published'
                            ? 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={opp.status === 'published' ? 'Unpublish to draft' : 'Publish live'}
                      >
                        {opp.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <Link to={`/admin/opportunities/${opp.id}/edit`}>
                        <button
                          type="button"
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                          title="Edit opportunity"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeletingId(opp.id)}
                        className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No opportunities match your filter"
          description="Try adjusting your search criteria or reset filters."
          actionLabel="Create Opportunity"
          onAction={() => window.location.assign('/admin/opportunities/new')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Deletion"
        subtitle="This action will permanently delete the opportunity from Torchbearer AI."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to permanently delete this opportunity? This cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Yes, Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
