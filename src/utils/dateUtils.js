// Date & Deadline helper utilities for CampusLaunch

export function getDeadlineStatus(deadlineStr) {
  if (!deadlineStr) return { status: 'unknown', label: 'No deadline', color: 'slate', daysLeft: 999 };

  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return {
      status: 'expired',
      label: 'Expired',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      pillClass: 'text-rose-600 bg-rose-50',
      daysLeft: 0,
      isClosingSoon: false,
      isExpired: true,
    };
  }

  if (diffHours <= 24) {
    return {
      status: 'closing_soon',
      label: `⏰ Closes in ${diffHours}h`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse',
      pillClass: 'text-amber-600 bg-amber-50',
      daysLeft: 1,
      isClosingSoon: true,
      isExpired: false,
    };
  }

  if (diffDays <= 7) {
    return {
      status: 'closing_soon',
      label: `🔥 ${diffDays} days left`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
      pillClass: 'text-amber-600 bg-amber-50',
      daysLeft: diffDays,
      isClosingSoon: true,
      isExpired: false,
    };
  }

  return {
    status: 'active',
    label: `${diffDays} days left`,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pillClass: 'text-emerald-600 bg-emerald-50',
    daysLeft: diffDays,
    isClosingSoon: false,
    isExpired: false,
  };
}

export function formatDate(dateStr, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateStr;
  }
}
