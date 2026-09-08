import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  Briefcase,
  Trophy,
  GraduationCap,
  Building2,
  Bookmark,
  Send,
  Clock,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { useOpportunities } from '../context/OpportunityContext';

export default function StudentLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { savedIds, applications } = useOpportunities();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const primaryNav = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Explore All', path: '/student/opportunities', icon: Compass },
    { label: 'Internships', path: '/student/opportunities?type=Internship', icon: Briefcase },
    { label: 'Hackathons', path: '/student/opportunities?type=Hackathon', icon: Trophy },
    { label: 'Scholarships', path: '/student/opportunities?type=Scholarship', icon: GraduationCap },
    { label: 'Full-Time Jobs', path: '/student/opportunities?type=Job', icon: Building2 }
  ];

  const studentTools = [
    { label: 'Saved Items', path: '/student/saved', icon: Bookmark, badge: savedIds?.length || 0 },
    { label: 'Applications', path: '/student/applications', icon: Send, badge: applications?.length || 0 },
    { label: 'Deadlines', path: '/student/deadlines', icon: Clock },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Settings', path: '/student/settings', icon: Settings }
  ];

  const mobileBottomNav = [
    { label: 'Home', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Explore', path: '/student/opportunities', icon: Compass },
    { label: 'Saved', path: '/student/saved', icon: Bookmark },
    { label: 'Tracker', path: '/student/applications', icon: Send },
    { label: 'Profile', path: '/student/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased selection:bg-brand-500 selection:text-white">
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 flex-shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/student/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-brand-600 transition leading-none">
                Campus<span className="text-brand-600">Launch</span>
              </span>
              <span className="text-[9px] text-brand-600 font-bold uppercase tracking-wider mt-0.5">
                Student Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main Discover Group */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Discover Opportunities
            </div>
            <div className="space-y-1">
              {primaryNav.map((item) => {
                const isSelected =
                  location.pathname + location.search === item.path ||
                  (item.path === '/student/opportunities' && location.pathname === '/student/opportunities' && !location.search);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Student Career Tools Group */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              My Career Tracker
            </div>
            <div className="space-y-1">
              {studentTools.map((item) => {
                const isSelected = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Student'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user?.college || user?.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden pb-16 md:pb-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                🎓 {user?.branch || 'CSE'} ({user?.year || '3rd Year'})
              </span>
              <span>•</span>
              <span className="truncate max-w-[250px]">{user?.college || 'National Institute of Technology'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/submit"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Share Opportunity</span>
            </Link>

            <NotificationBell />

            <Link
              to="/student/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs font-semibold text-slate-700 hover:text-brand-600"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Slide-Over Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white h-full p-5 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="font-black text-base text-slate-900">CampusLaunch</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  Discover
                </div>
                {primaryNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-2 border-t border-slate-100">
                  Career Tools
                </div>
                {studentTools.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 h-16 flex items-center justify-around px-2 shadow-lg">
        {mobileBottomNav.map((item) => {
          const isSelected = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 w-full py-1 text-[10px] font-semibold transition ${
                isSelected ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
