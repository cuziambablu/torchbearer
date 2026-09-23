import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Bookmark,
  Send,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Code2,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOpportunities } from '../../context/OpportunityContext';
import NotificationBell from './NotificationBell';
import BrandLogo from './BrandLogo';
import AIGuideModal from './AIGuideModal';

export default function Navbar() {
  const { user, isAuthenticated, isStudent, logout } = useAuth();
  const { savedIds, applications } = useOpportunities();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'text-slate-950 font-semibold bg-slate-100/90'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-subtle'
            : 'bg-white/60 backdrop-blur-xs border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-8">
              <BrandLogo size="md" href="/" />

              {/* Center / Desktop Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                <NavLink to="/opportunities" className={navLinkClass}>
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Opportunities</span>
                </NavLink>

                <NavLink to="/opportunities?category=internship" className={navLinkClass}>
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Internships</span>
                </NavLink>

                <NavLink to="/opportunities?category=scholarship" className={navLinkClass}>
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>Scholarships</span>
                </NavLink>

                <NavLink to="/opportunities?category=hackathon" className={navLinkClass}>
                  <Code2 className="w-4 h-4 text-slate-500" />
                  <span>Hackathons</span>
                </NavLink>

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
                        <span className="ml-1 px-1.5 py-0.2 bg-torch-100 text-torch-800 text-[10px] font-bold rounded-full">
                          {savedIds.length}
                        </span>
                      )}
                    </NavLink>

                    <NavLink to="/applications" className={navLinkClass}>
                      <Send className="w-4 h-4 text-slate-500" />
                      <span>Tracker</span>
                      {applications.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-full">
                          {applications.length}
                        </span>
                      )}
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* AI Guide Trigger */}
              <button
                type="button"
                onClick={() => setAiGuideOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
              >
                <Sparkles className="w-3.5 h-3.5 text-torch-500 group-hover:rotate-12 transition-transform" />
                <span>AI Guide</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <NotificationBell />

                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF2400] to-[#FFC400] p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-800">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-fadeIn">
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {user?.name || 'Student'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        </div>

                        {isStudent && (
                          <>
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-400" />
                              Dashboard
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              Profile & Match Settings
                            </Link>
                          </>
                        )}

                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-torch-gradient rounded-lg shadow-torch-button hover:opacity-95 transition-all transform active:scale-98"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 animate-fadeIn">
            <Link
              to="/opportunities"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Opportunities
            </Link>
            <Link
              to="/opportunities?category=internship"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Briefcase className="w-4 h-4 text-slate-500" />
              Internships
            </Link>
            <Link
              to="/opportunities?category=scholarship"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              Scholarships
            </Link>
            <Link
              to="/opportunities?category=hackathon"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Code2 className="w-4 h-4 text-slate-500" />
              Hackathons
            </Link>

            {isAuthenticated && isStudent ? (
              <>
                <div className="border-t border-slate-100 my-2 pt-2"></div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Dashboard
                </Link>
                <Link
                  to="/saved"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  Saved ({savedIds.length})
                </Link>
                <Link
                  to="/applications"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Send className="w-4 h-4 text-slate-500" />
                  Tracker ({applications.length})
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Profile
                </Link>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-torch-gradient rounded-lg shadow-torch-button"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* AI Guide Interactive Modal */}
      {aiGuideOpen && <AIGuideModal isOpen={aiGuideOpen} onClose={() => setAiGuideOpen(false)} />}
    </>
  );
}
