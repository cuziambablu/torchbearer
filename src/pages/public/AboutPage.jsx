import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Target,
  GraduationCap,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import Button from '../../components/common/Button';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Our Mission & Promise</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering College Students to Land Their Dream Opportunities.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          CampusLaunch was built by students and engineers to eliminate the chaos of discovering genuine internships, hackathons, fellowships, and scholarships.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Verified Links</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every single opportunity is checked for dead links, scams, paid barriers, or misleading eligibility before it goes live.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Transparent Match Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We show exactly why an opportunity is recommended for your branch and skills, along with a transparent skill-gap analysis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Always Free for Students</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No paywalls, no premium subscriptions to view deadlines, and no hidden application charges.
          </p>
        </div>
      </div>

      {/* Verification Manifesto */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Platform Quality Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            The Zero-Spam, Zero-Ghost-Job Commitment.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlike traditional job boards filled with outdated listings, CampusLaunch uses automated deadline expiration routines and a dedicated community reporting system to maintain verified accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Direct application to official company/organization portals</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Automated expiration when deadlines pass</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Multi-category student focus (internships, hackathons, grants)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Integrated Kanban pipeline for application tracking</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Ready to accelerate your career?</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/opportunities">
            <Button variant="primary" size="md">
              Explore Opportunities
            </Button>
          </Link>
          <Link to="/student/signup">
            <Button variant="outline" size="md">
              Create Student Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
