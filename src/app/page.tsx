"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Activity, CheckCircle2, FileText, Hourglass, Percent, ArrowUpRight, CalendarClock, X } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { MobileHeader } from '@/components/features/dashboard/mobile-header';
import { BottomNavigation } from '@/components/features/dashboard/bottom-navigation';
import { KPICard } from '@/components/features/dashboard/kpi-card';
import { MobileFilters } from '@/components/features/dashboard/mobile-filters';
import { MobileChart } from '@/components/features/dashboard/mobile-chart';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/lib/hooks/use-mobile';

// Types for dashboard data
interface DashboardData {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  pendingCases: number;
  transferredCases: number;
  clearanceRate: number;
  averageCaseAge: number;
  caseAgeDistribution: Record<string, number>;
  casesByType: Array<{ caseType: string; caseTypeCode: string; count: number }>;
  casesByStatus: Array<{ status: string; count: number; percentage: number }>;
  monthlyTrends: Array<{ month: string; filed: number; resolved: number; backlog: number }>;
  courtWorkload: Array<{ courtName: string; caseCount: number; averageAge: number }>;
  recentActivity: Array<{
    date: Date;
    caseNumber: string;
    activityType: string;
    outcome: string;
    judgeName: string;
  }>;
}

const courtData: { [key: string]: { name: string; value: string }[] } = {
  supreme: [
    { name: "Supreme Court Alpha", value: "supreme-alpha" },
    { name: "Supreme Court Beta", value: "supreme-beta" }
  ],
  high: [
    { name: "High Court of State A", value: "high-a" },
    { name: "High Court of State B", value: "high-b" },
    { name: "High Court of State C", value: "high-c" }
  ],
  district: [
    { name: "District Court - Region 1", value: "district-1" },
    { name: "District Court - Region 2", value: "district-2" }
  ],
};

// Helper function to format dates for API
const formatDateForApi = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0];
};

