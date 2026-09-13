import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Github, Linkedin, Twitter, Flame, Compass, Instagram, Mail } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo size="md" variant="dark" href="/" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Torchbearer AI helps students find direction, discover verified opportunities, and move confidently toward their future.
            </p>
            <div className="text-xs font-bold text-amber-400/90 tracking-wide">
              Light the way to your future.
            </div>
            <div className="pt-1">
              <a
                href="mailto:teamtorchbearerai@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 font-medium transition"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>teamtorchbearerai@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <a href="https://www.instagram.com/torchbearer.ai?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" title="Follow on Instagram" className="hover:text-amber-400 transition p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800">
                <Instagram className="w-4 h-4 text-pink-400 hover:text-pink-300" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800"><Twitter className="w-4 h-4" /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800"><Github className="w-4 h-4" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Col 2: Opportunities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/opportunities" className="hover:text-white transition flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>All Opportunities</span>
                </Link>
              </li>
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
                <Link to="/opportunities?type=Research" className="hover:text-white transition">
                  Research Fellowships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Scholarship" className="hover:text-white transition">
                  STEM Scholarships
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Torchbearer AI
            </h4>
            <ul className="space-y-2.5 text-xs">
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
                <Link to="/about" className="hover:text-white transition">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Verified Links
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Every opportunity is continuously audited by Torchbearer AI Agent. Direct official application links only — zero spam, zero placeholder URLs.
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              💡 Have an authentic opening to share? <Link to="/submit" className="text-amber-400 hover:underline font-bold">Submit it here</Link>.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Torchbearer AI. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-slate-300 transition">About</Link>
            <Link to="/contact" className="hover:text-slate-300 transition">Contact</Link>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400/80 font-medium">Light the way to your future.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
