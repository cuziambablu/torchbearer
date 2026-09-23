import React from 'react';
import { Filter, RotateCcw, Check, ArrowUpDown, ShieldCheck, IndianRupee } from 'lucide-react';
import { BRANCHES, YEARS, MODES } from '../../data/mockOpportunities';

export default function OpportunityFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0
}) {
  const deadlineOptions = [
    { id: 'all', label: 'Anytime' },
    { id: 'today', label: 'Closing in 24h' },
    { id: 'week', label: 'This Week (< 7d)' },
    { id: 'month', label: 'This Month (< 30d)' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'deadline_soon', label: 'Closing Soonest' },
    { id: 'highest_stipend', label: 'Highest Compensation' },
    { id: 'popular', label: 'Most Viewed' }
  ];

  const stipendOptions = [
    { id: 'all', label: 'All Compensations' },
    { id: 'paid', label: 'Paid Only' },
    { id: '25k', label: '> ₹25,000 / month' },
    { id: '50k', label: '> ₹50,000 / month' },
    { id: '1lakh', label: '> ₹1,00,000 Total / mo' }
  ];

  const categoryOptions = [
    'all',
    'Internships',
    'Scholarships',
    'Hackathons',
    'Fellowships',
    'Research',
    'Open Source',
    'AI / ML',
    'Software Development',
    'Competitions',
    'Government Programs'
  ];

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.mode !== 'all' ||
    filters.branch !== 'all' ||
    filters.year !== 'all' ||
    filters.deadline !== 'all' ||
    filters.stipendTier !== 'all' ||
    filters.verifiedOnly ||
    filters.search !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {totalResults}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Verified Filter */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <label className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Opportunities Only
          </span>
          <input
            type="checkbox"
            checked={Boolean(filters.verifiedOnly)}
            onChange={(e) => onFilterChange('verifiedOnly', e.target.checked)}
            className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4"
          />
        </label>
      </div>

      {/* Sort Order */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort Order</span>
        </label>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange('sort', opt.id)}
              className={'w-full text-left text-xs px-3 py-2 rounded-xl transition flex items-center justify-between ' + (filters.sort === opt.id ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-50')}
            >
              <span>{opt.label}</span>
              {filters.sort === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Category / Type Filter */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Opportunity Type
        </label>
        <div className="space-y-1">
          {categoryOptions.map((cat) => {
            const isSelected = filters.type === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange('type', cat)}
                className={'w-full text-left text-xs px-3 py-2 rounded-xl transition flex items-center justify-between ' + (isSelected ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-50')}
              >
                <span>{cat === 'all' ? 'All Types' : cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compensation (INR) Filter */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          <span>Compensation (INR)</span>
        </label>
        <div className="space-y-1">
          {stipendOptions.map((st) => {
            const isSelected = (filters.stipendTier || 'all') === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onFilterChange('stipendTier', st.id)}
                className={'w-full text-left text-xs px-3 py-2 rounded-xl transition flex items-center justify-between ' + (isSelected ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-50')}
              >
                <span>{st.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Mode Filter */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange('mode', 'all')}
            className={'text-xs py-2 px-1 text-center rounded-xl font-semibold border transition ' + (filters.mode === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}
          >
            All
          </button>
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFilterChange('mode', mode)}
              className={'text-xs py-2 px-1 text-center rounded-xl font-semibold border transition ' + (filters.mode === mode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Target Engineering Branch */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Target Branch
        </label>
        <select
          value={filters.branch}
          onChange={(e) => onFilterChange('branch', e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
        >
          <option value="all">All Branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Eligible Year */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Eligible Year
        </label>
        <select
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
        >
          <option value="all">All Years (1st - 4th)</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Closing Deadline */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Deadline Urgency
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {deadlineOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onFilterChange('deadline', d.id)}
              className={'text-xs py-2 px-1 text-center rounded-xl font-medium border transition ' + (filters.deadline === d.id ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