export default function RedesignedDashboardPage() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("all");
  const [selectedCourtRank, setSelectedCourtRank] = useState<string>("all");
  const [selectedCourtName, setSelectedCourtName] = useState<string>("all");
  const [specificCourts, setSpecificCourts] = useState<{ name: string; value: string }[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard', selectedTimePeriod, selectedCourtRank, selectedCourtName],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add time period filters
      if (selectedTimePeriod !== "all") {
        const now = new Date();
        let startDate: Date;
        
        switch (selectedTimePeriod) {
          case "last30":
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          case "last90":
            startDate = new Date(now.setDate(now.getDate() - 90));
            break;
          case "lastYear":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startDate = new Date(now.setDate(now.getDate() - 30));
        }
        
        params.append('startDate', formatDateForApi(startDate) || '');
        params.append('endDate', formatDateForApi(new Date()) || '');
      }
      
      // Add court filters
      if (selectedCourtRank !== "all") {
        // In a real implementation, you would map court ranks to actual court IDs
        params.append('courtId', selectedCourtRank);
      }
      
      const response = await fetch(`/api/analytics/dashboard?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
      
      return result.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update specific courts when court rank changes
  useEffect(() => {
    if (selectedCourtRank !== "all" && courtData[selectedCourtRank]) {
      setSpecificCourts(courtData[selectedCourtRank]);
    } else {
      setSpecificCourts([]);
    }
    if (selectedCourtRank !== "all") {
        const isValidCourtName = courtData[selectedCourtRank]?.some(court => court.value === selectedCourtName);
        if (!isValidCourtName) {
            setSelectedCourtName("all");
        }
    } else {
         setSelectedCourtName("all");
    }
  }, [selectedCourtRank, selectedCourtName]);

  // Focus management for accessibility
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, []);

  // Calculate derived values from dashboard data
  const totalFiled = dashboardData?.totalCases || 0;
  const totalResolved = dashboardData?.resolvedCases || 0;
  const totalPending = Math.max(0, (dashboardData?.pendingCases || 0));
  const averageResolutionTime = dashboardData?.averageCaseAge ? `${dashboardData.averageCaseAge} days` : 'N/A';
  const clearanceRate = dashboardData?.clearanceRate ? `${dashboardData.clearanceRate.toFixed(1)}%` : 'N/A';
  const backlogGrowth = "+12%";
  const backlogGrowthDescription = "Change in pending cases (MoM).";

  // Prepare chart data
  const monthlyTrendsData = dashboardData?.monthlyTrends?.map(item => ({
    name: item.month,
    filed: item.filed,
    resolved: item.resolved,
    pending: item.backlog,
  })) || [];

  const caseAgeDistributionData = Object.entries(dashboardData?.caseAgeDistribution || {}).map(([key, value]) => ({
    name: key,
    value: value,
  })) || [];

  const backlogTrendsData = dashboardData?.monthlyTrends?.map(item => ({
    name: item.month,
    backlog: item.backlog,
  })) || [];

  // Chart configurations
  const filingsVsResolutionsConfig = {
    filed: {
      label: "Filed Cases",
      color: "hsl(var(--chart-1))",
    },
    resolved: {
      label: "Resolved Cases",
      color: "hsl(var(--chart-2))",
    },
    pending: {
      label: "Pending Cases",
      color: "hsl(var(--chart-3))",
    }
  };

  const caseAgeDistributionConfig = {
    distribution: {
      label: "Case Age Distribution",
      color: "hsl(var(--chart-4))",
    }
  };

  const backlogTrendsConfig = {
    backlog: {
      label: "Backlog Cases",
      color: "hsl(var(--chart-5))",
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary hidden md:block">CourtFlow Dashboard</h1>
            <p className="text-muted-foreground mt-1 hidden md:block">
              Key court performance metrics overview.
            </p>
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

          {/* KPI Cards */}
          <section 
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Key Performance Indicators"
          >
            <KPICard 
              title="Total Filed Cases" 
              value={totalFiled.toLocaleString()} 
              icon={<FileText className="h-5 w-5 text-primary" />} 
              description="All cases entered into the system."
              trend={{ value: "+5.2%", isPositive: true }}
            />
            <KPICard 
              title="Total Resolved Cases" 
              value={totalResolved.toLocaleString()} 
              icon={<CheckCircle2 className="h-5 w-5 text-[hsl(var(--chart-2))]" />} 
              description="Cases successfully concluded."
              valueClassName="text-[hsl(var(--chart-2))]"
              trend={{ value: "+3.1%", isPositive: true }}
            />
            <KPICard 
              title="Total Pending Cases" 
              value={totalPending.toLocaleString()} 
              icon={<Hourglass className="h-5 w-5 text-accent" />} 
              description="Cases currently awaiting resolution."
              valueClassName="text-accent"
              trend={{ value: "+1.8%", isPositive: false }}
            />
            <KPICard 
              title="Avg. Resolution Time" 
              value={averageResolutionTime} 
              icon={<Activity className="h-5 w-5 text-[hsl(var(--chart-4))]" />} 
              description="Average time to resolve cases."
              valueClassName="text-[hsl(var(--chart-4))]"
            />
            <KPICard
                title="Clearance Rate"
                value={clearanceRate}
                icon={<Percent className="h-5 w-5 text-green-600" />}
                description="Percentage of filed cases resolved."
                valueClassName="text-green-600"
                trend={{ value: "+2.3%", isPositive: true }}
            />
             <KPICard
                title="Backlog Growth"
                value={backlogGrowth}
                icon={<ArrowUpRight className="h-5 w-5 text-red-500" />}
                description={backlogGrowthDescription}
                valueClassName="text-red-500"
            />
          </section>

          {/* Charts */}
          <section 
            className="grid grid-cols-1 gap-6 mb-8"
            aria-label="Data Visualizations"
          >
            <MobileChart 
              title="Case Trends: Filings, Resolutions, and Pending"
              description="Comparison of new cases filed, cases resolved, and pending cases per month."
              data={monthlyTrendsData}
              type="line"
              config={filingsVsResolutionsConfig}
            />
            <MobileChart 
              title="Case Age Distribution"
              description="Distribution of cases by age groups."
              data={caseAgeDistributionData}
              type="pie"
              dataKey="value"
              config={caseAgeDistributionConfig}
            />
            <MobileChart 
              title="Backlog Trends by Court Level"
              description="Backlog cases trends over time."
              data={backlogTrendsData}
              type="bar"
              config={backlogTrendsConfig}
            />
          </section>

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