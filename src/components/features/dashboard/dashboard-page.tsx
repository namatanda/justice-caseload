/**
 * Refactored Dashboard Component
 * 
 * Simplified dashboard with proper separation of concerns
 */

'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileHeader } from '@/components/features/dashboard/mobile-header';
import { BottomNavigation } from '@/components/features/dashboard/bottom-navigation';
import { MobileFilters } from '@/components/features/dashboard/mobile-filters';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { useIsMobile } from '@/lib/hooks/use-mobile';

// Hooks and components
import { useDashboardData, useDashboardMetrics, useChartData } from '@/lib/hooks/use-dashboard-data';
import { useDashboardFilters } from '@/lib/hooks/use-dashboard-filters';
import { DashboardErrorBoundary } from '@/components/features/dashboard/dashboard-error-boundary';
import { DashboardKPISection } from '@/components/features/dashboard/dashboard-kpi-section';
import { DashboardChartsSection } from '@/components/features/dashboard/dashboard-charts-section';

interface DashboardLoadingStateProps {
  message: string;
}

function DashboardLoadingState({ message }: DashboardLoadingStateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">{message}</p>
      </div>
    </div>
  );
}

interface DashboardErrorStateProps {
  error: Error;
  onRetry: () => void;
}

function DashboardErrorState({ error, onRetry }: DashboardErrorStateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-2xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'Failed to load dashboard data'}
        </p>
        <Button onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

interface DashboardContentProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

function DashboardContent({ isMenuOpen, setIsMenuOpen }: DashboardContentProps) {
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Hooks for filters and data
  const {
    filters,
    specificCourts,
    selectedTimePeriod,
    selectedCourtRank,
    selectedCourtName,
    setSelectedTimePeriod,
    setSelectedCourtRank,
    setSelectedCourtName,
    getFilterSummary,
    hasActiveFilters,
  } = useDashboardFilters();
  
  const { 
    data: dashboardData, 
    isLoading, 
    error,
    refetch 
  } = useDashboardData(filters);
  
  const metrics = useDashboardMetrics(dashboardData);
  const chartData = useChartData(dashboardData);

  // Focus management for accessibility
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, []);

  if (isLoading) {
    return <DashboardLoadingState message="Loading dashboard data..." />;
  }

  if (error) {
    return <DashboardErrorState error={error} onRetry={() => refetch()} />;
  }

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
      <MobileHeader 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
        isMenuOpen={isMenuOpen}
      />

      {/* Sidebar for filters on larger screens */}
      <Sheet open={isMenuOpen && isMobile} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b pb-4">
              <SheetTitle>Filters</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 py-4 overflow-y-auto">
              <MobileFilters 
                selectedTimePeriod={selectedTimePeriod}
                setSelectedTimePeriod={setSelectedTimePeriod}
                selectedCourtRank={selectedCourtRank}
                setSelectedCourtRank={setSelectedCourtRank}
                selectedCourtName={selectedCourtName}
                setSelectedCourtName={setSelectedCourtName}
                specificCourts={specificCourts}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main 
        id="main-content"
        ref={mainContentRef}
        className="flex-1 pb-16 md:pb-0 pt-14 md:pt-0 focus:outline-none"
        tabIndex={-1}
      >
        <div className="responsive-container py-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary hidden md:block">
              CourtFlow Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 hidden md:block">
              Key court performance metrics overview.
            </p>
            
            {/* Filter summary */}
            {hasActiveFilters() && (
              <div className="mt-2 text-sm text-muted-foreground">
                Showing data for: {getFilterSummary()}
              </div>
            )}
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden">
            <MobileFilters 
              selectedTimePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
              selectedCourtRank={selectedCourtRank}
              setSelectedCourtRank={setSelectedCourtRank}
              selectedCourtName={selectedCourtName}
              setSelectedCourtName={setSelectedCourtName}
              specificCourts={specificCourts}
            />
          </div>

          {/* Dashboard Content with Error Boundaries */}
          <DashboardErrorBoundary>
            {/* KPI Cards */}
            <DashboardKPISection 
              metrics={metrics}
              isLoading={isLoading}
            />

            {/* Charts */}
            <DashboardChartsSection 
              chartData={chartData}
              isLoading={isLoading}
            />
          </DashboardErrorBoundary>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-muted-foreground pb-4">
            <p>&copy; {new Date().getFullYear()} CourtFlow. All rights reserved.</p>
          </footer>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <DashboardErrorBoundary>
      <DashboardContent 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </DashboardErrorBoundary>
  );
}