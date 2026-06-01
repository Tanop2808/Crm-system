'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customerName.trim()) errs.customerName = 'Customer name is required.';
    if (!form.customerEmail.trim()) errs.customerEmail = 'Customer email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
      errs.customerEmail = 'Please enter a valid email address.';
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || 'Failed to create ticket.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: string) =>
    `w-full h-10 px-4 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline ${
      errors[field] ? 'border-error bg-error-container/10' : 'border-outline-variant bg-white'
    }`;

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center">
      {/* Back Link */}
      <div className="w-full max-w-[640px] mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Tickets
        </Link>
      </div>

      {/* Header */}
      <div className="w-full max-w-[640px] mb-8 text-left">
        <h1 className="text-2xl font-semibold text-on-surface mb-1 tracking-tight">Create New Ticket</h1>
        <p className="text-[14px] text-on-surface-variant">
          Please fill out the details below to open a new support request. Our team will review it shortly.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-[640px] bg-white border border-outline-variant rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-on-surface-variant" htmlFor="customerName">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              placeholder="e.g. Alexander Hamilton"
              className={fieldClass('customerName')}
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
            {errors.customerName && <p className="text-[12px] text-error">{errors.customerName}</p>}
          </div>

          {/* Customer Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-on-surface-variant" htmlFor="customerEmail">
              Customer Email
            </label>
            <input
              id="customerEmail"
              type="email"
              placeholder="alex@example.com"
              className={fieldClass('customerEmail')}
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
            {errors.customerEmail && <p className="text-[12px] text-error">{errors.customerEmail}</p>}
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-on-surface-variant" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Brief summary of the issue"
              className={fieldClass('subject')}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            {errors.subject && <p className="text-[12px] text-error">{errors.subject}</p>}
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-on-surface-variant" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              className="w-full h-10 px-4 border border-outline-variant rounded-md bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-on-surface-variant" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Provide as much detail as possible..."
              className={`w-full px-4 py-2 border rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline resize-none ${
                errors.description ? 'border-error bg-error-container/10' : 'border-outline-variant bg-white'
              }`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="text-[12px] text-error">{errors.description}</p>}
          </div>

          {/* Global Error */}
          {errors.submit && (
            <p className="text-[13px] text-error bg-error-container/20 px-4 py-2 rounded-md">
              {errors.submit}
            </p>
          )}

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-4">
            <Link
              href="/"
              className="px-6 h-10 flex items-center text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors rounded-md active:scale-95"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className={`px-6 h-10 text-xs font-semibold rounded-md active:scale-95 transition-all shadow-sm flex items-center gap-2 ${
                success
                  ? 'bg-green-600 text-white'
                  : 'bg-primary-container text-white hover:bg-primary'
              } disabled:opacity-80`}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : success ? (
                '✓ Success!'
              ) : (
                'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Pro Tip */}
      <div className="w-full max-w-[640px] mt-8 p-4 bg-surface-container-low rounded-lg border border-dashed border-outline-variant flex gap-4 items-start">
        <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
        <div>
          <p className="text-[12px] font-semibold text-on-surface mb-1">Pro Tip</p>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Attaching screenshots often helps our support team resolve issues 30% faster. You can drag and drop images
            directly into the description field above.
          </p>
        </div>
      </div>
    </main>
  );
}
