import React from 'react';
import { Filter, X, RotateCcw, Check, ArrowUpDown, ShieldCheck, GraduationCap } from 'lucide-react';
import { OPPORTUNITY_TYPES, BRANCHES, YEARS, MODES } from '../../data/mockOpportunities';

export default function OpportunityFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0
}) {
  const deadlineOptions = [
    { id: 'all', label: 'Anytime' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week (< 7d)' },
    { id: 'month', label: 'This Month (< 30d)' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'deadline_soon', label: 'Closing Soonest' },
    { id: 'popular', label: 'Most Popular' }
  ];

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.mode !== 'all' ||
    filters.branch !== 'all' ||
    filters.year !== 'all' ||
    filters.deadline !== 'all' ||
    filters.verifiedOnly ||
    filters.collegeExclusive ||
    filters.search !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            {totalResults} {totalResults === 1 ? 'match' : 'matches'}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-medium text-slate-400 hover:text-brand-600 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Trust & Special Filters */}
      <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
        <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Opportunities Only
          </span>
          <input
            type="checkbox"
            checked={Boolean(filters.verifiedOnly)}
            onChange={(e) => onFilterChange('verifiedOnly', e.target.checked)}
            className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 pt-1 border-t border-slate-200/60">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            College Exclusive Opportunities
          </span>
          <input
            type="checkbox"
            checked={Boolean(filters.collegeExclusive)}
            onChange={(e) => onFilterChange('collegeExclusive', e.target.checked)}
            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
          />
        </label>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sort Order
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange('sort', opt.id)}
              className={`w-full text-left text-xs px-3 py-2 rounded-xl transition flex items-center justify-between ${
                filters.sort === opt.id
                  ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span>{opt.label}</span>
              {filters.sort === opt.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunity Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Opportunity Type
        </label>
        <div className="space-y-1">
          {OPPORTUNITY_TYPES.map((type) => {
            const isSelected = filters.type === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onFilterChange('type', type.id)}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  {type.emoji && <span>{type.emoji}</span>}
                  <span>{type.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode (Remote / Hybrid / Onsite) */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange('mode', 'all')}
            className={`text-xs py-2 px-2 text-center rounded-xl font-medium border transition ${
              filters.mode === 'all'
                ? 'bg-brand-50 text-brand-700 border-brand-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFilterChange('mode', mode)}
              className={`text-xs py-2 px-1 text-center rounded-xl font-medium border transition ${
                filters.mode === mode
                  ? 'bg-brand-50 text-brand-700 border-brand-200 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Target Engineering Branch */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Target Branch
        </label>
        <select
          value={filters.branch}
          onChange={(e) => onFilterChange('branch', e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Year of Study */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Eligible Year
        </label>
        <select
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Years (1st - 4th)</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Deadline Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Closing Deadline
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {deadlineOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onFilterChange('deadline', d.id)}
              className={`text-xs py-2 px-2 text-center rounded-xl font-medium border transition ${
                filters.deadline === d.id
                  ? 'bg-brand-50 text-brand-700 border-brand-200 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
