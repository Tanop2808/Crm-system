'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Bell, HelpCircle, LogOut, Settings, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 w-full bg-white h-[56px] border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-lg font-bold text-primary select-none hover:opacity-90 tracking-tight">
          SupportDesk
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`text-xs font-semibold px-3 py-1 rounded transition-all ${
              pathname === '/'
                ? 'text-primary border-b-2 border-primary rounded-none pb-[2px]'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/tickets/new"
            className={`text-xs font-semibold px-3 py-1 rounded transition-all ${
              pathname === '/tickets/new'
                ? 'text-primary border-b-2 border-primary rounded-none pb-[2px]'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Tickets
          </Link>
          <Link
            href="/customers"
            className={`text-xs font-semibold px-3 py-1 rounded transition-all ${
              pathname === '/customers'
                ? 'text-primary border-b-2 border-primary rounded-none pb-[2px]'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Customers
          </Link>
          <Link
            href="/reports"
            className={`text-xs font-semibold px-3 py-1 rounded transition-all ${
              pathname === '/reports'
                ? 'text-primary border-b-2 border-primary rounded-none pb-[2px]'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Reports
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3 relative">
        <div className="hidden sm:flex items-center gap-1">
          <button className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <Bell size={18} />
          </button>
          <button className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <HelpCircle size={18} />
          </button>
        </div>
        <Link
          href="/tickets/new"
          className="bg-primary-container text-white text-xs font-semibold px-4 py-2 rounded hover:bg-primary transition-all active:scale-95 flex items-center gap-1 shadow-sm"
        >
          <Plus size={14} />
          New Ticket
        </Link>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow active:scale-95"
          >
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlrSBr9K441pwz5cBLVYEAMBhpzY7GGqp-aLUuV4IdTL9yl2sQqcoE_iWkz_oBdVTbefdIftnBjvv5OWhm0GjhVPA6v8jTTKP8K4mm4co7edP_fTVrbcJ8q85YhphWwFPdXg92skOAjEL2u7Rqib_N7LqnGQnn0aaUZMAzhvNB23fD7te4Y2C9prXpTGqqI-ccXCe4Cbr85LcVYkF_gX3Y7taOCOnWByFdu9NykHTeg1F9WGEjyPGmg4MRtjJvcxq9eGha9QzduMAo"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-surface-container">
                <p className="text-sm font-semibold text-on-surface">Alex Support</p>
                <p className="text-xs text-on-surface-variant truncate">alex@supportdesk.crm</p>
              </div>
              <div className="py-1">
                <Link 
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <User size={14} className="text-on-surface-variant" />
                  Your Profile
                </Link>
                <Link 
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <Settings size={14} className="text-on-surface-variant" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-surface-container py-1">
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/30 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
