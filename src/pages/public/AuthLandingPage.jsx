import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRANCHES, YEARS, MOCK_DEFAULT_STUDENT } from '../../data/mockOpportunities';

export default function AuthLandingPage() {
  const { user, isAuthenticated, isAdmin, login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If already logged in, route directly to the respective portal
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    college: '',
    branch: 'CSE',
    year: '3rd Year',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await login(loginEmail, loginPassword, 'student');
      addToast('Welcome back! Successfully logged into student portal.', 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid student email or password.');
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (signupData.password !== signupData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (signupData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: signupData.name,
        email: signupData.email,
        college: signupData.college,
        branch: signupData.branch,
        year: signupData.year,
        password: signupData.password,
        skills: ['Python', 'Web Development'],
        interests: ['Internships', 'Hackathons']
      });

      addToast('Account created successfully! Welcome to Torchbearer AI.', 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fill
  const handleQuickDemoStudent = async () => {
    try {
      setLoading(true);
      await login(MOCK_DEFAULT_STUDENT.email, 'password123', 'student');
      addToast(`Logged in as ${MOCK_DEFAULT_STUDENT.name}!`, 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      addToast('Could not sign in with demo account.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 to-indigo-600/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <span className="font-black text-2xl sm:text-3xl tracking-tight text-white">
            Campus<span className="text-brand-400">Launch</span>
          </span>
        </Link>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Discover verified internships, hackathons, jobs, scholarships & career opportunities.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-7 px-6 sm:px-9 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
          {/* Tab Switcher: Log In vs Create Account */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: SIGN IN FORM                                       */}
          {/* ========================================================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/student/forgot-password"
                    className="text-[11px] font-semibold text-brand-400 hover:text-brand-300"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full justify-center shadow-lg shadow-brand-500/20 font-bold mt-2"
              >
                Sign In to Student Portal
              </Button>

              {/* Demo Account Quick Access */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoStudent}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700/90 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Demo: Continue as Aarav Sharma</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CREATE ACCOUNT FORM                                */}
          {/* ========================================================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="e.g. Alex Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="alex@college.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  College / Institute Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupData.college}
                    onChange={(e) => setSignupData({ ...signupData, college: e.target.value })}
                    placeholder="National Institute of Technology"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Branch
                  </label>
                  <select
                    value={signupData.branch}
                    onChange={(e) => setSignupData({ ...signupData, branch: e.target.value })}
                    className="w-full py-2.5 px-3 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Year
                  </label>
                  <select
                    value={signupData.year}
                    onChange={(e) => setSignupData({ ...signupData, year: e.target.value })}
                    className="w-full py-2.5 px-3 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm
                  </label>
                  <input
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full justify-center shadow-lg shadow-brand-500/20 font-bold mt-2"
              >
                Create Student Account & Enter
              </Button>
            </form>
          )}

          {/* Guest Explore Link */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-400 transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Opportunity Catalog as Guest →</span>
            </Link>
          </div>
        </div>

        {/* Administrator Portal Switch */}
        <div className="text-center mt-5">
          <Link
            to="/admin/login"
            className="text-xs font-medium text-slate-500 hover:text-slate-300 inline-flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Administrator Operations Portal →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
