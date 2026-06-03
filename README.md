# SupportDesk CRM

A modern, full-stack Customer Support Ticketing CRM System built with Next.js 16, Tailwind CSS, Prisma, Supabase, and Google Gemini AI.

## 🚀 Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Backend:** Next.js Route Handlers (API)
- **Database & ORM:** Supabase (PostgreSQL), Prisma v6
- **AI Integration:** Google Gemini SDK (`@ai-sdk/google`)
- **Deployment:** Vercel

## ✨ Key Features
- **Dashboard & Analytics:** Real-time metrics tracking (Total tickets, Resolution Rate, Open vs Closed, and Priority distribution charts).
- **Interactive Ticket Feed:** Filter, search, and sort tickets instantly in a high-fidelity data table.
- **Dynamic Ticket Workspaces:** Inspect ticket statuses, updates, and toggle priorities on the fly.
- **Internal & Public Notes:** Add updates, keep private internal logs, or toggle notes visibility.
- **AI Assistant Chatbot:** Embedded sidebar workspace assistant powered by Google Gemini to help draft responses, summarize ticket threads, and retrieve customer info.
- **Customer Profiles:** Full dynamic history view aggregate for every customer, showing overall metrics and past tickets.
- **Real-Time Notification Stream:** A database-backed notifications system triggered on updates/creates with auto-polling (every 10s) and status marks.
- **Mock Login Portal:** A polished login screen featuring shifting mesh gradient backdrops, entry transitions, card validation shake animations, and quick credential autofilling.

---

## 🔑 Demo Access
To explore the CRM agent dashboard, use the pre-configured demo account:
*   **Email:** `admin@demo.com`
*   **Password:** `admin123`

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- A Supabase Project (or any PostgreSQL instance)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanop2808/Crm-system.git
   cd Crm-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a `.env` file in the root directory (based on `.env.example`).
   - Add your connection strings and API key:
     ```env
     # Supabase connection (Transaction Pooler - port 6543)
     DATABASE_URL="postgresql://..."

     # Supabase connection (Session Pooler - port 5432 for migrations)
     DIRECT_URL="postgresql://..."

     # Gemini API Key
     GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
     ```

4. **Initialize Database Schema:**
   Push the database schema and generate the client code:
   ```bash
   npx prisma db push
   ```

5. **Seed Sample Data:**
   Populate the database with sample customer accounts, tickets, and internal activity:
   ```bash
   npx prisma db seed
   ```

6. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to open the app.

---

## 🚢 Deployment (Vercel)
This repository is pre-configured and optimized for Vercel:
1. Connect your repository on [Vercel](https://vercel.com).
2. Add `DATABASE_URL`, `DIRECT_URL`, and `GOOGLE_GENERATIVE_AI_API_KEY` under the Environment Variables settings.
3. Vercel automatically invokes the `postinstall` hook (`prisma generate`) and builds the statically optimized routes.

## 📄 License
This project is for demonstration and assessment purposes. All rights reserved.
