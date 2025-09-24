/**
 * Root Layout Component
 * 
 * Provides the base HTML structure and global providers for the entire application
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { WorkerInitializer } from "@/components/features/import/worker-initializer";
import { Providers } from '@/app/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CourtFlow - Performance Dashboard',
  description: 'Dashboard for monitoring key court performance metrics including filed, resolved, and pending cases, and judge workloads.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayoutComponent({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <WorkerInitializer />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayoutComponent;