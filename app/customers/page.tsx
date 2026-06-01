'use client';

import { useState, useEffect } from 'react';
import { User, Mail, FolderOpen, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  name: string;
  email: string;
  totalTickets: number;
  openTickets: number;
  latestActivity: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) throw new Error('Failed to load customers');
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight mb-1">Customer Directory</h1>
        <p className="text-[14px] text-on-surface-variant">
          View all customers who have submitted support tickets.
        </p>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : error ? (
        <div className="bg-error-container/20 text-error p-6 rounded-xl border border-error-container flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider">Customer Info</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider text-center">Total Tickets</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider text-center">Active Issues</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider text-right">Latest Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <User className="text-outline-variant" size={48} />
                        <p className="text-[14px] text-on-surface-variant mt-2">No customers found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.email}
                      className="hover:bg-surface-container transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-on-surface">{customer.name}</span>
                            <span className="text-[13px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-on-surface">
                          <FolderOpen size={14} className="text-on-surface-variant" />
                          {customer.totalTickets}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {customer.openTickets > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-error-container text-on-error-container">
                            {customer.openTickets} Open
                          </span>
                        ) : (
                          <span className="text-[13px] text-on-surface-variant">All Clear</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[13px] text-on-surface-variant">
                          {formatDate(customer.latestActivity)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
