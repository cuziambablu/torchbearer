import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown, ShieldCheck } from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import OpportunityFilters from '../../components/opportunities/OpportunityFilters';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { getDeadlineStatus } from '../../utils/dateUtils';

const ITEMS_PER_PAGE = 6;

export default function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { opportunities, loading } = useOpportunities();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Parse filters from URL search params or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'all',
    mode: searchParams.get('mode') || 'all',
    branch: searchParams.get('branch') || 'all',
    year: searchParams.get('year') || 'all',
    deadline: searchParams.get('deadline') || 'all',
    sort: searchParams.get('sort') || 'newest',
    verifiedOnly: searchParams.get('verified') === 'true',
    collegeExclusive: searchParams.get('exclusive') === 'true'
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
      sort: searchParams.get('sort') || 'newest',
      verifiedOnly: searchParams.get('verified') === 'true',
      collegeExclusive: searchParams.get('exclusive') === 'true'
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
        else if (k === 'collegeExclusive') newParams.set('exclusive', 'true');
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
      sort: 'newest',
      verifiedOnly: false,
      collegeExclusive: false
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    const now = new Date();
    return opportunities
      .filter((opp) => {
        // 1. Only published opportunities in public browse
        if (opp.status !== 'published') return false;

        // 2. Automated Expiration: Exclude past deadlines from public discovery
        if (opp.deadline && new Date(opp.deadline) < now) {
          return false;
        }

        // 3. Verified only filter
        if (filters.verifiedOnly && opp.verificationStatus !== 'verified') {
          return false;
        }

        // 4. College exclusive filter
        if (filters.collegeExclusive && !opp.isCollegeExclusive) {
          return false;
        }

        // 5. Search text matching (title, org, skills, description, type, source)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const titleMatch = (opp.title || '').toLowerCase().includes(query);
          const orgMatch = (opp.organization || '').toLowerCase().includes(query);
          const descMatch = (opp.description || '').toLowerCase().includes(query);
          const typeMatch = (opp.type || '').toLowerCase().includes(query);
          const sourceMatch = (opp.sourceName || '').toLowerCase().includes(query);
          const skillMatch = (opp.skills || []).some((s) => s.toLowerCase().includes(query));

          if (!titleMatch && !orgMatch && !descMatch && !typeMatch && !skillMatch && !sourceMatch) {
            return false;
          }
        }

        // 6. Type filter
        if (filters.type !== 'all' && opp.type !== filters.type) {
          return false;
        }

        // 7. Mode filter
        if (filters.mode !== 'all' && opp.mode !== filters.mode) {
          return false;
        }

        // 8. Branch filter
        if (filters.branch !== 'all' && opp.targetBranches && opp.targetBranches.length > 0) {
          const matches = opp.targetBranches.includes(filters.branch) || opp.targetBranches.includes('Other');
          if (!matches) return false;
        }

        // 9. Year filter
        if (filters.year !== 'all' && opp.targetYears && opp.targetYears.length > 0) {
          const matches = opp.targetYears.includes(filters.year);
          if (!matches) return false;
        }

        // 10. Deadline timeframe filter
        if (filters.deadline !== 'all') {
          const dl = getDeadlineStatus(opp.deadline);
          if (dl.isExpired) return false;

          if (filters.deadline === 'today' && dl.daysLeft > 1) return false;
          if (filters.deadline === 'week' && dl.daysLeft > 7) return false;
          if (filters.deadline === 'month' && dl.daysLeft > 30) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'deadline_soon') {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        if (filters.sort === 'popular') {
          return (b.views || 0) - (a.views || 0);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [opportunities, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOpportunities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOpportunities, currentPage]);

  const activeFilterPills = useMemo(() => {
    const pills = [];
    if (filters.search) pills.push({ key: 'search', label: `Search: "${filters.search}"` });
    if (filters.type !== 'all') pills.push({ key: 'type', label: `Type: ${filters.type}` });
    if (filters.mode !== 'all') pills.push({ key: 'mode', label: `Mode: ${filters.mode}` });
    if (filters.branch !== 'all') pills.push({ key: 'branch', label: `Branch: ${filters.branch}` });
    if (filters.year !== 'all') pills.push({ key: 'year', label: `Year: ${filters.year}` });
    if (filters.deadline !== 'all') pills.push({ key: 'deadline', label: `Deadline: ${filters.deadline}` });
    if (filters.verifiedOnly) pills.push({ key: 'verifiedOnly', label: '✓ Verified Only' });
    if (filters.collegeExclusive) pills.push({ key: 'collegeExclusive', label: '🎓 College Exclusive' });
    return pills;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore Opportunities
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Discover active and verified internships, hackathons, scholarships, and fellowships across verified organizations.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by title, organization, skill (e.g., Python, React, IoT)..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200/90 rounded-2xl shadow-subtle text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="md"
            icon={SlidersHorizontal}
            onClick={() => setMobileFilterOpen(true)}
            className="w-full sm:w-auto"
          >
            Filters {activeFilterPills.length > 0 && `(${activeFilterPills.length})`}
          </Button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFilterPills.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-6 animate-fade-in">
          <span className="text-xs font-semibold text-slate-500">Active filters:</span>
          {activeFilterPills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 shadow-subtle"
            >
              <span>{pill.label}</span>
              <button
                type="button"
                onClick={() =>
                  handleFilterChange(
                    pill.key,
                    pill.key === 'search' ? '' : pill.key.includes('Only') || pill.key.includes('Exclusive') ? false : 'all'
                  )
                }
                className="hover:text-brand-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-medium text-slate-500 hover:text-brand-600 ml-2 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Layout: Left Filters + Right Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <OpportunityFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredOpportunities.length}
          />
        </div>

        {/* Opportunities Grid Section */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : paginatedOpportunities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            <EmptyState
              title="No active opportunities match your criteria"
              description="We couldn't find any opportunities matching your specific filters. Try clearing some filters or searching for different keywords."
              actionLabel="Reset all filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Filter Listings</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <OpportunityFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalResults={filteredOpportunities.length}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({filteredOpportunities.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
