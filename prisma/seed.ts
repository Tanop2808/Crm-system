import { PrismaClient, Status, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding baseline support tickets...');

  // Clean existing records
  await prisma.note.deleteMany({});
  await prisma.ticket.deleteMany({});

  // 1. TKT-001
  const t1 = await prisma.ticket.create({
    data: {
      ticketId: 'TKT-001',
      customerName: 'Alex Rivera',
      customerEmail: 'arivera@techflow.io',
      subject: 'Payment gateway integration failure on production environment',
      description: `The checkout endpoint \`/api/v1/checkout\` is returning a 500 Internal Server Error for users trying to process payments with international credit cards. This was first reported by several enterprise customers in the EMEA region.

Steps to reproduce:
1. Set account locale to 'FR' or 'DE'
2. Attempt checkout with a test Visa card
3. Observe 500 status code in network logs.`,
      status: Status.OPEN,
      priority: Priority.URGENT,
      notes: {
        create: [
          {
            author: 'Mark Wilson (Support)',
            content: "Notified the customer that we are looking into this. High priority as it's affecting revenue.",
            isInternal: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          },
          {
            author: 'Sarah Jenkins (Engineering)',
            content: 'I\'ve looked into the logs and it seems like the currency conversion service is timing out for EUR transactions. Investigating the gateway middleware now.',
            isInternal: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
        ],
      },
    },
  });

  // 2. TKT-002
  await prisma.ticket.create({
    data: {
      ticketId: 'TKT-002',
      customerName: 'Sarah Jenkins',
      customerEmail: 's.jenkins@brightview.com',
      subject: 'Unable to export Q3 analytics report to PDF format',
      description: 'Exporting Q3 dashboard panels to PDF halts at 60% and returns a connection timeout after 30 seconds. This is blocking board meeting preparations for Brightview.',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
    },
  });

  // 3. TKT-003
  await prisma.ticket.create({
    data: {
      ticketId: 'TKT-003',
      customerName: 'Marcus Thorne',
      customerEmail: 'mthorne@nexus.net',
      subject: 'New user onboarding flow missing localized strings',
      description: 'The onboarding steps display key strings instead of translations when the browser language is set to Spanish or French. Missing keys: onboarding.welcome and onboarding.step1.title.',
      status: Status.CLOSED,
      priority: Priority.LOW,
    },
  });

  // 4. TKT-004
  await prisma.ticket.create({
    data: {
      ticketId: 'TKT-004',
      customerName: 'Elena Rodriguez',
      customerEmail: 'erodriguez@solarsystems.io',
      subject: 'Password reset link not arriving for new enterprise seats',
      description: 'New users invited to Solar Systems enterprise portal report that they are not receiving the verification or password reset links. Verified spam folders, and no emails hit their servers.',
      status: Status.OPEN,
      priority: Priority.URGENT,
    },
  });

  // 5. TKT-005
  await prisma.ticket.create({
    data: {
      ticketId: 'TKT-005',
      customerName: 'David Kim',
      customerEmail: 'dkim@velocitypartners.com',
      subject: 'Bulk import of customer CSV stalling at 85% completion',
      description: 'CSV importer halts indefinitely when processing batches larger than 10,000 records. Stalls exactly at 85% completion mark without thrown exception in the console.',
      status: Status.IN_PROGRESS,
      priority: Priority.MEDIUM,
    },
  });

  console.log('Successfully seeded 5 baseline support tickets with note threads!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
