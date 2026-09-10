import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Compass,
  CheckCircle2,
  Globe,
  Users,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Clock,
  Bot,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOpportunities } from '../context/OpportunityContext';
import { isSupabaseConfigured } from '../services/supabase';
import BrandLogo from '../components/common/BrandLogo';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { submissions, reports, reviewQueue, isAgentRunning } = useOpportunities();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const pendingSubmissions = (submissions || []).filter((s) => s.status === 'pending').length;
  const pendingReports = (reports || []).filter((r) => r.status === 'pending').length;
  const pendingReviews = (reviewQueue || []).length;

  const adminNav = [
    { label: 'Overview & KPIs', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'AI Opportunity Agent', path: '/admin/agent', icon: Bot, badge: isAgentRunning ? 'Running' : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { label: 'AI Review Queue', path: '/admin/review-queue', icon: ShieldAlert, badge: pendingReviews, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { label: 'Opportunities', path: '/admin/opportunities', icon: Compass },
    { label: 'Verification Center', path: '/admin/verification', icon: CheckCircle2 },
    { label: 'Sources & Feeds', path: '/admin/sources', icon: Globe },
    { label: 'Review Submissions', path: '/admin/submissions', icon: Clock, badge: pendingSubmissions, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
    { label: 'Reports & Quality', path: '/admin/reports', icon: AlertTriangle, badge: pendingReports, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Broadcast Alerts', path: '/admin/notifications', icon: Bell },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
    { label: 'Audit Log', path: '/admin/audit-logs', icon: History }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-brand-500 selection:text-white">
      {/* 1. Desktop Persistent Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 z-30 flex-shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center">
            <BrandLogo size="sm" isDark={true} subtitle="Command Center" />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Operations & Data
          </div>

          {adminNav.map((item) => {
            const isSelected = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-600/20 text-brand-300 font-bold border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer: Live DB Status & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local State Mode'}</span>
            </span>
            <Link to="/student/dashboard" className="text-slate-400 hover:text-brand-400" title="Switch to Student View">
              Student UI →
            </Link>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.email || 'admin@torchbearer.ai'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Torchbearer AI Enterprise Command Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/opportunities/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Opportunity</span>
            </Link>

            <Link
              to="/opportunities"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Slide-Over Sidebar for Admin */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-slate-900 h-full p-5 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between border-r border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <BrandLogo size="sm" isDark={true} subtitle="Admin" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {adminNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
