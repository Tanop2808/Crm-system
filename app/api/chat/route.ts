import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, stepCountIs, tool } from 'ai';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: modelMessages,
      system: `You are a highly capable AI assistant built into a CRM/Support Ticketing system called SupportDesk. 
Your job is to help support agents by drafting polite, professional responses to customers, summarizing long tickets, and answering internal questions. 
Keep your answers concise, empathetic, and directly useful to a busy support agent.

You have access to tools to view and list support tickets in the database. When the user asks about specific tickets or ticket statuses, USE these tools to fetch the live data and answer their question. Always present the live ticket information clearly.`,
      stopWhen: stepCountIs(2),
      timeout: 8000,
      tools: {
        listTickets: tool({
          description: 'List support tickets in the database. Returns ticket ID, subject, status, priority, and customer details. You can filter by status or priority.',
          inputSchema: z.object({
            status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
            priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
          }),
          execute: async ({ status, priority }) => {
            try {
              const whereClause: any = {};
              if (status) whereClause.status = status;
              if (priority) whereClause.priority = priority;
              const tickets = await prisma.ticket.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: 10
              });
              return tickets;
            } catch (err) {
              console.error('Error in listTickets tool:', err);
              return { error: 'Failed to fetch tickets' };
            }
          }
        }),
        getTicketDetails: tool({
          description: 'Retrieve the full details of a specific ticket by its human-readable ticket ID (e.g. TKT-001) or database ID, including all notes/updates.',
          inputSchema: z.object({
            ticketId: z.string(),
          }),
          execute: async ({ ticketId }) => {
            try {
              // Convert TKT-1 format to TKT-001 if needed
              let normalizedId = ticketId.trim();
              if (normalizedId.toUpperCase().startsWith('TKT-')) {
                const numPart = normalizedId.substring(4);
                if (numPart.length < 3 && !isNaN(Number(numPart))) {
                  normalizedId = `TKT-${numPart.padStart(3, '0')}`;
                }
              }

              const ticket = await prisma.ticket.findFirst({
                where: {
                  OR: [
                    { id: normalizedId },
                    { ticketId: { equals: normalizedId, mode: 'insensitive' } }
                  ]
                },
                include: {
                  notes: {
                    orderBy: { createdAt: 'asc' }
                  }
                }
              });
              return ticket || { error: `Ticket ${ticketId} not found` };
            } catch (err) {
              console.error('Error in getTicketDetails tool:', err);
              return { error: 'Failed to fetch ticket details' };
            }
          }
        })
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
