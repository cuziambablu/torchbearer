import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  Compass,
  BookmarkCheck,
  Send,
  TrendingUp,
  Flame,
  CheckCircle2,
  PlusCircle,
  Briefcase,
  Trophy,
  Code,
  GraduationCap,
  BookOpen,
  Rocket
} from 'lucide-react';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { getDeadlineStatus } from '../../utils/dateUtils';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { opportunities } = useOpportunities();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/opportunities');
    }
  };

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];

  const categories = [
    {
      id: 'Internship',
      name: 'Internships',
      emoji: '💼',
      icon: Briefcase,
      desc: 'Paid industry roles & summer research',
      count: safeOpportunities.filter((o) => o.type === 'Internship' && o.status === 'published').length
    },
    {
      id: 'Hackathon',
      name: 'Hackathons',
      emoji: '🏆',
      icon: Trophy,
      desc: 'National 24-48h hackathons with big prizes',
      count: safeOpportunities.filter((o) => o.type === 'Hackathon' && o.status === 'published').length
    },
    {
      id: 'Competition',
      name: 'Coding Contests',
      emoji: '💻',
      icon: Code,
      desc: 'DSA & competitive programming battles',
      count: safeOpportunities.filter((o) => o.type === 'Competition' && o.status === 'published').length
    },
    {
      id: 'Scholarship',
      name: 'Scholarships',
      emoji: '🎓',
      icon: GraduationCap,
      desc: 'Merit & tuition funding for students',
      count: safeOpportunities.filter((o) => o.type === 'Scholarship' && o.status === 'published').length
    },
    {
      id: 'Workshop',
      name: 'Workshops',
      emoji: '📚',
      icon: BookOpen,
      desc: 'Hands-on bootcamps with certificates',
      count: safeOpportunities.filter((o) => o.type === 'Workshop' && o.status === 'published').length
    },
    {
      id: 'Fellowship',
      name: 'Fellowships',
      emoji: '🚀',
      icon: Rocket,
      desc: 'Global open source & research stipends',
      count: safeOpportunities.filter((o) => o.type === 'Fellowship' && o.status === 'published').length
    }
  ];

  // Featured opportunities
  const featuredOpportunities = safeOpportunities
    .filter((o) => o.status === 'published' && o.featured)
    .slice(0, 3);

  // Closing soon opportunities (sorted by earliest deadline)
  const closingSoonOpportunities = safeOpportunities
    .filter((o) => {
      if (o.status !== 'published') return false;
      const d = getDeadlineStatus(o.deadline);
      return !d.isExpired && d.daysLeft <= 10;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200/60">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-brand-100/40 via-indigo-50/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold mb-6 shadow-subtle animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>CampusLaunch — Discover. Apply. Grow.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Your next opportunity <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700">
              starts here.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover internships, hackathons, competitions and career opportunities made for students.
          </p>

          {/* Large Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 p-2 mb-8 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all"
          >
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search internships, hackathons, companies, or skills (e.g., Python)..."
              className="w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none py-2"
            />
            <Button type="submit" variant="primary" size="md" className="flex-shrink-0 shadow-none">
              <span>Search</span>
            </Button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/opportunities">
              <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                Explore Opportunities
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" size="lg" icon={PlusCircle}>
                Submit an Opportunity
              </Button>
            </Link>
          </div>

          {/* Trust stats row */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left sm:text-center">
            <div>
              <p className="text-2xl font-black text-slate-900">500+</p>
              <p className="text-xs text-slate-500 font-medium">Curated Opportunities</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">₹25L+</p>
              <p className="text-xs text-slate-500 font-medium">Prizes & Stipends</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Official Links</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">24/7</p>
              <p className="text-xs text-slate-500 font-medium">Deadline Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPPORTUNITY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Opportunity Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a domain tailored to your college career milestones
            </p>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/opportunities?type=${cat.id}`}
              className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover hover:border-brand-300 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
                    {cat.count} active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Editor's Choice
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>Explore all listings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* 4. CLOSING SOON (Approaching Deadlines) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/50 rounded-3xl border border-amber-200/80 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 text-amber-700">
                <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Urgent Deadlines
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Closing Soon
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Don't miss the window — these applications close within days
              </p>
            </div>
            <Link
              to="/opportunities?deadline=week"
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 group bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-subtle"
            >
              <span>View this week's deadlines</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {closingSoonOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
            Streamlined Career Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How CampusLaunch Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            A frictionless workflow designed to take you from discovery to selection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card relative">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black text-sm flex items-center justify-center mb-4 border border-brand-200">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Discover</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore verified internships, hackathons, and scholarships tailored to your college branch and graduation year.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card relative">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-black text-sm flex items-center justify-center mb-4 border border-purple-200">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Save</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bookmark promising opportunities to your personal list and receive automated deadline notifications.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm flex items-center justify-center mb-4 border border-emerald-200">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Apply</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit directly to official application portals without intermediaries, scams, or expired broken links.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card relative">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black text-sm flex items-center justify-center mb-4 border border-amber-200">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Grow</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track your interview pipeline status (Applied, Interview, Selected) and accelerate your professional career.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-14 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-200 mb-2 block">
              Level up your student journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
              Don't miss your next opportunity.
            </h2>
            <p className="text-sm sm:text-base text-slate-200 mb-8 leading-relaxed">
              Join thousands of ambitious students tracking hackathons, internships, and grants every single week.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/opportunities">
                <Button variant="primary" size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-none font-bold">
                  Explore Opportunities
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white/30 hover:bg-white/10">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
