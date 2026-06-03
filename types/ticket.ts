export type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Note {
  id: string;
  content: string;
  isInternal: boolean;
  author: string;
  createdAt: string | Date;
  ticketId: string;
}


export interface Ticket {
  id: string;
  ticketId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string | Date;
  updatedAt: string | Date;
  notes?: Note[];
  activityLogs?: ActivityLog[];
  _count?: {
    notes: number;
    activityLogs?: number;
  };
}

export interface ActivityLog {
  id: string;
  ticketId: string;
  actor: string;
  action: string;
  message: string;
  prevValue: string | null;
  newValue: string | null;
  createdAt: string | Date;
}

