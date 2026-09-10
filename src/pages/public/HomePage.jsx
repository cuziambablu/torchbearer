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
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import Button from '../../components/common/Button';
import BrandLogo from '../../components/common/BrandLogo';
import AIGuideModal from '../../components/common/AIGuideModal';
import { useOpportunities } from '../../context/OpportunityContext';
import { useAuth } from '../../context/AuthContext';
import { getDeadlineStatus } from '../../utils/dateUtils';
import { OPPORTUNITY_TYPES, MOCK_DEFAULT_STUDENT } from '../../data/mockOpportunities';
import { calculateOpportunityMatch } from '../../utils/recommendation';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);
  const { opportunities } = useOpportunities();
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

  // 1. Trending Opportunities
  const trendingOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 2. Closing Soon
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

  // 3. AI Recommended for You
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

  // 4. Research Programs
  const researchOpportunities = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published' && (o.type === 'Research' || o.type === 'Fellowship'))
      .slice(0, 6);
  }, [safeOpportunities]);

  // 5. Hackathons
  const hackathons = useMemo(() => {
    return safeOpportunities
      .filter((o) => o.status === 'published' && (o.type === 'Hackathon' || o.type === 'Competition'))
      .slice(0, 6);
  }, [safeOpportunities]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is Torchbearer AI?',
      a: 'Torchbearer AI is an intelligent opportunity discovery and career guidance platform for college students. It continuously discovers, authenticates, and matches verified internships, hackathons, research fellowships, and scholarships.'
    },
    {
      q: 'How does Torchbearer AI verify opportunities?',
      a: 'Our autonomous agent continuously audits registered university programs, open-source foundations, government portals, and enterprise career hubs. It verifies application URLs, confirms deadlines, and blocks placeholder or fraudulent links.'
    },
    {
      q: 'How does the Torchbearer AI Guide work?',
      a: 'You can ask the AI Guide about your specific skills, goals, and branch (e.g. "I know Python and I want remote research fellowships"). The AI analyzes the active catalog and provides grounded recommendations with personalized interview preparation strategies.'
    },
    {
      q: 'Are all application links direct to official portals?',
      a: 'Yes, 100%. Torchbearer AI enforces a zero-spam policy. Every single "Apply Now" link connects you directly to the official government or organization portal.'
    },
    {
      q: 'Is Torchbearer AI completely free for students?',
      a: 'Yes, Torchbearer AI is 100% free and open for college students worldwide.'
    }
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-14 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-slate-100/60 border-b border-slate-200/80">
        {/* Luminous Torch Flare Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[480px] bg-gradient-to-tr from-amber-200/40 via-orange-100/30 to-amber-100/20 blur-3xl -z-10 pointer-events-none rounded-full animate-pulse-glow" />
        <div className="absolute top-32 left-10 w-80 h-80 bg-amber-300/15 blur-3xl -z-10 pointer-events-none rounded-full" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-orange-300/15 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-amber-200/80 shadow-subtle text-amber-900 text-xs font-bold tracking-wide animate-fade-in backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-amber-800 font-extrabold uppercase tracking-wider text-[11px]">TORCHBEARER AI</span>
              <span className="text-amber-300">•</span>
              <span className="text-slate-600 font-medium">Light the way to your future</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1] animate-fade-up">
              Light the way to <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                your future.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              One intelligent platform for the opportunities that shape your career. Internships, hackathons, research programs, and fellowships — found and verified by AI.
            </p>

            {/* Modern Search Box with Quick Tags */}
            <div className="w-full max-w-2xl space-y-3">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center bg-white rounded-3xl shadow-xl shadow-amber-900/5 border border-slate-200/90 p-2.5 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all duration-300"
              >
                <div className="pl-3.5 pr-2 text-amber-600">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities by title, organization, or skill (e.g., GSoC, AICTE, CERN)..."
                  className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none py-2 font-medium"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-shrink-0 font-bold px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md shadow-amber-500/25"
                >
                  <span>Explore</span>
                </Button>
              </form>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-bold text-slate-400">Trending tracks:</span>
                {[
                  { label: '🔥 Google Summer of Code', query: 'Google Summer of Code' },
                  { label: '🏆 Smart India Hackathon', query: 'Smart India Hackathon' },
                  { label: '🔬 CERN Research', query: 'CERN' },
                  { label: '💼 Amazon WOW', query: 'Amazon WOW' },
                  { label: '🌐 Remote Fellowships', query: 'Remote' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSearch(chip.query)}
                    className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 text-slate-600 font-semibold border border-slate-200/80 transition shadow-xs text-[11px]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link to="/opportunities">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="font-black px-8 bg-slate-950 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20"
                >
                  Explore Opportunities
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setAiGuideOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-800 font-bold text-sm border border-slate-200 shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ask Torchbearer AI</span>
              </button>
            </div>

            {/* Signature Torchbearer Interactive Guidance Flow */}
            <div className="w-full pt-10 sm:pt-14">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800 relative overflow-hidden text-left">
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-amber-400">
                        Intelligent Guidance Architecture
                      </div>
                      <div className="text-base sm:text-lg font-black text-white">
                        How Torchbearer AI Illuminates Your Path
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-800/40">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>100% Genuine Portals Audited</span>
                  </div>
                </div>

                {/* 5 Stages Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-6">
                  {[
                    { step: '01', title: 'DISCOVER', desc: 'Scan official portals & foundations', icon: Globe, color: 'text-amber-400' },
                    { step: '02', title: 'UNDERSTAND', desc: 'LLM extracts skills & deadlines', icon: Bot, color: 'text-orange-400' },
                    { step: '03', title: 'VERIFY', desc: 'Multi-point domain authenticity', icon: ShieldCheck, color: 'text-emerald-400' },
                    { step: '04', title: 'MATCH', desc: 'Student branch & skill alignment', icon: Sparkles, color: 'text-indigo-400' },
                    { step: '05', title: 'GUIDE', desc: 'Apply with interview prep strategies', icon: Rocket, color: 'text-rose-400' }
                  ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition relative group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500">{st.step}</span>
                        <st.icon className={`w-4 h-4 ${st.color}`} />
                      </div>
                      <h4 className="text-xs font-black tracking-wide text-white mb-1">{st.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug font-medium">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{safeOpportunities.length}+</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Verified Real Opportunities</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-600">100%</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Direct Official Portals</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">₹1 Cr+</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Stipends & Grants Pool</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card text-center">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">6 Hours</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Autonomous Scan Cycle</div>
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
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-800 transition"
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
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Torchbearer AI Match Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Recommended For You
              </h2>
              <p className="text-sm text-slate-300">
                Matched against {studentProfile.branch} • {studentProfile.year} • {Array.isArray(studentProfile.skills) ? studentProfile.skills.slice(0, 4).join(', ') : 'Tech Skills'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAiGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Guide for More Matches</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} showRecommendationBadge={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ⏰ CLOSING SOON SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>Urgent Approaching Deadlines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Closing Soon
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Verified deadlines closing within days. Submit your applications before portals shut.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-800 transition"
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
      {/* 5. 🔬 PREMIER RESEARCH & FELLOWSHIPS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>Frontier Science & Academic Labs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Research Fellowships & Grants
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Paid academic summer fellowships at CERN, TIFR, ISRO, DRDO, IIT Bombay, MITACS, and DAAD.
            </p>
          </div>
          <Link
            to="/opportunities?type=Research"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-800 transition"
          >
            <span>View All Research Tracks</span>
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
      {/* 6. 🏆 HACKATHONS & CODING BATTLES */}
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
              Compete in team hackathons, build ambitious software, and earn grand cash prizes.
            </p>
          </div>
          <Link
            to="/opportunities?type=Hackathon"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-800 transition"
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
      {/* 7. "MEET YOUR AI OPPORTUNITY GUIDE" SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Meet Your AI Opportunity Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Torchbearer AI searches, understands, and verifies.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Spend less time searching through fragmented job boards and spam links. Torchbearer AI autonomously scans legitimate sources, extracts structured requirements, and prepares you to apply with confidence.
            </p>
          </div>

          {/* 3 Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Direction & Focus</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Personalized match calculations help you discover opportunities precisely tailored to your engineering branch, year, and technical skills.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">100% Genuine Portals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero placeholder URLs or affiliate walls. Every single application destination connects directly to the official organization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">AI Interview Strategies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by GLM 5.3, the agent analyzes job specs and generates actionable study action items and recommended tech stack prep for interviews.
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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
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
                    openFaq === idx ? 'transform rotate-180 text-amber-600' : ''
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
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white text-center shadow-xl space-y-6 relative overflow-hidden border border-amber-900/40">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>Light the way to your future</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Discover Your Next Opportunity?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Create your free student profile to get personalized recommendations, deadline alerts, and AI-powered preparation advice.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link to="/opportunities">
              <Button
                variant="primary"
                size="lg"
                className="font-extrabold px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25"
              >
                Explore All Opportunities
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="font-bold border-slate-700 text-white hover:bg-white/10">
                Create Free Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Guide Modal */}
      <AIGuideModal isOpen={aiGuideOpen} onClose={() => setAiGuideOpen(false)} />
    </div>
  );
}
