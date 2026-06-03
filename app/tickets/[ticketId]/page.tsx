'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Clock, User, Mail, Loader2, Send, 
  Zap, Shield, CheckCircle2, MessageSquare, PlusCircle 
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/status-badge';
import { Ticket, Status, Priority, Note, ActivityLog } from '@/types/ticket';
import RichTextEditor from '@/components/rich-text-editor';

// Extend Ticket to include notes and logs for the detail view
interface TicketWithNotes extends Ticket {
  notes: Note[];
  activityLogs: ActivityLog[];
}


const STATUS_OPTIONS: Status[] = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
const PRIORITY_OPTIONS: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = use(params);

  const [ticket, setTicket] = useState<TicketWithNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note form state
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);

  // Status/Priority update state
  const [updating, setUpdating] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (!res.ok) {
        if (res.status === 404) setError('Ticket not found.');
        else setError('Failed to load ticket.');
        return;
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleUpdate = async (field: 'status' | 'priority', value: string) => {
    if (!ticket) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTicket(updated);
      }
    } catch (err) {
      console.error('Failed to update ticket', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !ticket) return;

    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: {
            content: newNote.trim(),
            isInternal,
          },
        }),
      });

      if (res.ok) {
        const updatedTicket = await res.json();
        setTicket(updatedTicket); // API returns the full updated ticket with notes
        setNewNote('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };


  if (loading) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2 text-on-surface-variant">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm font-medium">Loading ticket details...</p>
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="bg-error-container/20 text-error p-6 rounded-xl border border-error-container text-center">
          <p className="font-semibold">{error || 'Ticket not found.'}</p>
        </div>
      </main>
    );
  }

  // Combine notes and activityLogs into a single chronological timeline
  const timelineEvents = (() => {
    interface TimelineEvent {
      id: string;
      type: 'NOTE' | 'ACTIVITY';
      createdAt: Date;
      content?: string;
      isInternal?: boolean;
      author?: string;
      actor?: string;
      action?: string;
      message?: string;
      prevValue?: string | null;
      newValue?: string | null;
    }
    
    const events: TimelineEvent[] = [];
    
    if (ticket.notes) {
      ticket.notes.forEach((note) => {
        events.push({
          id: note.id,
          type: 'NOTE',
          createdAt: new Date(note.createdAt),
          content: note.content,
          isInternal: note.isInternal,
          author: note.author,
        });
      });
    }
    
    if (ticket.activityLogs) {
      ticket.activityLogs.forEach((log) => {
        events.push({
          id: log.id,
          type: 'ACTIVITY',
          createdAt: new Date(log.createdAt),
          actor: log.actor,
          action: log.action,
          message: log.message,
          prevValue: log.prevValue,
          newValue: log.newValue,
        });
      });
    }
    
    // Sort oldest first (ascending)
    return events.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  })();

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Tickets
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-on-surface-variant flex items-center gap-1">
            <Clock size={14} /> Created: {formatDate(ticket.createdAt as string)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket Details & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Ticket Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-on-surface mb-2 tracking-tight">{ticket.subject}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-mono text-primary bg-primary-container/30 px-2 py-0.5 rounded font-semibold">
                    {ticket.ticketId}
                  </span>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </div>
            
            <hr className="border-outline-variant my-4" />
            
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: ticket.description }} 
            />
          </div>

          {/* Notes & Activity Section */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-on-surface mb-6">Activity Timeline</h2>
            
            {/* Timeline Feed */}
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar mb-6">
              {timelineEvents.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant text-[13px]">
                  No activity logged yet. Be the first to add a note.
                </div>
              ) : (
                <div className="relative pl-6 border-l border-outline-variant/80 space-y-6 ml-3 mr-2 py-2">
                  {timelineEvents.map((event) => {
                    const isNote = event.type === 'NOTE';
                    
                    // Determine Marker Icon & Colors
                    let markerBg = "bg-surface border-outline-variant text-on-surface-variant";
                    let IconComponent = MessageSquare;
                    
                    if (isNote) {
                      if (event.isInternal) {
                        markerBg = "bg-amber-50 dark:bg-amber-950/20 border-amber-400 text-amber-600 dark:text-amber-400";
                        IconComponent = Shield;
                      } else {
                        markerBg = "bg-blue-50 dark:bg-blue-950/20 border-blue-400 text-blue-600 dark:text-blue-400";
                        IconComponent = MessageSquare;
                      }
                    } else {
                      switch (event.action) {
                        case 'TICKET_CREATED':
                          markerBg = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 text-emerald-600 dark:text-emerald-400";
                          IconComponent = PlusCircle;
                          break;
                        case 'STATUS_CHANGE':
                          markerBg = "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-600 dark:text-indigo-400";
                          IconComponent = CheckCircle2;
                          break;
                        case 'PRIORITY_CHANGE':
                          markerBg = "bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-600 dark:text-rose-400";
                          IconComponent = Zap;
                          break;
                      }
                    }
                    
                    return (
                      <div key={event.id} className="relative group animate-fade-in">
                        {/* Timeline Connector Dot / Icon */}
                        <div className={`absolute -left-[37px] top-1 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-105 duration-200 ${markerBg}`}>
                          <IconComponent size={14} className="stroke-[2.5]" />
                        </div>
                        
                        {isNote ? (
                          // Note Comment Block
                          <div className={`rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow ${
                            event.isInternal 
                              ? 'bg-amber-50/50 dark:bg-amber-950/5 border-amber-200/60 dark:border-amber-900/30' 
                              : 'bg-surface-container-lowest border-outline-variant/60'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-on-surface">{event.author}</span>
                                {event.isInternal && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200/50">
                                    Internal
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-medium text-on-surface-variant opacity-80">{formatDate(event.createdAt)}</span>
                            </div>
                            <div 
                              className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-relaxed text-on-surface/90" 
                              dangerouslySetInnerHTML={{ __html: event.content || '' }} 
                            />
                          </div>
                        ) : (
                          // Simple Activity Log Item
                          <div className="flex items-center justify-between py-1.5 px-1">
                            <p className="text-[13px] text-on-surface-variant font-medium">
                              <span className="font-bold text-on-surface">{event.actor}</span> {event.message}
                            </p>
                            <span className="text-[10px] font-medium text-on-surface-variant opacity-70 flex-shrink-0 ml-4">
                              {formatDate(event.createdAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mt-4">
              <RichTextEditor
                content={newNote}
                onChange={(content) => setNewNote(content)}
              />
              <div className="flex items-center justify-between mt-3 bg-surface-container-lowest p-3 border border-outline-variant rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4"
                  />
                  <span className="text-[13px] font-medium text-on-surface-variant select-none">Internal Note Only</span>
                </label>
                <button
                  type="submit"
                  disabled={!newNote.trim() || submittingNote}
                  className="bg-primary-container text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-sm"
                >
                  {submittingNote ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-[13px] font-semibold text-secondary uppercase tracking-wider mb-4">Manage Ticket</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleUpdate('status', e.target.value)}
                  disabled={updating}
                  className="w-full h-9 px-3 border border-outline-variant rounded bg-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-on-surface-variant">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handleUpdate('priority', e.target.value)}
                  disabled={updating}
                  className="w-full h-9 px-3 border border-outline-variant rounded bg-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-[13px] font-semibold text-secondary uppercase tracking-wider mb-4">Customer Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-on-surface">{ticket.customerName}</p>
                  <p className="text-[12px] text-on-surface-variant">Customer</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                  <Mail size={16} />
                </div>
                <div>
                  <a href={`mailto:${ticket.customerEmail}`} className="text-[14px] text-primary hover:underline">
                    {ticket.customerEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
