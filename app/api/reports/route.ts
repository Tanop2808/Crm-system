import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status, Priority } from '@prisma/client';

export async function GET() {
  try {
    const totalTickets = await prisma.ticket.count();
    
    // Group by Status
    const statusGroups = await prisma.ticket.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Group by Priority
    const priorityGroups = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: {
        id: true,
      },
    });

    const byStatus = {
      OPEN: 0,
      IN_PROGRESS: 0,
      CLOSED: 0,
    };
    
    statusGroups.forEach(group => {
      byStatus[group.status] = group._count.id;
    });

    const byPriority = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    priorityGroups.forEach(group => {
      byPriority[group.priority] = group._count.id;
    });

    // Calculate Resolution Rate
    const resolved = byStatus.CLOSED;
    const resolutionRate = totalTickets > 0 
      ? ((resolved / totalTickets) * 100).toFixed(1)
      : '0.0';

    const analytics = {
      totalTickets,
      resolutionRate,
      byStatus,
      byPriority,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error generating reports:', error);
    return NextResponse.json(
      { error: 'Failed to generate report analytics' },
      { status: 500 }
    );
  }
}
