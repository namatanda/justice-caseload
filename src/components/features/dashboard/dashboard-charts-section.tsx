/**
 * Dashboard Charts Section Component
 * 
 * Displays data visualization charts
 */

'use client';

import React from 'react';
import { MobileChart } from '@/components/features/dashboard/mobile-chart';

interface ChartData {
  monthlyTrendsData: Array<{ name: string; filed: number; resolved: number; pending: number }>;
  caseAgeDistributionData: Array<{ name: string; value: number }>;
  backlogTrendsData: Array<{ name: string; backlog: number }>;
}

interface DashboardChartsSectionProps {
  chartData: ChartData;
  isLoading?: boolean;
}

// Chart configurations
const chartConfigs = {
  filingsVsResolutions: {
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
  },
  
  caseAgeDistribution: {
    distribution: {
      label: "Case Age Distribution",
      color: "hsl(var(--chart-4))",
    }
  },
  
  backlogTrends: {
    backlog: {
      label: "Backlog Cases",
      color: "hsl(var(--chart-5))",
    }
  },
};

export function DashboardChartsSection({ chartData, isLoading }: DashboardChartsSectionProps) {
  if (isLoading) {
    return (
      <section 
        className="grid grid-cols-1 gap-6 mb-8"
        aria-label="Data Visualizations"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-96 bg-muted animate-pulse rounded-lg" />
        ))}
      </section>
    );
  }

  return (
    <section 
      className="grid grid-cols-1 gap-6 mb-8"
      aria-label="Data Visualizations"
    >
      <MobileChart 
        title="Case Trends: Filings, Resolutions, and Pending"
        description="Comparison of new cases filed, cases resolved, and pending cases per month."
        data={chartData.monthlyTrendsData}
        type="line"
        config={chartConfigs.filingsVsResolutions}
      />
      
      <MobileChart 
        title="Case Age Distribution"
        description="Distribution of cases by age groups."
        data={chartData.caseAgeDistributionData}
        type="pie"
        dataKey="value"
        config={chartConfigs.caseAgeDistribution}
      />
      
      <MobileChart 
        title="Backlog Trends by Court Level"
        description="Backlog cases trends over time."
        data={chartData.backlogTrendsData}
        type="bar"
        config={chartConfigs.backlogTrends}
      />
    </section>
  );
}