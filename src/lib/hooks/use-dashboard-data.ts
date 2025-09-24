/**
 * Dashboard Data Hook
 * 
 * Handles all data fetching logic for the dashboard
 */

'use client';

import { useQuery } from '@tanstack/react-query';

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

interface DashboardFilters {
  selectedTimePeriod: string;
  selectedCourtRank: string;
  selectedCourtName: string;
}

// Helper function to format dates for API
const formatDateForApi = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0];
};

// Build filter parameters for API request
function buildFilterParams(filters: DashboardFilters): URLSearchParams {
  const params = new URLSearchParams();
  
  // Add time period filters
  if (filters.selectedTimePeriod !== "all") {
    const now = new Date();
    let startDate: Date;
    
    switch (filters.selectedTimePeriod) {
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
    
    const startDateStr = formatDateForApi(startDate);
    const endDateStr = formatDateForApi(new Date());
    
    if (startDateStr) params.append('startDate', startDateStr);
    if (endDateStr) params.append('endDate', endDateStr);
  }
  
  // Add court filters
  if (filters.selectedCourtRank !== "all") {
    params.append('courtId', filters.selectedCourtRank);
  }
  
  return params;
}

// Custom hook for dashboard data
export function useDashboardData(filters: DashboardFilters) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', filters.selectedTimePeriod, filters.selectedCourtRank, filters.selectedCourtName],
    queryFn: async () => {
      const params = buildFilterParams(filters);
      
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
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Custom hook for dashboard metrics (derived calculations)
export function useDashboardMetrics(data: DashboardData | undefined) {
  if (!data) {
    return {
      totalFiled: 0,
      totalResolved: 0,
      totalPending: 0,
      averageResolutionTime: 'N/A',
      clearanceRate: 'N/A',
      backlogGrowth: 'N/A',
      backlogGrowthDescription: 'Change in pending cases (MoM).',
    };
  }

  const totalFiled = data.totalCases || 0;
  const totalResolved = data.resolvedCases || 0;
  const totalPending = Math.max(0, (data.pendingCases || 0));
  const averageResolutionTime = data.averageCaseAge ? `${data.averageCaseAge} days` : 'N/A';
  const clearanceRate = data.clearanceRate ? `${data.clearanceRate.toFixed(1)}%` : 'N/A';
  const backlogGrowth = "+12%"; // This would come from API in real implementation
  const backlogGrowthDescription = "Change in pending cases (MoM).";

  return {
    totalFiled,
    totalResolved,
    totalPending,
    averageResolutionTime,
    clearanceRate,
    backlogGrowth,
    backlogGrowthDescription,
  };
}

// Custom hook for chart data transformation
export function useChartData(data: DashboardData | undefined) {
  if (!data) {
    return {
      monthlyTrendsData: [],
      caseAgeDistributionData: [],
      backlogTrendsData: [],
    };
  }

  const monthlyTrendsData = data.monthlyTrends?.map(item => ({
    name: item.month,
    filed: item.filed,
    resolved: item.resolved,
    pending: item.backlog,
  })) || [];

  const caseAgeDistributionData = Object.entries(data.caseAgeDistribution || {}).map(([key, value]) => ({
    name: key,
    value: value,
  })) || [];

  const backlogTrendsData = data.monthlyTrends?.map(item => ({
    name: item.month,
    backlog: item.backlog,
  })) || [];

  return {
    monthlyTrendsData,
    caseAgeDistributionData,
    backlogTrendsData,
  };
}

// Export types for use in components
export type { DashboardData, DashboardFilters };