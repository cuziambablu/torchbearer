import React from 'react';
import { Bookmark, Send, Users, CheckCircle, XCircle, Clock, FileEdit, Eye, AlertOctagon } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const getStatusConfig = (s) => {
    switch ((s || '').toLowerCase()) {
      // Application Tracker statuses
      case 'saved':
        return {
          label: 'Saved',
          icon: Bookmark,
          classes: 'bg-slate-100 text-slate-700 border-slate-200'
        };
      case 'applied':
        return {
          label: 'Applied',
          icon: Send,
          classes: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'interview':
        return {
          label: 'Interview',
          icon: Users,
          classes: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
        };
      case 'selected':
        return {
          label: 'Selected',
          icon: CheckCircle,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
        };
      case 'rejected':
        return {
          label: 'Not Selected',
          icon: XCircle,
          classes: 'bg-rose-50 text-rose-700 border-rose-200'
        };

      // Opportunity publishing statuses
      case 'published':
        return {
          label: 'Published',
          icon: Eye,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'draft':
        return {
          label: 'Draft',
          icon: FileEdit,
          classes: 'bg-slate-100 text-slate-600 border-slate-200'
        };
      case 'pending':
        return {
          label: 'Pending Review',
          icon: Clock,
          classes: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'expired':
        return {
          label: 'Expired',
          icon: AlertOctagon,
          classes: 'bg-rose-50 text-rose-700 border-rose-200'
        };

      default:
        return {
          label: status,
          icon: Clock,
          classes: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border ${config.classes} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
