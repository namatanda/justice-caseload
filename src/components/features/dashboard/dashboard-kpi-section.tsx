/**
 * Dashboard KPI Section Component
 * 
 * Displays key performance indicator cards
 */

'use client';

import React from 'react';
import { Activity, CheckCircle2, FileText, Hourglass, Percent, ArrowUpRight, CalendarClock } from 'lucide-react';
import { KPICard } from '@/components/features/dashboard/kpi-card';

interface DashboardMetrics {
  totalFiled: number;
  totalResolved: number;
  totalPending: number;
  averageResolutionTime: string;
  clearanceRate: string;
  backlogGrowth: string;
  backlogGrowthDescription: string;
}

interface DashboardKPISectionProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

export function DashboardKPISection({ metrics, isLoading }: DashboardKPISectionProps) {
  if (isLoading) {
    return (
      <section 
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Key Performance Indicators"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </section>
    );
  }

  return (
    <section 
      className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Key Performance Indicators"
    >
      <KPICard 
        title="Total Filed Cases" 
        value={metrics.totalFiled.toLocaleString()} 
        icon={<FileText className="h-5 w-5 text-primary" />} 
        description="All cases entered into the system."
        trend={{ value: "+5.2%", isPositive: true }}
      />
      
      <KPICard 
        title="Total Resolved Cases" 
        value={metrics.totalResolved.toLocaleString()} 
        icon={<CheckCircle2 className="h-5 w-5 text-[hsl(var(--chart-2))]" />} 
        description="Cases successfully concluded."
        valueClassName="text-[hsl(var(--chart-2))]"
        trend={{ value: "+3.1%", isPositive: true }}
      />
      
      <KPICard 
        title="Total Pending Cases" 
        value={metrics.totalPending.toLocaleString()} 
        icon={<Hourglass className="h-5 w-5 text-accent" />} 
        description="Cases currently awaiting resolution."
        valueClassName="text-accent"
        trend={{ value: "+1.8%", isPositive: false }}
      />
      
      <KPICard 
        title="Avg. Resolution Time" 
        value={metrics.averageResolutionTime} 
        icon={<Activity className="h-5 w-5 text-[hsl(var(--chart-4))]" />} 
        description="Average time to resolve cases."
        valueClassName="text-[hsl(var(--chart-4))]"
      />
      
      <KPICard
        title="Clearance Rate"
        value={metrics.clearanceRate}
        icon={<Percent className="h-5 w-5 text-green-600" />}
        description="Percentage of filed cases resolved."
        valueClassName="text-green-600"
        trend={{ value: "+2.3%", isPositive: true }}
      />
      
      <KPICard
        title="Backlog Growth"
        value={metrics.backlogGrowth}
        icon={<ArrowUpRight className="h-5 w-5 text-red-500" />}
        description={metrics.backlogGrowthDescription}
        valueClassName="text-red-500"
      />
    </section>
  );
}