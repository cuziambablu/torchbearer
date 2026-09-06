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
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOpportunities } from '../../context/OpportunityContext';
import NotificationBell from './NotificationBell';
import Button from './Button';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout, switchRole } = useAuth();
  const { savedIds, applications } = useOpportunities();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-brand-600 bg-brand-50/80 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                  Campus<span className="text-brand-600">Launch</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block -mt-1 tracking-wider uppercase">
                  Discover. Apply. Grow.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/opportunities" className={navLinkClass}>
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </NavLink>

              {isAuthenticated && isStudent && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink to="/saved" className={navLinkClass}>
                    <Bookmark className="w-4 h-4" />
                    <span>Saved</span>
                    {savedIds.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-brand-100 text-brand-700 text-[10px] font-bold rounded-full">
                        {savedIds.length}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/applications" className={navLinkClass}>
                    <Send className="w-4 h-4" />
                    <span>Applications</span>
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
                    <span>Admin Hub</span>
                  </NavLink>
                  <NavLink to="/admin/opportunities" className={navLinkClass}>
                    <Compass className="w-4 h-4" />
                    <span>Manage</span>
                  </NavLink>
                  <NavLink to="/admin/submissions" className={navLinkClass}>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Submissions</span>
                  </NavLink>
                  <NavLink to="/admin/import" className={navLinkClass}>
                    <UploadCloud className="w-4 h-4" />
                    <span>CSV Import</span>
                  </NavLink>
                  <NavLink to="/admin/logs" className={navLinkClass}>
                    <FileText className="w-4 h-4" />
                    <span>Audit Logs</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Hub */}
          <div className="hidden md:flex items-center gap-3">
            {/* In-App Notification Bell */}
            {isAuthenticated && <NotificationBell />}

            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition"
                title="Preview role switching"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Role: {user ? (user.role === 'admin' ? 'Admin' : 'Student') : 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs animate-scale-up"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Switch User Role
                  </div>
                  <button
                    onClick={() => switchRole('student')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      isStudent ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>🎓 Student Mode</span>
                  </button>
                  <button
                    onClick={() => switchRole('admin')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      isAdmin ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>🛡️ Admin Mode</span>
                  </button>
                  <button
                    onClick={() => switchRole('guest')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      !user ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>👤 Guest (Logged out)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Submit Opportunity Button */}
            <Link to="/submit">
              <Button variant="outline" size="sm" icon={PlusCircle}>
                Submit Opportunity
              </Button>
            </Link>

            {/* Auth Buttons or User Avatar */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                      {user.role}
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
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {user.college && (
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {user.college}
                        </span>
                      )}
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
                          <span>Edit Profile & Skills</span>
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
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/import"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span>CSV Opportunity Importer</span>
                        </Link>
                        <Link
                          to="/admin/logs"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>Admin Audit Logs</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
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
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="space-y-1">
            <NavLink
              to="/opportunities"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Opportunities</span>
            </NavLink>

            {isAuthenticated && isStudent && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Saved Opportunities ({savedIds.length})</span>
                </NavLink>
                <NavLink
                  to="/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <Send className="w-4 h-4" />
                  <span>Application Tracker ({applications.length})</span>
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </NavLink>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <NavLink
                  to="/admin"
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </NavLink>
                <NavLink
                  to="/admin/opportunities"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <Compass className="w-4 h-4" />
                  <span>Manage Listings</span>
                </NavLink>
                <NavLink
                  to="/admin/submissions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Review Submissions</span>
                </NavLink>
                <NavLink
                  to="/admin/import"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>CSV Opportunity Importer</span>
                </NavLink>
                <NavLink
                  to="/admin/logs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <FileText className="w-4 h-4" />
                  <span>Audit Logs</span>
                </NavLink>
              </>
            )}

            <NavLink
              to="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit an Opportunity</span>
            </NavLink>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Log Out ({user.name})
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
