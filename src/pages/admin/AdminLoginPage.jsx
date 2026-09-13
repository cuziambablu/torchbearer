import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import BrandLogo from '../../components/common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/admin/dashboard';

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = (email || '').trim().toLowerCase();

    // Strict Security Guard: Only irfan@gmail.com with irfan@2006 is authorized
    if (cleanEmail !== 'irfan@gmail.com' || password !== 'irfan@2006') {
      setErrorMsg('Access Denied: Invalid administrator credentials or unauthorized administrator email.');
      addToast('Admin authorization failed. Unauthorized access attempt logged.', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await login(cleanEmail, password, 'admin');
      if (user?.role !== 'admin') {
        setErrorMsg('Access Denied: This account does not possess platform administrator privileges.');
        addToast('Admin authorization required.', 'error');
        return;
      }

      addToast('Administrator session authenticated. Welcome, Irfan.', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials or unauthorized token.');
      addToast('Admin login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white animate-fade-in selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <BrandLogo size="lg" isDark={true} subtitle="Enterprise Command Center" />
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          Strictly restricted to platform administration only.
        </p>
      </div>

      {/* Login Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full justify-center bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20"
            >
              Authenticate as Administrator
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-slate-800/80">
            <Link
              to="/student/login"
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              ← Return to Student Portal Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
