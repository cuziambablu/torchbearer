import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Linkedin, Twitter, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Campus<span className="text-brand-400">Launch</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The centralized opportunity discovery platform designed exclusively for college students. Unlocking top internships, hackathons, fellowships, and scholarships.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-white transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Col 2: Opportunities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/opportunities?type=Internship" className="hover:text-white transition">
                  Internships 2026
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Hackathon" className="hover:text-white transition">
                  National Hackathons
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Competition" className="hover:text-white transition">
                  Coding Competitions
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Scholarship" className="hover:text-white transition">
                  STEM Scholarships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Fellowship" className="hover:text-white transition">
                  Open Source Fellowships
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Student Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-white transition">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-white transition">
                  Submit an Opportunity
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  Skill & Profile Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Links
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Every opportunity is curated and verified by our student review board. Direct official application links only — zero spam.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
              💡 Have an opportunity to share? <Link to="/submit" className="text-brand-400 hover:underline font-medium">Contribute it here</Link>.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CampusLaunch. Built with precision for students worldwide.</p>
          <div className="flex items-center gap-1">
            <span>Discover. Apply. Grow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
