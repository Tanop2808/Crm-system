import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

export async function GET() {
  try {
    // For a real production app with millions of rows, we'd use raw SQL or Prisma groupBy with count.
    // For this prototype, we'll fetch minimal ticket data and aggregate in JS for simplicity.
    const tickets = await prisma.ticket.findMany({
      select: {
        customerName: true,
        customerEmail: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // Aggregate into a customer map
    const customerMap = new Map<string, {
      name: string;
      email: string;
      totalTickets: number;
      openTickets: number;
      latestActivity: Date;
    }>();

    for (const ticket of tickets) {
      const email = ticket.customerEmail;
      
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          name: ticket.customerName,
          email: email,
          totalTickets: 0,
          openTickets: 0,
          latestActivity: ticket.createdAt,
        });
      }

      const customer = customerMap.get(email)!;
      customer.totalTickets += 1;
      
      if (ticket.status === Status.OPEN) {
        customer.openTickets += 1;
      }
      
      // Update latest activity if this ticket is newer (already sorted desc, but just in case)
      if (ticket.createdAt > customer.latestActivity) {
        customer.latestActivity = ticket.createdAt;
      }
    }

    // Convert map back to array and sort by latest activity
    const customers = Array.from(customerMap.values()).sort((a, b) => 
      b.latestActivity.getTime() - a.latestActivity.getTime()
    );

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer data' },
      { status: 500 }
    );
  }
}
