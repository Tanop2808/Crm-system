'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, FolderOpen, AlertCircle, Loader2, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/status-badge';
import { Ticket } from '@/types/ticket';

interface CustomerStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  stats: CustomerStats;
  tickets: Ticket[];
}

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = use(params);
  const decodedEmail = decodeURIComponent(email);

  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(decodedEmail)}`);
      if (!res.ok) {
        if (res.status === 404) setError('Customer not found.');
        else setError('Failed to load customer details.');
        return;
      }
      const data = await res.json();
      setCustomer(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [decodedEmail]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (loading) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-2 text-on-surface-variant">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm font-medium">Loading customer profile...</p>
        </div>
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <Link href="/customers" className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        <div className="bg-error-container/20 text-error p-6 rounded-xl border border-error-container text-center">
          <p className="font-semibold">{error || 'Customer profile not found.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Customer Directory
        </Link>
      </div>

      {/* Customer Profile Header */}
      <header className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl shadow-inner">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">{customer.name}</h1>
            <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
              <Mail size={14} className="text-primary" />
              <a href={`mailto:${customer.email}`} className="hover:underline">{customer.email}</a>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant text-[13px] text-on-surface-variant">
          <Clock size={14} />
          <span>Active Customer</span>
        </div>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Total Tickets</span>
            <FolderOpen size={16} className="text-primary" />
          </div>
          <span className="text-2xl font-bold text-on-surface leading-none">{customer.stats.totalTickets}</span>
          <p className="text-[11px] text-on-surface-variant mt-2">All time customer requests</p>
        </div>

        <div className="bg-surface-container-lowest p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Open Issues</span>
            <AlertCircle size={16} className="text-error" />
          </div>
          <span className="text-2xl font-bold text-error leading-none">{customer.stats.openTickets}</span>
          <p className="text-[11px] text-on-surface-variant mt-2">Awaiting initial response</p>
        </div>

        <div className="bg-surface-container-lowest p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">In Progress</span>
            <Clock size={16} className="text-secondary" />
          </div>
          <span className="text-2xl font-bold text-on-surface leading-none">{customer.stats.inProgressTickets}</span>
          <p className="text-[11px] text-on-surface-variant mt-2">Currently being resolved</p>
        </div>

        <div className="bg-surface-container-lowest p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Resolved</span>
            <CheckCircle size={16} className="text-success" />
          </div>
          <span className="text-2xl font-bold text-on-surface leading-none">{customer.stats.closedTickets}</span>
          <p className="text-[11px] text-on-surface-variant mt-2">Successfully closed tickets</p>
        </div>
      </section>

      {/* Tickets History list */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Ticket History</h2>
          <span className="text-xs text-on-surface-variant font-medium">Sorted by date</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Subject</th>
                <th className="px-6 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-6 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {customer.tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-surface-container transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link href={`/tickets/${ticket.ticketId}`} className="block">
                      <span className="text-[12px] font-semibold text-primary font-mono tracking-tight">{ticket.ticketId}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 max-w-[320px]">
                    <Link href={`/tickets/${ticket.ticketId}`} className="block">
                      <span className="text-[14px] text-on-surface font-medium truncate block group-hover:text-primary transition-colors">{ticket.subject}</span>
                      <span className="text-[12px] text-on-surface-variant truncate block mt-0.5">{ticket.description.replace(/<[^>]*>/g, '')}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/tickets/${ticket.ticketId}`} className="block">
                      <StatusBadge status={ticket.status} />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/tickets/${ticket.ticketId}`} className="block">
                      <PriorityBadge priority={ticket.priority} />
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-on-surface-variant whitespace-nowrap">
                    <Link href={`/tickets/${ticket.ticketId}`} className="block">
                      {formatDate(ticket.createdAt)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
