import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: Promise<{
    email: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email).trim().toLowerCase();

    // Query database for all tickets by this customer
    const tickets = await prisma.ticket.findMany({
      where: {
        customerEmail: {
          equals: decodedEmail,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (tickets.length === 0) {
      return NextResponse.json(
        { error: `Customer with email ${decodedEmail} not found` },
        { status: 404 }
      );
    }

    // Since customer name is stored per-ticket, retrieve it from the most recent ticket
    const customerName = tickets[0].customerName;

    // Calculate metrics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const closedTickets = tickets.filter((t) => t.status === 'CLOSED').length;

    return NextResponse.json({
      name: customerName,
      email: decodedEmail,
      stats: {
        totalTickets,
        openTickets,
        inProgressTickets,
        closedTickets,
      },
      tickets,
    });
  } catch (error) {
    console.error('Error fetching customer details API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    );
  }
}
