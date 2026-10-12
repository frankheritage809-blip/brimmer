import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { X, Shield, User, Lock, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginAsDemo
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to authenticate');
      }
    } else {
      const res = await register(name, email, phone);
      if (!res.success) {
        setError(res.error || 'Failed to register account');
      }
    }
    setLoading(false);
  };

  const handleDemoClick = async (role: 'admin' | 'guest') => {
    setError(null);
    setLoading(true);
    await loginAsDemo(role);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-[#0B192C] p-6 text-white text-center relative">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#C5A880]">
            The Grand Azure Hotel
          </span>
          <h3 className="font-serif text-2xl font-bold mt-1 text-white">
            {authModalMode === 'login' ? 'Guest & Staff Portal' : 'Create Guest Account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1.5">
            {authModalMode === 'login'
              ? 'Access your private bookings, concierge upgrades, or administration'
              : 'Join our private guest registry for seamless luxury reservations'}
          </p>
        </div>

        {/* Demo Fast Login Strip */}
        <div className="px-6 pt-5 pb-3 bg-white border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Instant Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('guest')}
              className="px-3 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-[#FAF8F5] border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Demo Guest</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="px-3 py-2 text-xs font-semibold text-slate-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Hotel Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Sterling"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. guest@example.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {authModalMode === 'login' ? 'Password' : 'Create Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
            >
              <span>{authModalMode === 'login' ? 'Sign In to Portal' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-slate-600">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-[#0B192C] font-semibold hover:underline"
                >
                  Create Guest Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-[#0B192C] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
