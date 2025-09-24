/**
 * Dashboard Store
 * 
 * Zustand store for managing dashboard state and filters
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DashboardFilters {
  timePeriod: '7days' | '30days' | '90days' | '1year' | 'all';
  courtRank: 'all' | 'high' | 'magistrate' | 'chief_magistrate';
  courtName: string | null;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface DashboardMetrics {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  averageResolutionTime: number;
  pendingCases: number;
  overdueCount: number;
  completionRate: number;
}

interface DashboardState {
  filters: DashboardFilters;
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface DashboardActions {
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshData: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialFilters: DashboardFilters = {
  timePeriod: '30days',
  courtRank: 'all',
  courtName: null,
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      filters: initialFilters,
      metrics: null,
      isLoading: false,
      error: null,
      lastUpdated: null,

      // Actions
      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters },
            // Clear metrics when filters change to trigger refetch
            metrics: null,
            lastUpdated: null,
          }),
          false,
          'dashboard/setFilters'
        ),

      resetFilters: () =>
        set(
          {
            filters: initialFilters,
            metrics: null,
            lastUpdated: null,
          },
          false,
          'dashboard/resetFilters'
        ),

      setMetrics: (metrics) =>
        set(
          {
            metrics,
            lastUpdated: new Date(),
            isLoading: false,
            error: null,
          },
          false,
          'dashboard/setMetrics'
        ),

      setLoading: (isLoading) =>
        set({ isLoading }, false, 'dashboard/setLoading'),

      setError: (error) =>
        set({ error, isLoading: false }, false, 'dashboard/setError'),

      clearError: () =>
        set({ error: null }, false, 'dashboard/clearError'),

      refreshData: () => {
        // This will trigger a refetch by clearing current data
        set(
          {
            metrics: null,
            lastUpdated: null,
            error: null,
          },
          false,
          'dashboard/refreshData'
        );
      },
    }),
    { name: 'DashboardStore' }
  )
);

// Selectors for better performance
export const useDashboardFilters = () => useDashboardStore((state) => state.filters);
export const useDashboardMetrics = () => useDashboardStore((state) => state.metrics);
export const useDashboardLoading = () => useDashboardStore((state) => state.isLoading);
export const useDashboardError = () => useDashboardStore((state) => state.error);
export const useDashboardLastUpdated = () => useDashboardStore((state) => state.lastUpdated);

// Computed selectors
export const useHasActiveFilters = () =>
  useDashboardStore((state) => {
    const { filters } = state;
    return (
      filters.timePeriod !== '30days' ||
      filters.courtRank !== 'all' ||
      filters.courtName !== null ||
      filters.dateRange !== undefined
    );
  });

export const useFilterSummary = () =>
  useDashboardStore((state) => {
    const { filters } = state;
    const parts = [];

    if (filters.timePeriod !== '30days') {
      parts.push(`Last ${filters.timePeriod}`);
    }

    if (filters.courtRank !== 'all') {
      parts.push(`${filters.courtRank} courts`);
    }

    if (filters.courtName) {
      parts.push(filters.courtName);
    }

    return parts.length > 0 ? parts.join(', ') : 'All data';
  });