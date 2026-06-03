import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status, Priority } from '@prisma/client';

type Params = {
  params: Promise<{
    ticketId: string;
  }>;
};

// GET /api/tickets/[ticketId] - Get single ticket by user-facing ticketId with all notes
export async function GET(request: Request, { params }: Params) {
  try {
    const { ticketId } = await params;
    const cleanTicketId = ticketId.toUpperCase();

    const ticket = await prisma.ticket.findUnique({
      where: {
        ticketId: cleanTicketId,
      },
      include: {
        notes: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: `Ticket ${cleanTicketId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket details' },
      { status: 500 }
    );
  }
}

// PATCH /api/tickets/[ticketId] - Update status, priority, and/or add note
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { ticketId } = await params;
    const cleanTicketId = ticketId.toUpperCase();

    const body = await request.json();
    const { status, priority, note } = body;

    // Check if the ticket exists first
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId: cleanTicketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: `Ticket ${cleanTicketId} not found` },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {};

    if (status) {
      const cleanStatus = status.toUpperCase();
      if (Object.values(Status).includes(cleanStatus as Status)) {
        updateData.status = cleanStatus as Status;
      } else {
        return NextResponse.json(
          { error: `Invalid status: ${status}. Must be one of OPEN, IN_PROGRESS, CLOSED` },
          { status: 400 }
        );
      }
    }

    if (priority) {
      const cleanPriority = priority.toUpperCase();
      if (Object.values(Priority).includes(cleanPriority as Priority)) {
        updateData.priority = cleanPriority as Priority;
      } else {
        return NextResponse.json(
          { error: `Invalid priority: ${priority}. Must be one of LOW, MEDIUM, HIGH, URGENT` },
          { status: 400 }
        );
      }
    }

    // Process update and note creation inside an atomic transaction
    const updatedTicketWithNotes = await prisma.$transaction(async (tx) => {
      // 1. Perform Ticket updates if any fields were provided
      if (Object.keys(updateData).length > 0) {
        await tx.ticket.update({
          where: { ticketId: cleanTicketId },
          data: updateData,
        });

        if (updateData.status) {
          await tx.notification.create({
            data: {
              title: 'Ticket Status Updated',
              message: `Ticket ${cleanTicketId} status changed to ${updateData.status.replace('_', ' ')}.`,
              type: 'STATUS_UPDATED',
              link: `/tickets/${cleanTicketId}`,
            },
          });
        }

        if (updateData.priority) {
          await tx.notification.create({
            data: {
              title: 'Ticket Priority Changed',
              message: `Ticket ${cleanTicketId} priority set to ${updateData.priority}.`,
              type: 'PRIORITY_UPDATED',
              link: `/tickets/${cleanTicketId}`,
            },
          });
        }
      }

      // 2. Append Note if note is provided
      if (note && note.content && note.content.trim() !== '') {
        await tx.note.create({
          data: {
            content: note.content.trim(),
            isInternal: note.isInternal ?? false,
            author: note.author || 'Support Agent',
            ticketId: ticket.id, // Links via internal cuid primary key
          },
        });

        await tx.notification.create({
          data: {
            title: 'New Note Added',
            message: `A new ${note.isInternal ? 'internal ' : ''}note was added to ticket ${cleanTicketId}.`,
            type: 'NOTE_ADDED',
            link: `/tickets/${cleanTicketId}`,
          },
        });
      }

      // 3. Return the fully updated ticket with notes
      return tx.ticket.findUnique({
        where: { ticketId: cleanTicketId },
        include: {
          notes: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    });

    return NextResponse.json(updatedTicketWithNotes);
  } catch (error) {
    console.error('Error updating ticket details:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket details' },
      { status: 500 }
    );
  }
}
