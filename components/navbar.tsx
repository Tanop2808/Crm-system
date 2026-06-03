'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Bell, HelpCircle, LogOut, Settings, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: string;
  }
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
    setIsNotificationsOpen(false);
  };

  const formatTimeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    setMounted(true);
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 w-full bg-surface-container-lowest h-[56px] border-b border-outline-variant shadow-sm">
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
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1 mr-1 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1 relative text-on-surface-variant hover:bg-surface-container rounded-full transition-colors active:scale-95"
            >
              <Bell size={18} />
              {/* Notification Indicator Dot */}
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-error text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-surface-container flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-on-surface">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead} 
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-on-surface-variant">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link 
                        key={n.id} 
                        href={n.link || '#'} 
                        onClick={() => handleNotificationClick(n.id)} 
                        className={`block px-4 py-3 hover:bg-surface-container transition-colors border-b border-surface-container/50 ${
                          !n.isRead ? 'bg-primary/5 font-medium' : 'opacity-70'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                            !n.isRead 
                              ? n.type === 'TICKET_CREATED' || (n.type === 'PRIORITY_UPDATED' && n.message.includes('URGENT'))
                                ? 'bg-error'
                                : 'bg-primary'
                              : 'bg-transparent'
                          }`} />
                          <div className="flex-grow">
                            <p className="text-[13px] text-on-surface leading-tight">
                              <span className="font-semibold">{n.title}</span> — {n.message}
                            </p>
                            <p className="text-[10px] text-on-surface-variant mt-1">{formatTimeAgo(n.createdAt)}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  onClick={() => {
                    setIsProfileOpen(false);
                    localStorage.removeItem('supportdesk_session');
                    router.replace('/login');
                  }}
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
