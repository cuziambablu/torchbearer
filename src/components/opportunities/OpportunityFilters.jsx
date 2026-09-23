import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, ShieldCheck, IndianRupee } from 'lucide-react';
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
  ];

  const stipendOptions = [
    { id: 'all', label: 'All Compensations' },
    { id: 'paid', label: 'Paid / Funded Only' },
    { id: '25k', label: '> ₹25,000 / month' },
    { id: '50k', label: '> ₹50,000 / month' },
  ];

  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'internship', label: 'Internships' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'fellowship', label: 'Fellowships' },
    { id: 'research', label: 'Research' },
    { id: 'opensource', label: 'Open Source / GSoC' },
    { id: 'aiml', label: 'AI / ML' },
    { id: 'government', label: 'Gov & PSU' },
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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
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
            className="rounded text-torch-600 focus:ring-torch-500 w-4 h-4"
          />
        </label>
      </div>

      {/* Sort Order */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort Order</span>
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-torch-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map((opt) => {
            const isSelected = filters.type?.toLowerCase() === opt.id.toLowerCase() || (opt.id === 'all' && filters.type === 'all');
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFilterChange('type', opt.id)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-torch-gradient text-white font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stipend Tiers */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
          <IndianRupee className="w-3 h-3 text-slate-400" />
          <span>Stipend / Value</span>
        </label>
        <div className="space-y-1.5">
          {stipendOptions.map((opt) => {
            const isSelected = (filters.stipendTier || 'all') === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFilterChange('stipendTier', opt.id)}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-torch-50 border border-torch-200 text-torch-700 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-torch-600"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Deadline
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {deadlineOptions.map((opt) => {
            const isSelected = (filters.deadline || 'all') === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFilterChange('deadline', opt.id)}
                className={`text-xs p-2 rounded-xl text-center font-medium border transition-colors ${
                  isSelected
                    ? 'bg-torch-50 border-torch-300 text-torch-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Work Mode
        </label>
        <select
          value={filters.mode || 'all'}
          onChange={(e) => onFilterChange('mode', e.target.value)}
          className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-torch-500"
        >
          <option value="all">Any Work Mode</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>
    </div>
  );
}
