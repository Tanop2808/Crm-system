'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate server response delay (800ms) for professional feel
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      
      if (cleanEmail === 'admin@demo.com' && password === 'admin123') {
        localStorage.setItem('supportdesk_session', 'active');
        router.replace('/');
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-6">
      <div className="w-full max-w-[400px] bg-surface border border-outline-variant rounded-2xl shadow-xl p-8 flex flex-col">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-3 shadow-sm">
            <Shield size={24} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">SupportDesk</h1>
          <p className="text-[13px] text-on-surface-variant mt-1">CRM Agent Portal</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 bg-error-container/20 text-error p-3.5 rounded-xl border border-error-container flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="admin@demo.com"
                className="w-full pl-9 pr-4 py-2 bg-surface-container border border-outline-variant rounded text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 bg-surface-container border border-outline-variant rounded text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg text-xs hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 mt-6 active:scale-98 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials Info Box */}
        <div className="mt-8 bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col gap-1">
          <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Demo Credentials</p>
          <div className="text-[12px] text-on-surface-variant space-y-0.5 mt-1 font-mono">
            <div><span className="font-semibold font-sans">Email:</span> admin@demo.com</div>
            <div><span className="font-semibold font-sans">Password:</span> admin123</div>
          </div>
        </div>
      </div>
    </main>
  );
}
