# Video Script: SupportDesk CRM Project Walkthrough
**Target Duration:** ~3-5 minutes
**Tone:** Professional, engaging, and tech-focused

This script is structured to show off the application's premium user experience (UX), animations, robust backend integration, and technical implementation.

---

## 🎬 Act I: Introduction & Tech Stack (0:00 - 0:30)

* **Visual Action:** Start on the login page. Slow zoom-in on the glassmorphic card while the background gradient mesh blobs (`bg-primary/10`, `bg-secondary/10`) drift smoothly.
* **Screen Action:** Move the cursor around to demonstrate the subtle hover interactions on inputs and the glowing demo credential card.
* **Estimated Time:** 30 seconds

> **Voiceover (VO):**
> *"Hi everyone! Today, I’m excited to walk you through **SupportDesk CRM**—a modern, high-performance customer support ticketing system built from the ground up to streamline agent workflows and ticket resolution.
> 
> The application is powered by a robust stack: **Next.js** for the frontend and API routing, **Prisma** paired with a relational database for schema management, **Tailwind CSS v4** for cutting-edge styling, and **Framer Motion** for premium, fluid user interactions. Let's dive in!"*

---

## 🎨 Act II: Login Page & Theme Management (0:30 - 1:15)

* **Visual Action:** Show the login validation. Click "Submit" on empty fields to show the Framer Motion shake animation. Then, click the "Demo Credentials" card to trigger the automatic autofill animation and log in.
* **Screen Action:** Once logged in, show the navbar and toggle the theme using the Moon/Sun icon. Show how the entire interface adapts instantly between dark and light modes.
* **Estimated Time:** 45 seconds

> **Voiceover (VO):**
> *"Our journey begins at the login screen. To ensure a premium feel, we’ve integrated animated background mesh gradients and a glassmorphic login card. Watch what happens when I try to submit empty credentials—the card shakes to provide intuitive, immediate feedback. 
> 
> With a single click on our demo credentials box, the fields animate-autofill, and we are logged in. 
> 
> Right in the navigation bar, agents can toggle between light and dark modes. We've custom-configured Tailwind CSS v4’s class-based dark mode system so that all UI elements, layout wrappers, and typography styles dynamically transition in perfect harmony."*

---

## 📝 Act III: Dashboard, Creation Flow & Rich Text Editor (1:15 - 2:15)

* **Visual Action:** Navigate to the Dashboard. Show the clean table listing active tickets with badges for status and priority. 
* **Screen Action:** Click "New Ticket". Fill out the ticket details. Stop at the description block and type out formatted text in the rich text editor (bolding text, creating lists).
* **Estimated Time:** 60 seconds

> **Voiceover (VO):**
> *"Upon entering, agents land on a clean, centralized Dashboard. Here, they can view, sort, and search active tickets. 
> 
> Let's create a new ticket. We click 'New Ticket', fill out the customer name, email, subject, and select a priority level.
> 
> For the description, we’ve implemented a fully-fledged rich text editor powered by Tiptap. We've fine-tuned the CSS overrides for all editor paragraphs, lists, and headings so they inherit the theme's core variables. As you can see, the text contrast is perfectly optimized—remianing bold, dark, and legible in light mode, and automatically rendering in crisp, readable light gray in dark mode."*

---

## 👥 Act IV: Customer Profile & Ticket History (2:15 - 3:00)

* **Visual Action:** Navigate back to the Dashboard or the "Customers" tab. Click on a customer's name (e.g. `alex@example.com`) to open their dedicated profile page.
* **Screen Action:** Highlight the metrics cards (Total Tickets, Open, In Progress, Closed) and scroll down the table showing that specific customer's chronological support history.
* **Estimated Time:** 45 seconds

> **Voiceover (VO):**
> *"Customer context is key to great support. By clicking on a customer’s email anywhere in the app, we are routed to their dedicated Customer Profile.
> 
> This view aggregates database metrics in real-time, displaying their total, active, and resolved tickets. Below the metrics, agents can view a chronological list of every ticket this customer has ever opened. This ensures that agents have complete context on past issues before responding."*

---

## 🔔 Act V: Real-time Notifications & Audit Logs (3:00 - 4:00)

* **Visual Action:** Go to a specific ticket page (`/tickets/[ticketId]`). Point out the notifications bell in the navbar. Add a note or change the ticket status. Show the notification bell updating with a red dot.
* **Screen Action:** Click the bell to show the dropdown list. Next, scroll down the ticket detail page to show the vertical Timeline (Audit Log) tracking the actions.
* **Estimated Time:** 60 seconds

> **Voiceover (VO):**
> *"Now let's look at collaboration and tracking. SupportDesk features a database-backed activity stream. When a ticket is created or updated, a notification is dispatched. The navbar bell dynamically displays an unread count badge, pulling updates silently. Clicking on it opens a dropdown where agents can mark items as read individually or all at once.
> 
> More importantly, every single ticket has an automated Audit Log timeline. If we update the status, escalate the priority, or add a note, the system immediately logs the transaction. 
> 
> The interactive timeline uses color-coded indicators—emerald for creation, indigo for status changes, rose for escalations, and blue or amber badges to separate public comments from internal agent notes."*

---

## 💻 Act VI: Code Architecture & Wrap Up (4:00 - 4:30)

* **Visual Action:** Switch briefly to the code editor. Hover over `prisma/schema.prisma` showing the `Ticket`, `Notification`, and `ActivityLog` models, then show the Next.js dynamic routes folders.
* **Screen Action:** Transition back to the CRM dashboard.
* **Estimated Time:** 30 seconds

> **Voiceover (VO):**
> *"Under the hood, the architecture is designed for scale. Database relations are maintained cleanly using Prisma, and our APIs handle transitions atomically inside database transactions. 
> 
> The entire project compiles cleanly, ensuring standard compliance and fast page loads.
> 
> SupportDesk CRM provides agents with all the speed, clarity, and tracking they need to resolve issues efficiently. Thank you for watching!"*
