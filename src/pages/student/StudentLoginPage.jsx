import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
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

export default function StudentLoginPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

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

  const { isAuthenticated, isAdmin, login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, route directly to the respective portal
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  const redirectPath = location.state?.from?.pathname || '/student/dashboard';

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await login(loginEmail, loginPassword, 'student');
      addToast('Welcome back! Successfully logged into student portal.', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid student email or password.');
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Signup
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
        name: signupData.name,
        email: signupData.email,
        college: signupData.college,
        branch: signupData.branch,
        year: signupData.year,
        password: signupData.password,
        skills: ['Python', 'Web Development'],
        interests: ['Internships', 'Hackathons']
      });

      addToast('Account created successfully! Welcome to CampusLaunch.', 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Demo Account
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 animate-fade-in">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">
            Campus<span className="text-brand-600">Launch</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {activeTab === 'login' ? 'Find Your Next Opportunity' : 'Create Your Student Account'}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          {activeTab === 'login'
            ? 'Sign in to track applications, deadlines, and smart recommendations.'
            : 'Get personalized opportunity matching and an automated career tracker.'}
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-7 px-6 sm:px-9 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
          {/* Top Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
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
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: SIGN IN FORM                                       */}
          {/* ========================================================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  College / Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/student/forgot-password"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full justify-center shadow-md shadow-brand-500/20 font-bold"
              >
                Sign In to Student Portal
              </Button>

              {/* Demo Account Quick Access */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoStudent}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-xl border border-brand-200 flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Continue as Demo Student (Aarav Sharma)</span>
                </button>
              </div>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>New to CampusLaunch? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMsg('');
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Create student account
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CREATE ACCOUNT FORM                                */}
          {/* ========================================================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="e.g. Alex Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  College / University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="alex@college.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  College / Institute Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupData.college}
                    onChange={(e) => setSignupData({ ...signupData, college: e.target.value })}
                    placeholder="National Institute of Technology"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Branch
                  </label>
                  <select
                    value={signupData.branch}
                    onChange={(e) => setSignupData({ ...signupData, branch: e.target.value })}
                    className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Year
                  </label>
                  <select
                    value={signupData.year}
                    onChange={(e) => setSignupData({ ...signupData, year: e.target.value })}
                    className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm
                  </label>
                  <input
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full justify-center shadow-md shadow-brand-500/20 font-bold mt-2"
              >
                Create Student Account & Enter
              </Button>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Administrator access link & Guest Catalog link */}
        <div className="text-center mt-5 space-y-2">
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center justify-center gap-1 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Opportunity Catalog as Guest →</span>
          </Link>

          <div>
            <Link
              to="/admin/login"
              className="text-xs font-medium text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrator Access Portal →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
