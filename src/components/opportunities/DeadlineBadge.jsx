import React from 'react';
import { Clock, Flame, AlertCircle } from 'lucide-react';
import { getDeadlineStatus } from '../../utils/dateUtils';

export default function DeadlineBadge({ deadline, className = '' }) {
  const deadlineInfo = getDeadlineStatus(deadline);

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${deadlineInfo.badgeClass} ${className}`}
    >
      {deadlineInfo.isClosingSoon && <Flame className="w-3 h-3 text-amber-600 animate-bounce" />}
      {!deadlineInfo.isClosingSoon && !deadlineInfo.isExpired && <Clock className="w-3 h-3 text-emerald-600" />}
      {deadlineInfo.isExpired && <AlertCircle className="w-3 h-3 text-rose-600" />}
      <span>{deadlineInfo.label}</span>
    </span>
  );
}
