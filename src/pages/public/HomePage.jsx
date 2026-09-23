import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Zap,
  Globe,
  Award,
  Layers,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import Button from '../../components/common/Button';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import OrganizationLogo from '../../components/common/OrganizationLogo';
import { useOpportunities } from '../../context/OpportunityContext';
import { useAuth } from '../../context/AuthContext';
import { getDeadlineStatus } from '../../utils/dateUtils';
import { formatRelativeVerificationTime } from '../../services/opportunityAgent/freshnessEngine';

const QUICK_CATEGORY_PILLS = [
  { id: 'all', label: 'All Opportunities' },
  { id: 'Internship', label: 'Internships' },
  { id: 'Scholarship', label: 'Scholarships' },
  { id: 'Hackathon', label: 'Hackathons' },
  { id: 'Fellowship', label: 'Fellowships' },
  { id: 'Research', label: 'Research' },
  { id: 'Open Source', label: 'Open Source' },
  { id: 'AI / ML', label: 'AI & ML' },
  { id: 'High Stipend', label: 'High Stipend (₹50k+)' }
];

export default function HomePage() {
  const { opportunities, loading, lastSyncedAt } = useOpportunities();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPill, setSelectedPill] = useState('all');
  const [activeSort, setActiveSort] = useState('newest'); // 'newest' | 'closing_soon' | 'stipend'

  const safeOpportunities = opportunities || [];

  // Filter & sort active opportunities
  const filteredFeed = useMemo(() => {
    let list = safeOpportunities.filter((opp) => {
      // Exclude expired opportunities by default from homepage
      const dl = getDeadlineStatus(opp.deadline || opp.applicationDeadline);
      if (dl.isExpired) return false;

      // Category Pill filter
      if (selectedPill === 'High Stipend') {
        return (opp.stipendAmount && opp.stipendAmount >= 50000) || (opp.stipend && (opp.stipend.includes('50,000') || opp.stipend.includes('80,000') || opp.stipend.includes('Lakh') || opp.stipend.includes('1,00,000')));
      }
      if (selectedPill === 'AI / ML') {
        const cat = (opp.category || '').toLowerCase();
        const title = (opp.title || '').toLowerCase();
        const skills = (Array.isArray(opp.skills) ? opp.skills.join(' ') : opp.skills || '').toLowerCase();
        return cat.includes('ai') || cat.includes('ml') || title.includes('ai') || title.includes('machine learning') || skills.includes('pytorch');
      }
      if (selectedPill !== 'all') {
        const typeMatch = (opp.type || '').toLowerCase() === selectedPill.toLowerCase();
        const catMatch = (opp.category || '').toLowerCase().includes(selectedPill.toLowerCase());
        return typeMatch || catMatch;
      }
      return true;
    });

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((opp) => {
        const title = (opp.title || '').toLowerCase();
        const org = (opp.organization || opp.company || '').toLowerCase();
        const desc = (opp.description || '').toLowerCase();
        const skills = (Array.isArray(opp.skills) ? opp.skills.join(' ') : opp.skills || '').toLowerCase();
        const loc = (opp.location || '').toLowerCase();
        return title.includes(q) || org.includes(q) || desc.includes(q) || skills.includes(q) || loc.includes(q);
      });
    }

    // Sort order
    if (activeSort === 'closing_soon') {
      list.sort((a, b) => {
        const dlA = new Date(a.deadline || a.applicationDeadline || '2099-01-01').getTime();
        const dlB = new Date(b.deadline || b.applicationDeadline || '2099-01-01').getTime();
        return dlA - dlB;
      });
    } else if (activeSort === 'stipend') {
      list.sort((a, b) => (b.stipendAmount || 0) - (a.stipendAmount || 0));
    } else {
      // newest first
      list.sort((a, b) => new Date(b.postedDate || b.created_at || '2026-01-01').getTime() - new Date(a.postedDate || a.created_at || '2026-01-01').getTime());
    }

    return list;
  }, [safeOpportunities, selectedPill, searchQuery, activeSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/opportunities?search=' + encodeURIComponent(searchQuery.trim()));
    } else {
      navigate('/opportunities');
    }
  };

  const activeCount = safeOpportunities.filter((o) => {
    const dl = getDeadlineStatus(o.deadline || o.applicationDeadline);
    return !dl.isExpired;
  }).length;

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO & LIVE OPPORTUNITY AGGREGATION BANNER                             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800 pt-12 pb-16 sm:pt-16 sm:pb-20">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 via-brand-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          {/* Live Data Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-inner text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-slate-300">Live Data</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-sans font-medium">{activeCount} active opportunities verified</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-sans font-semibold">
              Updated {lastSyncedAt ? formatRelativeVerificationTime(lastSyncedAt) : 'recently'}
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Opportunities Worth Chasing.
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Internships, scholarships, hackathons, fellowships and programs — discovered, verified and updated continuously from official portals.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI internships in Bangalore, STEM scholarships, hackathons..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 text-sm sm:text-base bg-slate-950/90 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-1 shadow-sm"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-4xl mx-auto">
            {QUICK_CATEGORY_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedPill(pill.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  selectedPill === pill.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-3 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">{safeOpportunities.length}+</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Verified Opportunities</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400">Direct</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Official Portals Only</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">₹ Cr+</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Stipends & Grants Tracked</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xl sm:text-2xl font-black text-indigo-400">Continuous</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Verification Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE OPPORTUNITIES FEED                                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Feed Header with Sort & View Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Live Opportunity Feed
              </h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                {filteredFeed.length} available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active engineering, research, and developer programs accepting applications today.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveSort('newest')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeSort === 'newest' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setActiveSort('closing_soon')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeSort === 'closing_soon' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Closing Soon
              </button>
              <button
                type="button"
                onClick={() => setActiveSort('stipend')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeSort === 'stipend' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Highest Stipend
              </button>
            </div>

            <Link
              to="/opportunities"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 transition"
            >
              <span>Explore All Filters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Opportunity Cards Grid */}
        {filteredFeed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.slice(0, 18).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No opportunities match the current filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try switching category pills or clearing search terms to explore all active programs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPill('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View All Button */}
        {filteredFeed.length > 18 && (
          <div className="pt-8 text-center">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
            >
              <span>View All {filteredFeed.length} Opportunities →</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
