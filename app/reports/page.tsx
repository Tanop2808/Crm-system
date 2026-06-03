'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Loader2, Target, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

  const statusData = data ? [
    { name: 'Open', value: data.byStatus.OPEN, color: 'var(--color-error)' },
    { name: 'In Progress', value: data.byStatus.IN_PROGRESS, color: 'var(--color-secondary)' },
    { name: 'Closed', value: data.byStatus.CLOSED, color: 'var(--color-outline)' },
  ] : [];

  const priorityData = data ? [
    { name: 'Low', value: data.byPriority.LOW, color: 'var(--color-outline)' },
    { name: 'Medium', value: data.byPriority.MEDIUM, color: 'var(--color-secondary)' },
    { name: 'High', value: data.byPriority.HIGH, color: 'var(--color-tertiary)' },
    { name: 'Urgent', value: data.byPriority.URGENT, color: 'var(--color-error)' },
  ] : [];

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
        <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Total Volume</span>
            <Target size={18} className="text-secondary" />
          </div>
          <span className="text-[32px] font-semibold text-on-surface leading-none block mb-1">
            {data.totalTickets}
          </span>
          <p className="text-[13px] text-on-surface-variant mt-2">All time submitted tickets</p>
        </div>

        <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
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

        <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Urgent Issues</span>
            <AlertTriangle size={18} className="text-error" />
          </div>
          <span className="text-[32px] font-semibold text-error leading-none block mb-1">
            {data.byPriority.URGENT}
          </span>
          <p className="text-[13px] text-on-surface-variant mt-2">Requiring immediate attention</p>
        </div>

        <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderRadius: '8px', border: '1px solid var(--color-outline-variant)' }}
                  itemStyle={{ color: 'var(--color-on-surface)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-xs text-on-surface-variant font-medium">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-on-surface mb-6">Priority Distribution</h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--color-surface-container)' }}
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: '1px solid var(--color-outline-variant)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>
    </main>
  );
}
