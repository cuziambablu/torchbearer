import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  ShieldCheck,
  Target,
  GraduationCap,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import BrandLogo from '../../components/common/BrandLogo';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Our Brand Story & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Light the way to your future.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Torchbearer AI was created to provide students with direction, clarity, and access to verified opportunities that genuinely shape careers.
        </p>
      </div>

      {/* Brand Concept Story */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-card space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          The Story of the Torch
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">01. Ambition Meets Complexity</h3>
            <p>Students have high ambition, but discovering authentic internships, hackathons, and research grants across hundreds of fragmented sites is overwhelming.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">02. Autonomous Illumination</h3>
            <p>Torchbearer AI continuously scans, structures, and authenticates opportunities with zero spam, zero placeholder URLs, and real deadline tracking.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">03. Guiding the Next Step</h3>
            <p>With personalized skill matching and AI interview preparation strategies, students move forward with confidence and land life-changing roles.</p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Genuine Portals</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every single opportunity is audited for dead links, scams, or misleading eligibility before it goes live.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Transparent Match Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We show exactly why an opportunity is recommended for your branch and skills, along with actionable preparation tips.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Always Free for Students</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No paywalls, no premium subscriptions to view deadlines, and zero hidden application charges.
          </p>
        </div>
      </div>

      {/* Manifesto */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 space-y-6 border border-slate-800">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Torchbearer Quality Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            The Zero-Spam, Zero-Ghost-Job Commitment.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlike traditional job boards filled with outdated listings, Torchbearer AI uses automated deadline expiration routines and a dedicated community reporting system to maintain verified accuracy.
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
            <span>Multi-category student focus (internships, hackathons, research grants)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Integrated Kanban pipeline for application tracking</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Ready to find your direction?</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/opportunities">
            <Button variant="primary" size="md" className="bg-amber-500 hover:bg-amber-600 text-white font-bold border-0">
              Explore Opportunities
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="md" className="font-bold">
              Create Student Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
