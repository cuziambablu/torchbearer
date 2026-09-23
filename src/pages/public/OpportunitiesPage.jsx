import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  LayoutGrid,
  List,
  Sparkles,
  Trophy,
  Briefcase,
  BookOpen,
  Rocket,
  GraduationCap,
  IndianRupee,
  RotateCcw
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import OpportunityFilters from '../../components/opportunities/OpportunityFilters';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { getDeadlineStatus } from '../../utils/dateUtils';

const ITEMS_PER_PAGE = 12;

export default function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { opportunities, loading } = useOpportunities();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Parse filters from URL search params or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'all',
    mode: searchParams.get('mode') || 'all',
    branch: searchParams.get('branch') || 'all',
    year: searchParams.get('year') || 'all',
    deadline: searchParams.get('deadline') || 'all',
    stipendTier: searchParams.get('stipend') || 'all',
    sort: searchParams.get('sort') || 'newest',
    verifiedOnly: searchParams.get('verified') === 'true'
  });

  // Sync state when URL params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || 'all',
      mode: searchParams.get('mode') || 'all',
      branch: searchParams.get('branch') || 'all',
      year: searchParams.get('year') || 'all',
      deadline: searchParams.get('deadline') || 'all',
      stipendTier: searchParams.get('stipend') || 'all',
      sort: searchParams.get('sort') || 'newest',
      verifiedOnly: searchParams.get('verified') === 'true'
    }));
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    setCurrentPage(1);

    // Update URL query parameters
    const newParams = new URLSearchParams();
    Object.entries(nextFilters).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== false) {
        if (k === 'verifiedOnly') newParams.set('verified', 'true');
        else if (k === 'stipendTier') newParams.set('stipend', v);
        else newParams.set(k, v);
      }
    });
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      type: 'all',
      mode: 'all',
      branch: 'all',
      year: 'all',
      deadline: 'all',
      stipendTier: 'all',
      sort: 'newest',
      verifiedOnly: false
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredOpportunities = useMemo(() => {
    return (opportunities || []).filter((opp) => {
      // 1. Search Query Filter (Natural language matching)
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const titleMatch = (opp.title || '').toLowerCase().includes(query);
        const orgMatch = (opp.organization || opp.company || '').toLowerCase().includes(query);
        const descMatch = (opp.description || opp.aiSummary || '').toLowerCase().includes(query);
        const locMatch = (opp.location || '').toLowerCase().includes(query);
        const skillsMatch = Array.isArray(opp.skills)
          ? opp.skills.some((s) => s.toLowerCase().includes(query))
          : (opp.skills || '').toLowerCase().includes(query);
        const categoryMatch = (opp.category || '').toLowerCase().includes(query);
        const typeMatch = (opp.type || '').toLowerCase().includes(query);

        if (!titleMatch && !orgMatch && !descMatch && !locMatch && !skillsMatch && !categoryMatch && !typeMatch) {
          return false;
        }
      }

      // 2. Type / Category Filter
      if (filters.type !== 'all') {
        const typeStr = (opp.type || '').toLowerCase();
        const catStr = (opp.category || '').toLowerCase();
        const filterStr = filters.type.toLowerCase();
        if (!typeStr.includes(filterStr) && !catStr.includes(filterStr)) {
          return false;
        }
      }

      // 3. Work Mode Filter
      if (filters.mode !== 'all') {
        const oppMode = (opp.workMode || opp.mode || 'Remote').toLowerCase();
        if (oppMode !== filters.mode.toLowerCase()) return false;
      }

      // 4. Branch Filter
      if (filters.branch !== 'all') {
        const targetBranches = Array.isArray(opp.targetBranches || opp.branches)
          ? (opp.targetBranches || opp.branches).map((b) => b.toLowerCase())
          : ['all', 'cse', 'it', 'ece'];
        const isEligible =
          targetBranches.includes('all') ||
          targetBranches.includes('all engineering branches') ||
          targetBranches.includes(filters.branch.toLowerCase());
        if (!isEligible) return false;
      }

      // 5. Year Filter
      if (filters.year !== 'all') {
        const targetYears = Array.isArray(opp.targetYears || opp.graduationYear)
          ? (opp.targetYears || opp.graduationYear).map((y) => y.toLowerCase())
          : ['all'];
        const isEligible =
          targetYears.includes('all') ||
          targetYears.some((y) => y.includes(filters.year.toLowerCase()));
        if (!isEligible) return false;
      }

      // 6. Deadline Filter
      if (filters.deadline !== 'all') {
        const deadlineInfo = getDeadlineStatus(opp.deadline || opp.applicationDeadline);
        if (deadlineInfo.isExpired) return false;
        if (filters.deadline === 'today' && deadlineInfo.daysLeft > 1) return false;
        if (filters.deadline === 'week' && deadlineInfo.daysLeft > 7) return false;
        if (filters.deadline === 'month' && deadlineInfo.daysLeft > 30) return false;
      }

      // 7. Stipend Tier Filter
      if (filters.stipendTier !== 'all') {
        const amount = opp.stipendAmount || 0;
        const stipendStr = opp.stipend || '';
        if (filters.stipendTier === 'paid') {
          if (!amount && (!stipendStr || stipendStr.toLowerCase().includes('unpaid'))) return false;
        } else if (filters.stipendTier === '25k') {
          if (amount < 25000 && !stipendStr.includes('25,000') && !stipendStr.includes('50,000') && !stipendStr.includes('Lakh')) return false;
        } else if (filters.stipendTier === '50k') {
          if (amount < 50000 && !stipendStr.includes('50,000') && !stipendStr.includes('80,000') && !stipendStr.includes('Lakh')) return false;
        } else if (filters.stipendTier === '1lakh') {
          if (amount < 100000 && !stipendStr.includes('Lakh') && !stipendStr.includes('1,00,000') && !stipendStr.includes('10,00,000')) return false;
        }
      }

      // 8. Verified Only Filter
      if (filters.verifiedOnly && opp.verificationStatus !== 'verified' && (opp.verificationScore || 0) < 75) {
        return false;
      }

      // Hide expired opportunities by default unless explicitly searching past listings
      const deadlineInfo = getDeadlineStatus(opp.deadline || opp.applicationDeadline);
      if (deadlineInfo.isExpired && filters.deadline !== 'expired') {
        return false;
      }

      return true;
    });
  }, [opportunities, filters]);

  // Sorting Logic
  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
      if (filters.sort === 'deadline_soon') {
        const dateA = new Date(a.deadline || a.applicationDeadline || '2099-01-01').getTime();
        const dateB = new Date(b.deadline || b.applicationDeadline || '2099-01-01').getTime();
        return dateA - dateB;
      }
      if (filters.sort === 'highest_stipend') {
        return (b.stipendAmount || 0) - (a.stipendAmount || 0);
      }
      if (filters.sort === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      // newest first
      const dateA = new Date(a.postedDate || a.created_at || '2026-01-01').getTime();
      const dateB = new Date(b.postedDate || b.created_at || '2026-01-01').getTime();
      return dateB - dateA;
    });
  }, [filteredOpportunities, filters.sort]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedOpportunities.length / ITEMS_PER_PAGE) || 1;
  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedOpportunities.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedOpportunities, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Opportunity Intelligence Catalog</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Filter through verified technical internships, scholarships, hackathons, and research fellowships.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search keywords, skills, roles..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <OpportunityFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={sortedOpportunities.length}
            />
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-700">
            {sortedOpportunities.length} {sortedOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'}
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={Filter}
            onClick={() => setMobileFilterOpen(true)}
            className="text-xs font-bold"
          >
            Filters
          </Button>
        </div>

        {/* Main Feed Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips Bar */}
          {(filters.type !== 'all' || filters.mode !== 'all' || filters.deadline !== 'all' || filters.stipendTier !== 'all' || filters.verifiedOnly) && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-slate-400 font-medium">Active:</span>
              {filters.type !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                  <span>Type: {filters.type}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('type', 'all')} />
                </span>
              )}
              {filters.mode !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                  <span>Mode: {filters.mode}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('mode', 'all')} />
                </span>
              )}
              {filters.stipendTier !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                  <span>Stipend: {filters.stipendTier}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('stipendTier', 'all')} />
                </span>
              )}
              {filters.verifiedOnly && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  <span>Verified Only</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('verifiedOnly', false)} />
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-slate-800 font-semibold underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : paginatedOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No opportunities found"
              description="No active listings match your selected search criteria. Try adjusting your filters or resetting."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-100 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-base font-bold text-slate-900">Filter Opportunities</div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <OpportunityFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={sortedOpportunities.length}
            />

            <Button
              variant="primary"
              size="md"
              className="w-full justify-center mt-4 bg-slate-900"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters ({sortedOpportunities.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
