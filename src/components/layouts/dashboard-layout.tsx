/**
 * Dashboard Layout Component
 * 
 * Provides the standard layout for dashboard pages with mobile-responsive navigation
 */

'use client';

import React from 'react';
import { MobileHeader } from '@/components/features/dashboard/mobile-header';
import { BottomNavigation } from '@/components/features/dashboard/bottom-navigation';
import { useIsMobile } from '@/lib/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ 
  children, 
  title = "CourtFlow Dashboard",
  description = "Key court performance metrics overview."
}: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-background focus:text-primary z-50"
      >
        Skip to main content
      </a>

      {/* Mobile Header */}
      <MobileHeader onMenuToggle={() => {}} isMenuOpen={false} />

      {/* Main Content */}
      <main 
        id="main-content"
        className="flex-1 pb-16 md:pb-0 pt-14 md:pt-0 focus:outline-none"
        tabIndex={-1}
      >
        <div className="responsive-container py-4">
          {/* Desktop Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary hidden md:block">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1 hidden md:block">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}

export default DashboardLayout;