import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Instagram, Twitter, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo size="md" variant="dark" href="/" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Torchbearer AI helps students discover verified internships, scholarships, hackathons, and research fellowships with AI-powered matching.
            </p>
            <div className="text-xs font-semibold text-torch-400 tracking-wide">
              Light the path to your future.
            </div>
            <div className="pt-1">
              <a
                href="mailto:teamtorchbearerai@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-torch-400 font-medium transition"
              >
                <Mail className="w-3.5 h-3.5 text-torch-400" />
                <span>teamtorchbearerai@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-400 pt-1">
              <a
                href="https://www.instagram.com/torchbearer.ai"
                target="_blank"
                rel="noreferrer"
                title="Follow on Instagram"
                className="hover:text-torch-400 transition p-2 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition p-2 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition p-2 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800"
              >
                <Linkedin className="w-4 h-4" />
              </a>
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
                  <Compass className="w-3.5 h-3.5 text-torch-400" />
                  <span>All Opportunities</span>
                </Link>
              </li>
              <li>
                <Link to="/opportunities?category=internship" className="hover:text-white transition">
                  Internships 2026
                </Link>
              </li>
              <li>
                <Link to="/opportunities?category=hackathon" className="hover:text-white transition">
                  National Hackathons
                </Link>
              </li>
              <li>
                <Link to="/opportunities?category=scholarship" className="hover:text-white transition">
                  STEM Scholarships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?category=fellowship" className="hover:text-white transition">
                  Research Fellowships
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Student Platform
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
                <Link to="/profile" className="hover:text-white transition">
                  AI Match Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Live Network
            </h4>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold text-slate-300">Live Aggregator Active</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                40+ official sources monitored 24/7 across GSoC, SIH, ISRO, Amazon, Microsoft & university labs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Torchbearer AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/opportunities" className="hover:text-slate-300 transition">
              Explore
            </Link>
            <Link to="/login" className="hover:text-slate-300 transition">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
