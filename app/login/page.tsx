'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Mail, AlertCircle, Loader2, Eye, EyeOff, Sparkles, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShake(false);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      setShake(true);
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
        setShake(true);
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickFill = () => {
    setEmail('admin@demo.com');
    setPassword('admin123');
    setError(null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-surface-container-lowest overflow-hidden p-6 select-none">
      
      {/* Decorative Animated Background Glowing Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 */}
        <motion.div 
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[80px]"
          animate={{
            x: [0, 50, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Blob 2 */}
        <motion.div 
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[100px]"
          animate={{
            x: [0, -60, 30, 0],
            y: [0, 40, -50, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Subtle Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(var(--theme-outline) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={shake ? { 
          opacity: 1, 
          y: 0,
          x: [0, -10, 10, -10, 10, -5, 5, 0],
          transition: { duration: 0.5 }
        } : { 
          opacity: 1, 
          y: 0,
          transition: { type: 'spring', damping: 25, stiffness: 120 }
        }}
        className="w-full max-w-[420px] bg-surface/80 dark:bg-surface/75 backdrop-blur-xl border border-outline-variant/60 rounded-3xl shadow-2xl p-8 flex flex-col relative z-10"
      >
        
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-14 h-14 bg-primary-container/20 text-primary border border-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner relative group overflow-hidden"
          >
            <Shield size={28} className="text-primary z-10 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-1.5"
          >
            SupportDesk
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-medium text-on-surface-variant mt-1.5 uppercase tracking-wider"
          >
            CRM Agent Portal
          </motion.p>
        </div>

        {/* Error Banner with AnimatePresence */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-error-container/20 text-error p-3.5 rounded-2xl border border-error-container/50 flex items-start gap-2.5">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input group */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-1.5"
          >
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="admin@demo.com"
                className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
              />
            </div>
          </motion.div>

          {/* Password input group */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-1.5"
          >
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-1">Password</label>
            <div className="relative group">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </motion.div>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-semibold py-3 rounded-xl text-xs hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </motion.div>
        </form>

        {/* Demo Credentials Info Box with Click-to-Autofill */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleQuickFill}
          className="mt-8 bg-surface-container-low/70 hover:bg-surface-container-low border border-outline-variant/50 hover:border-primary/40 p-4 rounded-2xl flex flex-col gap-1.5 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow relative overflow-hidden"
        >
          {/* Subtle hover spark effect */}
          <div className="absolute top-2 right-2 text-on-surface-variant/30 group-hover:text-primary transition-colors">
            {copied ? <Check size={14} className="text-primary animate-scale-up" /> : <Sparkles size={14} />}
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Demo Credentials</span>
            <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to autofill
            </span>
          </div>
          
          <div className="text-[12px] text-on-surface-variant space-y-1 font-mono">
            <div>
              <span className="font-semibold font-sans text-[11px]">Email:</span> admin@demo.com
            </div>
            <div>
              <span className="font-semibold font-sans text-[11px]">Password:</span> admin123
            </div>
          </div>
        </motion.div>

      </motion.div>
    </main>
  );
}
