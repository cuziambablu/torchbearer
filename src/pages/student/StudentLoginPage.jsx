import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_DEFAULT_STUDENT } from '../../data/mockOpportunities';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/student/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await login(email, password, 'student');
      addToast('Welcome back! Successfully logged into student portal.', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg('Invalid student email or password.');
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">
            Campus<span className="text-brand-600">Launch</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Find Your Next Opportunity
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Sign in to your student dashboard to track applications, deadlines, and recommendations.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                College / Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </form>

          {/* Demo Account Quick Access */}
          <div className="pt-4 border-t border-slate-100">
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

          {/* Switch to Register */}
          <div className="text-center text-xs text-slate-500 pt-2">
            <span>New to CampusLaunch? </span>
            <Link to="/student/signup" className="font-bold text-brand-600 hover:underline">
              Create student account
            </Link>
          </div>
        </div>

        {/* Administrator access link */}
        <div className="text-center mt-6">
          <Link
            to="/admin/login"
            className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Access Portal →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
