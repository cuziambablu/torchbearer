import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import TorchbearerRing from '../../components/common/TorchbearerRing';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { isAuthenticated, isAdmin, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const user = await login(email, password, 'admin');
      if (user?.role !== 'admin') {
        setErrorMsg('Access restricted to verified administrators.');
        return;
      }
      addToast('Admin console unlocked.', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
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

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] -z-20 opacity-60 pointer-events-none" />

      {/* Top Header Logo */}
      <div className="w-full max-w-md flex justify-center mb-6">
        <BrandLogo size="lg" href="/" />
      </div>

      {/* Main Glass/White Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 mb-3">
            <Shield className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Mission Control</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with authorized administrative credentials.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@torchbearer.ai"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-[#FF5A00]/10 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>{loading ? 'Authenticating...' : 'Sign In to Mission Control'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="mt-8 text-xs text-slate-400">
        Torchbearer AI Security Infrastructure • 256-bit encrypted
      </div>
    </div>
  );
}
