import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status, Priority } from '@prisma/client';

// GET /api/tickets - List all tickets with optional search & status filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const statusParam = searchParams.get('status')?.trim().toUpperCase() || 'ALL';

    // Build filter conditions
    const whereClause: any = {};

    // Apply Status Filter
    if (statusParam !== 'ALL') {
      if (Object.values(Status).includes(statusParam as Status)) {
        whereClause.status = statusParam as Status;
      }
    }

    // Apply Search Filter (Search in customerName, customerEmail, subject, and ticketId)
    if (search !== '') {
      whereClause.OR = [
        { ticketId: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { notes: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new support ticket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, subject, description, priority } = body;

    // Basic Validation
    if (!customerName || !customerEmail || !subject || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, subject, description' },
        { status: 400 }
      );
    }

    // Calculate sequential ticket ID (TKT-001 format)
    const count = await prisma.ticket.count();
    const ticketId = `TKT-${String(count + 1).padStart(3, '0')}`;

    // Map priority string to enum
    let ticketPriority: Priority = Priority.MEDIUM;
    if (priority && Object.values(Priority).includes(priority.toUpperCase() as Priority)) {
      ticketPriority = priority.toUpperCase() as Priority;
    }


    const newTicket = await prisma.ticket.create({
      data: {
        ticketId,
        customerName,
        customerEmail,
        subject,
        description,
        priority: ticketPriority,
        status: Status.OPEN,
      },
    });

    // Create a notification for new ticket
    try {
      await prisma.notification.create({
        data: {
          title: 'New Ticket Created',
          message: `Ticket ${ticketId} has been submitted by ${customerName}.`,
          type: 'TICKET_CREATED',
          link: `/tickets/${ticketId}`,
        },
      });
    } catch (notifError) {
      console.error('Failed to create notification for new ticket:', notifError);
    }

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}
