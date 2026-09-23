import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import TorchbearerRing from '../../components/common/TorchbearerRing';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRANCHES, YEARS } from '../../data/mockOpportunities';

export default function StudentLoginPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  const { isAuthenticated, isAdmin, login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  const redirectPath = searchParams.get('redirect') || location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const user = await login(loginEmail, loginPassword, 'student');
      if (user?.role === 'admin') {
        addToast(`Admin authenticated. Welcome, ${user.name || 'Admin'}!`, 'success');
        navigate('/admin/dashboard', { replace: true });
      } else {
        addToast('Welcome back! Logged in successfully.', 'success');
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
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
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        college: signupData.college,
        branch: signupData.branch,
        year: signupData.year,
        role: 'student'
      });

      addToast('Account created successfully! Welcome to Torchbearer AI.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Email may already be in use.');
      addToast('Registration error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 relative flex flex-col justify-between items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Luminous Torchbearer Aura */}
      <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 -z-10 opacity-70 pointer-events-none">
        <TorchbearerRing size="hero" animated={true} withAura={true} />
      </div>

      {/* Subtle Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] -z-20 opacity-60 pointer-events-none" />

      {/* Top Header Logo */}
      <div className="w-full max-w-md flex justify-center mb-6">
        <BrandLogo size="lg" href="/" />
      </div>

      {/* Main Glass/White Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            {activeTab === 'login' ? 'Welcome to Torchbearer AI' : 'Create your student account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {activeTab === 'login'
              ? 'Enter your credentials to access your dashboard & AI matches.'
              : 'Join thousands of students discovering verified opportunities.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-[#FF5A00]/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#forgot" className="text-[11px] font-semibold text-[#FF5A00] hover:text-[#FF3300]">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-[#FF5A00]/10 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] rounded-xl shadow-[0_4px_16px_rgba(255,77,0,0.28)] hover:shadow-[0_6px_22px_rgba(255,77,0,0.38)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Continue to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-[#FF5A00]/10"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="aarav@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-[#FF5A00]/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Branch</label>
                <select
                  value={signupData.branch}
                  onChange={(e) => setSignupData({ ...signupData, branch: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00]"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Year</label>
                <select
                  value={signupData.year}
                  onChange={(e) => setSignupData({ ...signupData, year: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00]"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] rounded-xl shadow-[0_4px_16px_rgba(255,77,0,0.28)] hover:shadow-[0_6px_22px_rgba(255,77,0,0.38)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Feature Highlights Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>40+ Official Sources Audited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#FF7300]" />
          <span>AI Match Intelligence</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>100% Free for Students</span>
        </div>
      </div>
    </div>
  );
}
