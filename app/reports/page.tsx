'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Loader2, Target, ShieldAlert } from 'lucide-react';

interface ReportData {
  totalTickets: number;
  resolutionRate: string;
  byStatus: {
    OPEN: number;
    IN_PROGRESS: number;
    CLOSED: number;
  };
  byPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    URGENT: number;
  };
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports');
        if (!res.ok) throw new Error('Failed to load reports');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchReports();

    // Set up polling interval for "Live Overview" (every 5 seconds)
    const intervalId = setInterval(fetchReports, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading && !data) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <div className="bg-error-container/20 text-error p-6 rounded-xl border border-error-container text-center">
          <p className="font-semibold">{error || 'Failed to load report data.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight mb-1">System Reports</h1>
          <p className="text-[14px] text-on-surface-variant">
            High-level analytics and performance metrics across all customer tickets.
          </p>
        </div>
        <div className="bg-success-container/20 px-4 py-2 rounded-lg border border-success-container/50 flex items-center gap-2 shadow-sm transition-all">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
          </span>
          <span className="text-sm font-semibold text-success uppercase tracking-wider">Live Overview</span>
        </div>
      </header>

      {/* Top Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Total Volume</span>
            <Target size={18} className="text-secondary" />
          </div>
          <span className="text-[32px] font-semibold text-on-surface leading-none block mb-1">
            {data.totalTickets}
          </span>
          <p className="text-[13px] text-on-surface-variant mt-2">All time submitted tickets</p>
        </div>

        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Resolution Rate</span>
            <TrendingUp size={18} className="text-primary" />
          </div>
          <span className="text-[32px] font-semibold text-on-surface leading-none block mb-1">
            {data.resolutionRate}%
          </span>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full" 
              style={{ width: `${data.resolutionRate}%` }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Urgent Issues</span>
            <AlertTriangle size={18} className="text-error" />
          </div>
          <span className="text-[32px] font-semibold text-error leading-none block mb-1">
            {data.byPriority.URGENT}
          </span>
          <p className="text-[13px] text-on-surface-variant mt-2">Requiring immediate attention</p>
        </div>

        <div className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Active Workload</span>
            <Clock size={18} className="text-tertiary" />
          </div>
          <span className="text-[32px] font-semibold text-on-surface leading-none block mb-1">
            {data.byStatus.IN_PROGRESS}
          </span>
          <p className="text-[13px] text-on-surface-variant mt-2">Tickets currently in progress</p>
        </div>
      </section>

      {/* Breakdown Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Breakdown */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-on-surface mb-6">Status Breakdown</h2>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-on-surface flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error-container border border-error"></span>
                  Open
                </span>
                <span className="font-semibold text-on-surface">{data.byStatus.OPEN}</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-outline-variant">
                <div 
                  className="bg-error-container h-full" 
                  style={{ width: `${(data.byStatus.OPEN / Math.max(data.totalTickets, 1)) * 100}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-on-surface flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container border border-secondary"></span>
                  In Progress
                </span>
                <span className="font-semibold text-on-surface">{data.byStatus.IN_PROGRESS}</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-outline-variant">
                <div 
                  className="bg-secondary-container h-full" 
                  style={{ width: `${(data.byStatus.IN_PROGRESS / Math.max(data.totalTickets, 1)) * 100}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-on-surface flex items-center gap-2">
                  <CheckCircle size={12} className="text-on-surface-variant" />
                  Closed
                </span>
                <span className="font-semibold text-on-surface">{data.byStatus.CLOSED}</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-outline-variant">
                <div 
                  className="bg-surface-container-highest h-full" 
                  style={{ width: `${(data.byStatus.CLOSED / Math.max(data.totalTickets, 1)) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-on-surface mb-6">Priority Distribution</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-outline-variant flex flex-col justify-between h-24">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Low</span>
              <span className="text-2xl font-semibold text-on-surface">{data.byPriority.LOW}</span>
            </div>
            
            <div className="bg-secondary-container/20 p-4 rounded-lg border border-secondary-container flex flex-col justify-between h-24">
              <span className="text-xs font-semibold text-on-secondary-container uppercase tracking-wider">Medium</span>
              <span className="text-2xl font-semibold text-on-secondary-container">{data.byPriority.MEDIUM}</span>
            </div>

            <div className="bg-tertiary-container/30 p-4 rounded-lg border border-tertiary-container flex flex-col justify-between h-24">
              <span className="text-xs font-semibold text-on-tertiary-container uppercase tracking-wider">High</span>
              <span className="text-2xl font-semibold text-on-tertiary-container">{data.byPriority.HIGH}</span>
            </div>

            <div className="bg-error-container/20 p-4 rounded-lg border border-error-container flex flex-col justify-between h-24 relative overflow-hidden">
              <ShieldAlert size={64} className="absolute -right-4 -bottom-4 text-error opacity-10" />
              <span className="text-xs font-semibold text-error uppercase tracking-wider z-10">Urgent</span>
              <span className="text-2xl font-semibold text-error z-10">{data.byPriority.URGENT}</span>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
