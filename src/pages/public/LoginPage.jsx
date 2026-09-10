import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, GraduationCap, Flame } from 'lucide-react';
import Button from '../../components/common/Button';
import BrandLogo from '../../components/common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('aarav.sharma@college.edu');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in both email and password', 'warning');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password, role);
      addToast(`Welcome back, ${user.name}! 👋`, 'success');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      addToast('Login failed. Please verify your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@torchbearer.ai');
      setPassword('adminPass123');
      setRole('admin');
    } else {
      setEmail('aarav.sharma@college.edu');
      setPassword('studentPass123');
      setRole('student');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" showText={false} href="/" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to Torchbearer AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Your path starts here • Sign in to access your opportunity dashboard
          </p>
        </div>

        {/* Quick Demo Credentials Pill Bar */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-subtle text-xs space-y-2">
          <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider text-center">
            ⚡ Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition ${
                role === 'student'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Mode</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition ${
                role === 'admin'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Mode</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-amber-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold border-0 shadow-md shadow-amber-500/25"
            >
              Sign In to Torchbearer AI
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-amber-600 hover:underline">
                Create student profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
