import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Compass,
  CheckCircle2,
  Sparkles,
  Globe,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import OpportunityFilters from '../../components/opportunities/OpportunityFilters';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useOpportunities } from '../../context/OpportunityContext';
import { discoverLiveOpportunitiesWithOcten } from '../../services/octenService';

const ITEMS_PER_PAGE = 12;

export default function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { opportunities, loading } = useOpportunities();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'live_web'
  const [liveWebResults, setLiveWebResults] = useState([]);
  const [liveWebLoading, setLiveWebLoading] = useState(false);

  // Parse filters from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('category') || searchParams.get('type') || 'all',
    mode: searchParams.get('mode') || 'all',
    branch: searchParams.get('branch') || 'all',
    year: searchParams.get('year') || 'all',
    deadline: searchParams.get('deadline') || 'all',
    stipendTier: searchParams.get('stipend') || 'all',
    sort: searchParams.get('sort') || 'newest',
    verifiedOnly: searchParams.get('verified') === 'true'
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || '',
      type: searchParams.get('category') || searchParams.get('type') || 'all',
      mode: searchParams.get('mode') || 'all',
      branch: searchParams.get('branch') || 'all',
      year: searchParams.get('year') || 'all',
      deadline: searchParams.get('deadline') || 'all',
      stipendTier: searchParams.get('stipend') || 'all',
      sort: searchParams.get('sort') || 'newest',
      verifiedOnly: searchParams.get('verified') === 'true'
    }));
  }, [searchParams]);

  // If live web tab is selected, query Octen Search
  const handleLiveWebSearch = async (query) => {
    setActiveTab('live_web');
    setLiveWebLoading(true);
    try {
      const results = await discoverLiveOpportunitiesWithOcten(query || 'student internships hackathons 2026');
      setLiveWebResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLiveWebLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    setCurrentPage(1);

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
    setActiveTab('catalog');
  };

  // Filter & Sort Pipeline
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = opp.title?.toLowerCase().includes(q);
        const matchesOrg = (opp.organization || opp.company)?.toLowerCase().includes(q);
        const matchesDesc = opp.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc) return false;
      }

      if (filters.type && filters.type !== 'all') {
        const oppCat = (opp.category || opp.type || '').toLowerCase();
        const filterCat = filters.type.toLowerCase();
        if (filterCat === 'internship' && !oppCat.includes('intern')) return false;
        if (filterCat === 'scholarship' && !oppCat.includes('scholar')) return false;
        if (filterCat === 'hackathon' && !oppCat.includes('hack')) return false;
        if (filterCat === 'fellowship' && !oppCat.includes('fellow')) return false;
        if (filterCat === 'research' && !oppCat.includes('research')) return false;
        if (filterCat === 'opensource' && !oppCat.includes('open') && !oppCat.includes('gsoc')) return false;
        if (filterCat === 'aiml' && !oppCat.includes('ai') && !oppCat.includes('ml')) return false;
        if (filterCat === 'government' && !oppCat.includes('gov') && !oppCat.includes('psu') && !oppCat.includes('aicte')) return false;
      }

      if (filters.mode && filters.mode !== 'all') {
        if (filters.mode === 'Remote' && !opp.is_remote && opp.work_mode !== 'Remote') return false;
        if (filters.mode === 'On-site' && opp.is_remote) return false;
      }

      if (filters.verifiedOnly && !opp.verified) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'deadline_soon') {
        return new Date(a.deadline || '2099-01-01') - new Date(b.deadline || '2099-01-01');
      }
      return (b.id > a.id ? 1 : -1);
    });
  }, [opportunities, filters]);

  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE) || 1;
  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOpportunities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOpportunities, currentPage]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5A00] mb-1">
                <Compass className="w-4 h-4 text-[#FF5A00]" />
                <span>Opportunity Discovery Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Explore Opportunities
              </h1>
            </div>

            {/* Live Count & Octen Status */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{filteredOpportunities.length} Verified in Catalog</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-800">
                <Globe className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>Octen Live Web Search Active</span>
              </span>
            </div>
          </div>

          {/* Search Bar & Mode Selector */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'live_web' ? handleLiveWebSearch(filters.search) : null)}
                placeholder="Search by title, company, skills (e.g. Python, Microsoft, GSoC)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-[#FF5A00]/10 transition-all font-medium"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Source Tab Toggle: Catalog vs Octen Live Web */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified Catalog
              </button>
              <button
                type="button"
                onClick={() => handleLiveWebSearch(filters.search)}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'live_web'
                    ? 'bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-orange-600'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live Web (Octen)</span>
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FF5A00]" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'live_web' ? (
          /* Live Web Search Results from Octen */
          <div className="space-y-6">
            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-orange-900">
                <Globe className="w-4 h-4 text-[#FF5A00] flex-shrink-0" />
                <span>
                  Showing real-time web opportunities discovered via <strong>Octen Search API</strong> for: <em>"{filters.search || 'Latest Student Opportunities'}"</em>
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleLiveWebSearch(filters.search)}
                className="text-xs font-bold text-[#FF5A00] hover:underline"
              >
                Re-scan Web
              </button>
            </div>

            {liveWebLoading ? (
              <LoadingSkeleton count={6} />
            ) : liveWebResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveWebResults.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Globe}
                title="No live web results found"
                description="Try a different query or switch back to the verified catalog."
                actionLabel="View Verified Catalog"
                onAction={() => setActiveTab('catalog')}
              />
            )}
          </div>
        ) : (
          /* Catalog View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <OpportunityFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  totalResults={filteredOpportunities.length}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <LoadingSkeleton count={6} />
              ) : paginatedOpportunities.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {paginatedOpportunities.map((opp) => (
                      <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={Compass}
                  title="No opportunities found"
                  description="Try tweaking your search keywords or search the live web via Octen AI."
                  actionLabel="Search Live Web via Octen"
                  onAction={() => handleLiveWebSearch(filters.search)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Filter Opportunities</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
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

            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] rounded-xl shadow-xs"
              >
                View {filteredOpportunities.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
