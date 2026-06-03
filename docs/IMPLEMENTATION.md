# 🎫 Support CRM System — Implementation Plan
> Stack: Next.js 15 · React · Tailwind CSS · Prisma · Supabase · Vercel

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack & Why](#tech-stack--why)
3. [Folder Structure](#folder-structure)
4. [Database Schema](#database-schema)
5. [API Routes](#api-routes)
6. [Pages & Components](#pages--components)
7. [Step-by-Step Build Guide](#step-by-step-build-guide)
8. [Environment Variables](#environment-variables)
9. [Deployment Guide](#deployment-guide)
10. [README Checklist](#readme-checklist)
11. [Demo Video Script](#demo-video-script)

---

## Project Overview

A fully functional web-based Customer Support Ticketing CRM System that allows support teams to:
- Create and manage support tickets
- Search and filter tickets in real-time
- Update ticket status and add internal notes
- View full ticket history per customer

**Deliverables:**
- ✅ Live deployed URL (Vercel)
- ✅ GitHub repository with clean code
- ✅ 3–5 min demo video

---

## Tech Stack & Why

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 15 (App Router) + React | File-based routing, server components, fast |
| Styling | Tailwind CSS | Utility-first, fast to build clean UI |
| Backend | Next.js API Routes | No separate server needed, same repo |
| ORM | Prisma | Type-safe DB queries, great with Next.js |
| Database | Supabase (PostgreSQL) | Relational = perfect for tickets, free tier, Prisma support |
| Deployment | Vercel | Native Next.js support, free, one-click deploy |

---

## Folder Structure

```
support-crm/
│
├── prisma/
│   └── schema.prisma                  # Ticket + Note models
│
├── app/
│   ├── layout.tsx                     # Root layout with Navbar
│   ├── page.tsx                       # Home → Ticket Dashboard
│   │
│   ├── tickets/
│   │   ├── new/
│   │   │   └── page.tsx               # Create New Ticket
│   │   └── [id]/
│   │       └── page.tsx               # Ticket Detail + Update
│   │
│   └── api/
│       └── tickets/
│           ├── route.ts               # GET /api/tickets, POST /api/tickets
│           └── [id]/
│               └── route.ts           # GET /api/tickets/:id, PUT /api/tickets/:id
│
├── components/
│   ├── Navbar.tsx                     # Top nav with logo + "New Ticket" button
│   ├── TicketTable.tsx                # Table listing all tickets
│   ├── TicketForm.tsx                 # Create ticket form
│   ├── TicketDetail.tsx               # Detail view with notes + status update
│   ├── SearchBar.tsx                  # Debounced real-time search
│   ├── StatusFilter.tsx               # Open / In Progress / Closed filter tabs
│   └── StatusBadge.tsx                # Colored pill component for status
│
├── lib/
│   └── prisma.ts                      # Prisma client singleton (avoid hot-reload issues)
│
├── types/
│   └── ticket.ts                      # TypeScript interfaces for Ticket + Note
│
├── .env                               # Local secrets — NEVER commit
├── .env.example                       # Safe template — always commit
├── .gitignore
├── README.md
└── IMPLEMENTATION.md                  # This file
```

---

## Database Schema

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Ticket {
  id            String   @id @default(cuid())
  ticketId      String   @unique          // e.g. TKT-001
  customerName  String
  customerEmail String
  subject       String
  description   String
  status        Status   @default(OPEN)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  notes         Note[]
}

model Note {
  id        String   @id @default(cuid())
  noteText  String
  createdAt DateTime @default(now())
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
}

enum Status {
  OPEN
  IN_PROGRESS
  CLOSED
}
```

### Auto-generating Ticket IDs (TKT-001 format)

```ts
// In POST /api/tickets route
const count = await prisma.ticket.count()
const ticketId = `TKT-${String(count + 1).padStart(3, '0')}`
```

---

## API Routes

### `POST /api/tickets`
**Purpose:** Create a new ticket
```
Body:   { customerName, customerEmail, subject, description }
Returns: { ticketId, createdAt }
```

### `GET /api/tickets`
**Purpose:** List all tickets with optional search & filter
```
Query params: ?search=john&status=OPEN
Returns: [{ ticketId, customerName, subject, status, createdAt }]
```

Search logic — filter where:
- `customerName` contains search term, OR
- `customerEmail` contains search term, OR
- `subject` contains search term, OR
- `ticketId` contains search term

### `GET /api/tickets/[id]`
**Purpose:** Get single ticket with all notes
```
Returns: { ticketId, customerName, customerEmail, subject, description, status, notes[], createdAt, updatedAt }
```

### `PUT /api/tickets/[id]`
**Purpose:** Update status and/or add a note
```
Body:   { status?, noteText? }
Returns: { success: true, updatedAt }
```

---

## Pages & Components

### Pages

#### `app/page.tsx` — Dashboard (Home)
- Renders `<SearchBar />`, `<StatusFilter />`, `<TicketTable />`
- Fetches tickets from `/api/tickets` on load
- Re-fetches when search or filter changes (use `useEffect` + debounce)
- "New Ticket" button links to `/tickets/new`

#### `app/tickets/new/page.tsx` — Create Ticket
- Renders `<TicketForm />`
- On submit: POST to `/api/tickets`, redirect to home on success
- Show loading state during submission

#### `app/tickets/[id]/page.tsx` — Ticket Detail
- Fetches ticket by ID from `/api/tickets/[id]`
- Renders `<TicketDetail />` with all info + notes
- Allows status update + add note via PUT request

---

### Components

#### `Navbar.tsx`
```
- Logo / App name on the left
- "New Ticket" button (green) on the right
- Sticky top bar
```

#### `TicketTable.tsx`
```
Props: tickets[]
- Renders a clean table with columns: Ticket ID | Customer | Subject | Status | Date
- Each row is clickable → navigates to /tickets/[id]
- StatusBadge inside Status column
- Empty state message when no tickets found
```

#### `TicketForm.tsx`
```
Fields:
- Customer Name (required)
- Customer Email (required, email validation)
- Subject (required)
- Description (required, textarea)

- Submit button with loading spinner
- Error messages per field
```

#### `SearchBar.tsx`
```
- Controlled input
- Debounced (300ms) to avoid excessive API calls
- Calls parent onChange handler
- Clear button (×) when text present
```

#### `StatusFilter.tsx`
```
- Tab-style buttons: All | Open | In Progress | Closed
- Active tab highlighted
- Calls parent onFilterChange handler
```

#### `StatusBadge.tsx`
```
Props: status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
- OPEN → green badge
- IN_PROGRESS → yellow/amber badge
- CLOSED → gray badge
```

#### `TicketDetail.tsx`
```
Props: ticket (full object with notes)
- Shows all ticket fields
- Dropdown to update status
- Textarea + button to add a new note
- Notes list showing text + timestamp
```

---

## Step-by-Step Build Guide

### Day 1 — Setup + Database + API

#### Step 1: Initialize Project
```bash
npx create-next-app@latest support-crm
# Options: TypeScript ✅ | Tailwind ✅ | App Router ✅ | ESLint ✅

cd support-crm
```

#### Step 2: Install Dependencies
```bash
npm install prisma @prisma/client
npm install -D @types/node
npx prisma init
```

#### Step 3: Set Up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → Connection String (URI mode)
3. Copy the connection string → paste into `.env` as `DATABASE_URL`
4. Replace `[YOUR-PASSWORD]` with your actual DB password

#### Step 4: Write Prisma Schema
- Copy the schema from the [Database Schema](#database-schema) section above
- Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Step 5: Create Prisma Client Singleton
```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
```

#### Step 6: Build API Routes
- `app/api/tickets/route.ts` → GET + POST
- `app/api/tickets/[id]/route.ts` → GET one + PUT

---

### Day 2 — Frontend Pages + Features

#### Step 7: Build Components (in this order)
1. `StatusBadge.tsx` (simplest, no deps)
2. `SearchBar.tsx`
3. `StatusFilter.tsx`
4. `TicketTable.tsx` (uses StatusBadge)
5. `TicketForm.tsx`
6. `TicketDetail.tsx` (uses StatusBadge)
7. `Navbar.tsx`

#### Step 8: Build Pages
1. `app/layout.tsx` → add Navbar, set font + background
2. `app/page.tsx` → Dashboard with search + filter + table
3. `app/tickets/new/page.tsx` → Create form
4. `app/tickets/[id]/page.tsx` → Detail + update

#### Step 9: Wire Everything Together
- Test full flow: Create → List → Search → Filter → View → Update
- Check all API calls work with `console.log` or Network tab in DevTools

---

### Day 3 — Polish + Deploy

#### Step 10: UI Polish
- Consistent spacing, colors, font sizes throughout
- Loading spinners on all async actions
- Error messages on form validation
- Empty states (no tickets found, no notes yet)
- Mobile responsive layout (Tailwind `sm:` prefixes)

#### Step 11: Error Handling
```ts
// In every API route, wrap with try/catch
try {
  // ... db logic
} catch (error) {
  return NextResponse.json(
    { error: 'Something went wrong' },
    { status: 500 }
  )
}
```

#### Step 12: Final Checks Before Deploy
- [ ] All 5 features working end-to-end
- [ ] No console errors
- [ ] `.env.example` has all variable names (no values)
- [ ] `.env` is in `.gitignore`
- [ ] README.md is written

---

## Environment Variables

### `.env` (local, never commit)
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### `.env.example` (commit this)
```env
DATABASE_URL="your-supabase-postgresql-connection-string-here"
```

### Vercel Environment Variables
In Vercel dashboard → Project → Settings → Environment Variables:
- Add `DATABASE_URL` with your Supabase connection string

---

## Deployment Guide

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "initial commit: support CRM system"
git remote add origin https://github.com/YOUR_USERNAME/support-crm.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add `DATABASE_URL` environment variable
4. Click Deploy

### Step 3: Run Prisma Migration on Production DB
Since Supabase is your DB (not Vercel's), your production DB is already set up.
Just make sure the `DATABASE_URL` on Vercel points to the same Supabase instance.

### Step 4: Verify Live App
- Create a ticket ✅
- Search for it ✅
- Filter by status ✅
- Update status + add note ✅

---

## README Checklist

Your `README.md` should include:

```md
# Support CRM System

Brief description of what it does.

## Live Demo
[https://your-app.vercel.app](https://your-app.vercel.app)

## Tech Stack
- Next.js 15, React, Tailwind CSS
- Prisma ORM
- Supabase (PostgreSQL)
- Vercel

## Features
- Create tickets with auto-generated IDs
- List, search, and filter tickets
- View and update ticket status
- Add internal notes to tickets

## Local Setup

### Prerequisites
- Node.js 18+
- Supabase account

### Steps
1. Clone the repo
   git clone https://github.com/YOUR_USERNAME/support-crm.git
   cd support-crm

2. Install dependencies
   npm install

3. Set up environment variables
   cp .env.example .env
   # Fill in your DATABASE_URL from Supabase

4. Run database migration
   npx prisma migrate dev

5. Start the dev server
   npm run dev

6. Open http://localhost:3000
```

---

## Demo Video Script

**Duration: 3–5 minutes**

### Section 1 — Introduction (30 sec)
> "Hi, I'm [Name]. I built a Customer Support Ticketing CRM using Next.js 15, Prisma, Supabase, and deployed it on Vercel. Let me walk you through it."

### Section 2 — Live App Demo (2 min)
1. Show the home dashboard with the ticket list
2. Create a new ticket (fill the form, submit, show it appears in list)
3. Search for a ticket by name/email in real-time
4. Filter tickets by status (Open → In Progress → Closed)
5. Click into a ticket, update its status, add a note

### Section 3 — Code Walkthrough (1.5 min)
1. Show `prisma/schema.prisma` — explain the two tables
2. Show `app/api/tickets/route.ts` — explain GET + POST
3. Show `app/page.tsx` — explain search + filter + data fetching
4. Show `components/TicketTable.tsx` — explain the UI component

### Section 4 — Wrap Up (30 sec)
> "The biggest challenge was [X — e.g. debouncing search + filter together]. I solved it by [Y]. Given more time, I'd add [authentication / email notifications / analytics dashboard]."

---

## Extra Features (If Time Allows)
- **Priority levels** — Low / Medium / High per ticket
- **Assigned agent** — assign tickets to team members
- **Email field validation** — regex on frontend + API
- **Pagination** — limit 10 tickets per page
- **Dark mode** — Tailwind `dark:` variants
- **Toast notifications** — success/error feedback on actions

---

*Built for Datastraw Technologies Internship Assessment*
