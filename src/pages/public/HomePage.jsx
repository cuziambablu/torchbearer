import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Code2,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  Flame,
  Award,
} from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import TorchbearerRing from '../../components/common/TorchbearerRing';
import AIGuideModal from '../../components/common/AIGuideModal';

export default function HomePage() {
  const { opportunities, loading } = useOpportunities();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiGuideOpen, setAiGuideOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/opportunities');
    }
  };

  const featuredOpportunities = opportunities.slice(0, 6);
  const activeCount = opportunities.length || 69;

  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-hidden">
      {/* =========================================================================
          HERO SECTION with the Signature Glowing Torchbearer Ring
      ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Luminous Torchbearer Ring Background Motif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-70 pointer-events-none">
          <TorchbearerRing size="hero" animated={true} withAura={true} />
        </div>

        {/* Ambient Warm Atmosphere Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-50/40 via-transparent to-transparent -z-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Live Data Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-subtle mb-6 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700">
              LIVE DATA • <span className="text-[#FF5A00] font-bold">{activeCount} ACTIVE OPPORTUNITIES</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">• UPDATED REAL-TIME</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] max-w-4xl mx-auto mb-6">
            Your next opportunity is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FFA600]">
              closer than you think.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Torchbearer AI discovers verified internships, hackathons, research fellowships, and STEM scholarships from 40+ official sources with AI-powered guidance.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-2xl bg-white border border-slate-200/90 p-1.5 focus-within:border-[#FF5A00] focus-within:ring-4 focus-within:ring-[#FF5A00]/10 transition-all">
              <div className="pl-3.5 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Microsoft, GSoC, AI internships, hackathons..."
                className="w-full py-2.5 text-sm font-medium text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] rounded-xl shadow-[0_4px_16px_rgba(255,77,0,0.28)] hover:shadow-[0_6px_22px_rgba(255,77,0,0.38)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-medium">Trending:</span>
              <Link
                to="/opportunities?category=internship"
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1"
              >
                <Briefcase className="w-3 h-3 text-slate-500" />
                Internships
              </Link>
              <Link
                to="/opportunities?category=hackathon"
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1"
              >
                <Code2 className="w-3 h-3 text-slate-500" />
                Hackathons
              </Link>
              <Link
                to="/opportunities?category=scholarship"
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1"
              >
                <GraduationCap className="w-3 h-3 text-slate-500" />
                Scholarships
              </Link>
              <Link
                to="/opportunities?category=fellowship"
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1"
              >
                <Award className="w-3 h-3 text-slate-500" />
                Fellowships
              </Link>
            </div>
          </div>

          {/* Floating UI Opportunity Cards */}
          <div className="hidden lg:grid grid-cols-3 gap-5 max-w-4xl mx-auto text-left pt-4">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-card hover:border-orange-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Microsoft</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  Remote
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">Software Engineering Intern</h4>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-800">₹40,000 / mo</span>
                <Link to="/opportunities" className="font-semibold text-[#FF5A00] hover:text-[#FF2400] flex items-center gap-0.5">
                  Apply <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-card hover:border-orange-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">National SIH</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                  Hackathon
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">Smart India Hackathon 2026</h4>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-800">₹1,00,000 Prize</span>
                <Link to="/opportunities" className="font-semibold text-[#FF5A00] hover:text-[#FF2400] flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-card hover:border-orange-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">DAAD / CERN</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-[#FF5A00] border border-orange-200 rounded-md">
                  Fellowship
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">Summer Research Fellowship</h4>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-800">Full Grant</span>
                <Link to="/opportunities" className="font-semibold text-[#FF5A00] hover:text-[#FF2400] flex items-center gap-0.5">
                  Explore <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED OPPORTUNITIES SECTION
      ========================================================================= */}
      <section className="py-16 bg-[#FAFAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5A00] mb-1">
                <Flame className="w-4 h-4 text-[#FF5A00]" />
                <span>Featured & Urgent</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Your next big opportunity could start here.
              </h2>
            </div>
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-3.5 py-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors w-fit"
            >
              <span>View all {activeCount} opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Opportunity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          AI PERSONALIZATION BANNER (Clean, Luminous White & Orange Gradient Theme)
      ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-white via-[#FFFBF8] to-[#FFF5ED] p-8 md:p-12 overflow-hidden border border-orange-200/80 shadow-[0_12px_40px_rgba(255,115,0,0.06)]">
            {/* Subtle Torch Accent Light */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D00]/15 via-[#FFA600]/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-bold text-[#FF5A00] mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>AI Recommendation Engine</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
                Tailored directly to your skills & career goals.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Tell Torchbearer AI what you study, your tech stack, and your dream roles. Our match engine scores and surfaces opportunities with precise relevance.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAiGuideOpen(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] rounded-xl shadow-[0_4px_16px_rgba(255,77,0,0.28)] hover:shadow-[0_6px_22px_rgba(255,77,0,0.38)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch AI Career Guide</span>
                </button>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors"
                >
                  Create Student Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Guide Modal */}
      {aiGuideOpen && <AIGuideModal isOpen={aiGuideOpen} onClose={() => setAiGuideOpen(false)} />}
    </div>
  );
}
