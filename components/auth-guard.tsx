'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/navbar';
import AIAssistant from '@/components/ai-assistant';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('supportdesk_session');
    
    if (pathname === '/login') {
      setAuthorized(true);
      return;
    }

    if (!session) {
      setAuthorized(false);
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Loading state when checking session on protected routes
  if (!authorized && pathname !== '/login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface-variant">
        <Loader2 className="animate-spin text-primary mb-2" size={32} />
        <p className="text-sm font-medium">Verifying session...</p>
      </div>
    );
  }

  // Render raw children for the login page (no Navbar, Footer, or Chatbot)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Render standard layout for logged in users
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <footer className="w-full bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 px-6 w-full max-w-7xl mx-auto gap-3">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-on-surface-variant text-sm">SupportDesk CRM</span>
            <span className="text-xs text-on-surface-variant">© 2026 SupportDesk CRM. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a className="text-xs text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="text-xs text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="text-xs text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">API Documentation</a>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
