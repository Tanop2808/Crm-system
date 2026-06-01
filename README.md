# SupportDesk CRM

A modern, full-stack Customer Support Ticketing CRM System built with Next.js 15, Tailwind CSS, Prisma, and Supabase.

## 🚀 Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma v6
- **Deployment:** Vercel

## ✨ Features
- **Dashboard & Analytics:** Real-time metrics (Total tickets, Resolution Rate, Open vs Closed).
- **Ticket Management:** View all tickets in a sortable, searchable data table.
- **Ticket Detail View:** Update status and priority on the fly.
- **Internal/Public Notes:** Add comments to tickets that are visible either to everyone or just internal agents.
- **Customer Directory:** Auto-aggregated list of all customers who have submitted tickets.
- **Settings & Profile:** Customize your agent profile and workspace preferences.

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- A Supabase Project (for the PostgreSQL database)

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
   - Copy `.env.example` to `.env`
   - Add your Supabase connection strings (Transaction Pooler for `DATABASE_URL` and Session Pooler for `DIRECT_URL`).

4. **Initialize Database:**
   Push the schema to your Supabase database and generate the Prisma Client:
   ```bash
   npx prisma db push
   ```

5. **Seed the Database (Optional):**
   Populate the database with sample tickets and notes:
   ```bash
   npx prisma db seed
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to view the application.

## 🚢 Deployment (Vercel)
This project is optimized for deployment on Vercel. 
1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, add your `DATABASE_URL` and `DIRECT_URL` environment variables.
3. Vercel will automatically run the build command (`next build`) and deploy your application.

## 📄 License
This project is for demonstration and assessment purposes. All rights reserved.
