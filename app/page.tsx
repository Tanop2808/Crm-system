'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ChevronLeft, ChevronRight, TrendingUp, Clock, Star } from 'lucide-react';
import { Ticket, Status } from '@/types/ticket';
import { StatusBadge, PriorityBadge } from '@/components/status-badge';

const STATUS_FILTERS: { label: string; value: 'ALL' | Status }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Closed', value: 'CLOSED' },
];

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | Status>('ALL');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTickets = useCallback(async (q: string, s: 'ALL' | Status) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (s !== 'ALL') params.set('status', s);
      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTickets('', 'ALL');
  }, [fetchTickets]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTickets(value, activeFilter);
    }, 300);
  };

  const handleFilterChange = (filter: 'ALL' | Status) => {
    setActiveFilter(filter);
    fetchTickets(search, filter);
  };

  const clearSearch = () => {
    setSearch('');
    fetchTickets('', activeFilter);
  };

  // Derived metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const closedTickets = tickets.filter((t) => t.status === 'CLOSED').length;
  const resolutionRate = totalTickets > 0 ? ((closedTickets / totalTickets) * 100).toFixed(1) : '0.0';

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-on-surface tracking-tight">Support Tickets</h1>
        <p className="text-[13px] text-on-surface-variant mt-0.5">
          {totalTickets} total tickets · {openTickets} open
        </p>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Search */}
        <div className="relative w-full max-w-[340px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-white border border-outline-variant rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search tickets..."
            type="text"
          />
          {search && (
            <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-lg gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
                activeFilter === f.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-2 text-[11px] font-semibold text-secondary uppercase tracking-wider">Ticket ID</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-secondary uppercase tracking-wider">Customer</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-secondary uppercase tracking-wider">Subject</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-secondary uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-secondary uppercase tracking-wider">Date Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-3 bg-surface-container rounded w-16" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-surface-container rounded w-28" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-surface-container rounded w-48" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-surface-container rounded w-16 mx-auto" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-surface-container rounded w-12" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-surface-container rounded w-24" /></td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-outline-variant">assignment_late</span>
                      <p className="text-[14px] text-on-surface-variant">No tickets found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-surface-container transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <Link href={`/tickets/${ticket.ticketId}`} className="block">
                        <span className="text-[12px] font-semibold text-primary font-mono tracking-tight">{ticket.ticketId}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/tickets/${ticket.ticketId}`} className="block">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-semibold text-on-surface">{ticket.customerName}</span>
                          <span className="text-[13px] text-on-surface-variant">{ticket.customerEmail}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 max-w-[280px]">
                      <Link href={`/tickets/${ticket.ticketId}`} className="block">
                        <span className="text-[14px] text-on-surface truncate block">{ticket.subject}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link href={`/tickets/${ticket.ticketId}`} className="block">
                        <StatusBadge status={ticket.status} />
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/tickets/${ticket.ticketId}`} className="block">
                        <PriorityBadge priority={ticket.priority} />
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-on-surface-variant whitespace-nowrap">
                      <Link href={`/tickets/${ticket.ticketId}`} className="block">
                        {formatDate(ticket.createdAt)}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <span className="text-[13px] text-on-surface-variant">
            {loading ? '...' : `Showing ${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}`}
          </span>
          <div className="flex items-center gap-1">
            <button disabled className="p-1 text-on-surface-variant hover:bg-surface-container rounded-md transition-all disabled:opacity-30">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary text-xs font-semibold shadow-sm">1</button>
            <button disabled className="p-1 text-on-surface-variant hover:bg-surface-container rounded-md transition-all disabled:opacity-30">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Metric Cards */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Resolution Rate</span>
            <TrendingUp size={18} className="text-primary-container" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-semibold text-on-surface leading-tight tracking-tight">{resolutionRate}%</span>
            <span className="text-[11px] font-medium text-primary">Live</span>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-1">Based on current ticket data</p>
        </div>

        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Open Tickets</span>
            <Clock size={18} className="text-tertiary-container" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-semibold text-on-surface leading-tight tracking-tight">{openTickets}</span>
            <span className="text-[11px] font-medium text-tertiary">active</span>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-1">Awaiting response or resolution</p>
        </div>

        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">CSAT Score</span>
            <Star size={18} className="text-secondary fill-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-semibold text-on-surface leading-tight tracking-tight">4.8/5.0</span>
            <span className="text-[11px] font-medium text-secondary">stable</span>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-1">From 112 customer surveys</p>
        </div>
      </section>
    </main>
  );
}
