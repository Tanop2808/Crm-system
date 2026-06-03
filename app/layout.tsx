import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import AIAssistant from '@/components/ai-assistant';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SupportDesk CRM',
  description: 'Customer Support Ticketing CRM System — manage tickets, track status, and resolve issues faster.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-surface text-on-surface antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <div className="flex-grow">
          {children}
        </div>
        <footer className="w-full bg-surface-container-low border-t border-outline-variant mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 px-6 w-full max-w-7xl mx-auto gap-3">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-on-surface-variant text-sm">SupportDesk CRM</span>
              <span className="text-xs text-on-surface-variant">© 2024 SupportDesk CRM. All rights reserved.</span>
            </div>
            <div className="flex gap-4">
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">API Documentation</a>
            </div>
          </div>
        </footer>
        <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
