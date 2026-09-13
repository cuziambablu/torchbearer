import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Bookmark,
  Send,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  UploadCloud,
  FileText,
  Bot,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOpportunities } from '../../context/OpportunityContext';
import NotificationBell from './NotificationBell';
import Button from './Button';
import BrandLogo from './BrandLogo';
import AIGuideModal from './AIGuideModal';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const { savedIds, applications } = useOpportunities();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors px-3.5 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-amber-700 bg-amber-50 font-bold border border-amber-200/80 shadow-xs'
        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
    }`;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <BrandLogo size="md" href="/" />

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1">
                <NavLink to="/opportunities" className={navLinkClass}>
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Explore</span>
                </NavLink>

                {/* AI Guide Trigger */}
                <button
                  type="button"
                  onClick={() => setAiGuideOpen(true)}
                  className="text-sm font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50/70 transition-colors px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Guide</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-amber-500/10 text-amber-700 border border-amber-300 rounded-full">
                    Ask
                  </span>
                </button>

                {isAuthenticated && isStudent && (
                  <>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/saved" className={navLinkClass}>
                      <Bookmark className="w-4 h-4 text-slate-500" />
                      <span>Saved</span>
                      {savedIds.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                          {savedIds.length}
                        </span>
                      )}
                    </NavLink>

                    <NavLink to="/applications" className={navLinkClass}>
                      <Send className="w-4 h-4 text-slate-500" />
                      <span>Tracker</span>
                      {applications.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                          {applications.length}
                        </span>
                      )}
                    </NavLink>
                  </>
                )}

                {isAuthenticated && isAdmin && (
                  <>
                    <NavLink to="/admin" end className={navLinkClass}>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Command Center</span>
                    </NavLink>
                    <NavLink to="/admin/opportunities" className={navLinkClass}>
                      <Compass className="w-4 h-4" />
                      <span>Manage</span>
                    </NavLink>
                    <NavLink to="/admin/agent" className={navLinkClass}>
                      <Bot className="w-4 h-4 text-amber-600" />
                      <span>AI Agent</span>
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* Right Action Hub */}
            <div className="hidden md:flex items-center gap-3">
              {/* In-App Notification Bell */}
              {isAuthenticated && <NotificationBell />}

              {/* Submit Opportunity Button */}
              <Link to="/submit">
                <Button variant="outline" size="sm" icon={PlusCircle} className="font-bold border-slate-300">
                  Submit
                </Button>
              </Link>

              {/* Auth Buttons or User Avatar */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                        {user?.name || 'Student'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                        {user?.role || 'student'}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale-up"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900">{user?.name || 'Student'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
                      </div>

                      {isStudent && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Student Dashboard</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>Profile & Skills</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Command Center</span>
                          </Link>
                          <Link
                            to="/admin/agent"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Bot className="w-4 h-4 text-amber-500" />
                            <span>AI Opportunity Agent</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-bold">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" className="font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 border-0">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setAiGuideOpen(true)}
                className="p-2 rounded-xl text-amber-600 bg-amber-50 border border-amber-200"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-5 space-y-3 animate-fade-in shadow-xl">
            <NavLink
              to="/opportunities"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Explore Opportunities</span>
            </NavLink>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAiGuideOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ask Torchbearer AI Guide</span>
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 rounded-md">
                Live
              </span>
            </button>

            {isAuthenticated && isStudent && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Student Dashboard</span>
                </NavLink>
                <NavLink
                  to="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Saved Opportunities ({savedIds.length})</span>
                </NavLink>
              </>
            )}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/submit" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full font-bold">
                  Submit an Opportunity
                </Button>
              </Link>
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full font-bold">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full font-bold bg-amber-500 hover:bg-amber-600 text-white border-0">
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Log Out ({user?.name || 'Account'})
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Interactive AI Guide Modal */}
      <AIGuideModal isOpen={aiGuideOpen} onClose={() => setAiGuideOpen(false)} />
    </>
  );
}
