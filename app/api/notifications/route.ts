import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/notifications - Get recent 20 notifications and unread count
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        isRead: false,
      },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body can be empty (e.g. mark all as read)
    }

    const { id } = body;

    if (id) {
      // Mark specific notification as read
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } else {
      // Mark all unread notifications as read
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
