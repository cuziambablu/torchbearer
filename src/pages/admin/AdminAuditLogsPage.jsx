import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  ArrowLeft,
  Clock,
  User,
  Trash2,
  CheckCircle,
  UploadCloud,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { fetchAdminLogs } from '../../services/auditService';
import { formatDate } from '../../utils/dateUtils';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchAdminLogs(100);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter === 'ALL') return true;
    return log.action.includes(actionFilter);
  });

  const getActionBadge = (action) => {
    if (action.includes('VERIFIED') || action.includes('APPROVED')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('DELETED') || action.includes('REJECTED')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('CSV') || action.includes('IMPORT')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (action.includes('ROLE')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-brand-50 text-brand-700 border-brand-200';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable tracking of moderation, publishing approvals, CSV imports, and administrative security events.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={RotateCcw} onClick={loadLogs} loading={loading}>
          Refresh Logs
        </Button>
      </div>

      {/* Action Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
        {['ALL', 'VERIFIED', 'APPROVED', 'DELETED', 'REJECTED', 'CSV', 'ROLE'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActionFilter(filter)}
            className={`px-3 py-1.5 rounded-xl border transition ${
              actionFilter === filter
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter === 'ALL' ? 'All Events' : filter}
          </button>
        ))}
      </div>

      {/* Logs Timeline */}
      {filteredLogs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getActionBadge(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Target: <span className="font-bold text-slate-800">{log.entity}</span>
                    </span>
                    {log.entityId && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{String(log.entityId).substring(0, 8)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700">
                    By <span className="font-semibold text-slate-900">{log.adminEmail}</span>
                    {log.details && typeof log.details === 'object' && Object.keys(log.details).length > 0 && (
                      <span className="text-slate-500 ml-1">
                        — {JSON.stringify(log.details).replace(/[{}"]/g, ' ')}
                      </span>
                    )}
                  </p>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1 sm:self-center">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(log.createdAt, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No audit logs match criteria"
          description="Administrative actions (moderating submissions, creating opportunities, CSV imports) will be automatically recorded here."
        />
      )}
    </div>
  );
}
