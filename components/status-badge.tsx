import { Status, Priority } from '@/types/ticket';

interface StatusBadgeProps {
  status: Status;
}

interface PriorityBadgeProps {
  priority: Priority;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    OPEN: 'bg-error-container text-on-error-container',
    IN_PROGRESS: 'bg-secondary-container text-on-secondary-container',
    CLOSED: 'bg-surface-container-highest text-on-surface-variant',
  };

  const label = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    CLOSED: 'Closed',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${config[status]}`}
    >
      {label[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    LOW: 'bg-surface-container text-on-surface-variant',
    MEDIUM: 'bg-secondary-container text-on-secondary-container',
    HIGH: 'bg-tertiary-fixed text-on-tertiary-fixed',
    URGENT: 'bg-error-container text-on-error-container',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${config[priority]}`}
    >
      {priority}
    </span>
  );
}
