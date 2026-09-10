import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  Compass,
  BookmarkCheck,
  TrendingUp,
  Flame,
  CheckCircle2,
  PlusCircle,
  Briefcase,
  Trophy,
  Code,
  GraduationCap,
  BookOpen,
  Rocket,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Award,
  Zap,
  Bot,
  Activity,
  Globe,
  Check,
  Clock,
  Layers,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { useAuth } from '../../context/AuthContext';
import { getDeadlineStatus } from '../../utils/dateUtils';
import { OPPORTUNITY_TYPES, MOCK_DEFAULT_STUDENT } from '../../data/mockOpportunities';
import { calculateOpportunityMatch } from '../../utils/recommendation';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const { opportunities, isAgentRunning, agentStats } = useOpportunities();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const studentProfile = profile || MOCK_DEFAULT_STUDENT;
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/opportunities');
    }
  };

  const handleQuickSearch = (term) => {
    navigate(`/opportunities?search=${encodeURIComponent(term)}`);
  };

  // 1. Trending Opportunities (Featured + High Views)
  const trendingOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 2. Freshly Added by AI
  const freshOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published')
      .sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 3. Closing Soon (Earliest active deadlines)
  const closingSoonOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => {
        if (o.status !== 'published') return false;
        const d = getDeadlineStatus(o.deadline);
        return !d.isExpired && d.daysLeft !== null && d.daysLeft <= 45;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 4. AI Recommended for You
  const recommendedOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published')
      .map((opp) => {
        const match = calculateOpportunityMatch(opp, studentProfile);
        return { ...opp, matchScore: match.score, matchReasons: match.reasons };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [safeOpportunities, studentProfile]);

  // 5. Hackathons & Competitions
  const hackathons = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published' && (o.type === 'Hackathon' || o.type === 'Competition'))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 6. Research Fellowships & Grants
  const researchOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published' && (o.type === 'Research' || o.type === 'Fellowship'))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 7. Remote Opportunities
  const remoteOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published' && (o.mode === 'Remote' || o.location?.toLowerCase().includes('remote')))
      .slice(0, 6);
  }, [safeOpportunities]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does CampusLaunch verify that opportunities are genuine?',
      a: 'Our autonomous AI Opportunity Agent continuously scans registered official foundations, universities, ministries, and enterprise career portals. Every listing undergoes multi-factor verification: URL domain verification, deadline validity, stipend authentication, and duplicate filtering before being published.'
    },
    {
      q: 'Are all application links directly to the official portals?',
      a: 'Yes, 100%. CampusLaunch does not redirect you through intermediary spam walls or affiliate gateways. Clicking "Apply Now" connects you directly to the official organization or government application portal.'
    },
    {
      q: 'How does the AI recommendation match score work?',
      a: 'The engine compares your academic branch, graduation year, core technical skills, and career interests against the structured requirements of each posting using semantic alignment.'
    },
    {
      q: 'Is CampusLaunch completely free for students?',
      a: 'Yes, CampusLaunch is 100% free and open for college students across all engineering and technical disciplines.'
    },
    {
      q: 'How often is the opportunity database refreshed?',
      a: 'The autonomous AI agent audits and refreshes the database every 6 hours, detecting newly released cohorts and automatically archiving expired deadlines.'
    }
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 border-b border-slate-200/80">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-brand-100/50 via-indigo-100/30 to-purple-100/40 blur-3xl -z-10 pointer-events-none rounded-full animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            {/* Live Agent Pulse Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-subtle text-slate-700 text-xs font-bold tracking-wide animate-fade-in backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-800 font-extrabold uppercase tracking-wider text-[11px]">AI Engine Active</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">100% Official Verified Portals</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] sm:leading-[1.1] animate-fade-up">
              Find Your Next <br className="hidden sm:inline" />
              <span className="text-gradient">
                Opportunity.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Internships, hackathons, research programs, fellowships, and scholarships — discovered, verified, and categorized by AI.
            </p>

            {/* Modern Search Box with Quick Tags */}
            <div className="w-full max-w-2xl space-y-3">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 p-2.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all duration-300"
              >
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Search className="w-5 h-5 text-brand-600" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search internships, hackathons, skills, or companies (e.g. Python, GSoC, AICTE)..."
                  className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none py-2"
                />
                <Button type="submit" variant="primary" size="md" className="flex-shrink-0 font-bold px-6 shadow-md shadow-brand-600/20">
                  <span>Explore</span>
                </Button>
              </form>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Trending searches:</span>
                {[
                  { label: '🔥 Google Summer of Code', query: 'Google Summer of Code' },
                  { label: '🏆 Smart India Hackathon', query: 'Smart India Hackathon' },
                  { label: '🔬 CERN Research', query: 'CERN' },
                  { label: '💼 Amazon WOW', query: 'Amazon WOW' },
                  { label: '🌐 Remote', query: 'Remote' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSearch(chip.query)}
                    className="px-3 py-1 rounded-full bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 text-slate-600 font-medium border border-slate-200/80 transition shadow-xs text-[11px]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link to="/opportunities">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="font-extrabold px-8 shadow-lg shadow-brand-600/25">
                  Explore All Opportunities
                </Button>
              </Link>
              <Link to="/submit">
                <Button variant="outline" size="lg" icon={PlusCircle} className="font-bold border-slate-300 hover:bg-slate-50">
                  Submit an Opportunity
                </Button>
              </Link>
            </div>

            {/* Interactive Live AI Engine Flow Graphic */}
            <div className="w-full pt-8 sm:pt-12">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 relative overflow-hidden text-left">
                {/* Background glow and grid overlay */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-brand-400">
                        Autonomous Ingestion Flow
                      </div>
                      <div className="text-base sm:text-lg font-black text-white">
                        How CampusLaunch AI Discovers & Verifies
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Continuous Radar: 100% Real-Time</span>
                  </div>
                </div>

                {/* 5 Pipeline Stages Visual */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-6">
                  {[
                    { step: '01', title: 'DISCOVER', desc: 'Scan official portals & foundations', icon: Globe, color: 'text-sky-400' },
                    { step: '02', title: 'UNDERSTAND', desc: 'LLM extracts skills & deadlines', icon: Bot, color: 'text-indigo-400' },
                    { step: '03', title: 'VERIFY', desc: 'Multi-point domain authenticity', icon: ShieldCheck, color: 'text-emerald-400' },
                    { step: '04', title: 'MATCH', desc: 'Student branch & skill alignment', icon: Sparkles, color: 'text-amber-400' },
                    { step: '05', title: 'YOUR FUTURE', desc: 'Apply directly on official link', icon: Rocket, color: 'text-rose-400' }
                  ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:border-brand-500/50 transition relative group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{st.step}</span>
                        <st.icon className={`w-4 h-4 ${st.color}`} />
                      </div>
                      <h4 className="text-xs font-black tracking-wide text-white mb-1">{st.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug font-medium">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Trust Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{safeOpportunities.length}+</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Verified Real Opportunities</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-brand-600">100%</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Authentic Official Links</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">₹1 Cr+</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Stipends & Prizes Pool</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">6 Hours</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Automated Refresh Cycle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 🔥 TRENDING OPPORTUNITIES SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>High Student Demand</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trending Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Most viewed and actively shared opportunities by engineering students this week.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-800 transition"
          >
            <span>View All ({safeOpportunities.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 🤖 AI RECOMMENDED FOR YOU SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-brand-950 text-white shadow-2xl border border-indigo-900/50 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-800/40">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart Academic Matching</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Recommended For You
              </h2>
              <p className="text-sm text-slate-300">
                Matched against {studentProfile.branch} • {studentProfile.year} • {Array.isArray(studentProfile.skills) ? studentProfile.skills.slice(0, 4).join(', ') : 'Tech Skills'}
              </p>
            </div>
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition backdrop-blur-sm self-start sm:self-auto"
            >
              <span>Explore All Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} showRecommendationBadge={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ⏰ CLOSING SOON (URGENT DEADLINES) SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>Time-Sensitive Cohorts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Closing Soon
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Verified deadlines approaching. Make sure to complete your applications before portals close.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-800 transition"
          >
            <span>View All Deadlines</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closingSoonOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 🏆 HACKATHONS & CODING BATTLES */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-600 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span>National & Global Hackathons</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hackathons & Competitions
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Build prototypes, win grand prize pools, and secure fast-track interview rounds.
            </p>
          </div>
          <Link
            to="/opportunities?type=Hackathon"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-800 transition"
          >
            <span>View All Hackathons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. 🔬 RESEARCH FELLOWSHIPS & GRANTS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>Premier Academic Laboratories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Research Programs & Fellowships
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Paid academic research summer internships at CERN, ISRO, DRDO, IIT Bombay, and IISc.
            </p>
          </div>
          <Link
            to="/opportunities?type=Research"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-800 transition"
          >
            <span>View All Research Fellowships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. "MEET YOUR OPPORTUNITY AI" SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
              <Bot className="w-4 h-4 text-brand-400" />
              <span>CampusLaunch Intelligence Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Meet Your Opportunity AI
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Unlike traditional job portals loaded with outdated ads and expired links, CampusLaunch runs an 11-stage autonomous agent pipeline to keep every opportunity genuine, active, and tailored for college students.
            </p>
          </div>

          {/* 3 Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Zero Fake Links Policy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated multi-point verification blocks spam and enforces that every application URL directly opens authentic official portals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">AI Strategy & Interview Prep</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by GLM 5.3, the agent analyzes job requirements and generates custom interview study plans and key skill focus areas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Automated Freshness Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Past deadlines are automatically transitioned to Expired so you never waste time applying to closed opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ ACCORDION SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle transition"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                    openFaq === idx ? 'transform rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-center shadow-xl space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Launch Your Career?
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed">
              Explore hundreds of verified student opportunities or share an authentic opening from your college placement cell.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/opportunities">
              <Button variant="secondary" size="lg" className="font-extrabold px-8 bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
                Explore All Opportunities
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="font-bold border-white/40 text-white hover:bg-white/10">
                Create Free Student Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
