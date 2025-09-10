import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RedesignedDashboardPage from '@/app/page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

// Mock the components that use fetch
vi.mock('@/components/redesigned/mobile-header', () => ({
  MobileHeader: () => <div data-testid="mobile-header">Mobile Header</div>,
}));

vi.mock('@/components/redesigned/bottom-navigation', () => ({
  BottomNavigation: () => <div data-testid="bottom-navigation">Bottom Navigation</div>,
}));

vi.mock('@/components/redesigned/kpi-card', () => ({
  KPICard: ({ title, value }: { title: string; value: string }) => (
    <div data-testid="kpi-card">
      <span data-testid="kpi-title">{title}</span>
      <span data-testid="kpi-value">{value}</span>
    </div>
  ),
}));

vi.mock('@/components/redesigned/mobile-filters', () => ({
  MobileFilters: () => <div data-testid="mobile-filters">Mobile Filters</div>,
}));

vi.mock('@/components/redesigned/mobile-chart', () => ({
  MobileChart: ({ title }: { title: string }) => (
    <div data-testid="mobile-chart">
      <span data-testid="chart-title">{title}</span>
    </div>
  ),
}));

describe('RedesignedDashboardPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  const mockDashboardData = {
    totalCases: 1000,
    activeCases: 800,
    resolvedCases: 600,
    pendingCases: 400,
    transferredCases: 0,
    clearanceRate: 60,
    averageCaseAge: 45,
    caseAgeDistribution: { '0-30': 100, '31-60': 200, '61+': 100 },
    casesByType: [{ caseType: 'Civil', caseTypeCode: 'CV', count: 500 }],
    casesByStatus: [{ status: 'Active', count: 800, percentage: 80 }],
    monthlyTrends: [{ month: 'Jan', filed: 100, resolved: 80, backlog: 20 }],
    courtWorkload: [{ courtName: 'Test Court', caseCount: 100, averageAge: 30 }],
    recentActivity: [],
  };

  beforeEach(() => {
    // Mock fetch API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockDashboardData }),
    } as Response);
  });

  it('renders the main dashboard components', async () => {
    renderWithClient(<RedesignedDashboardPage />);
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });
    
    // Check that the main components are rendered
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-filters')).toBeInTheDocument();
    
    // Check that KPI cards are rendered
    expect(screen.getAllByTestId('kpi-card')).toHaveLength(6);
    
    // Check that charts are rendered
    expect(screen.getAllByTestId('mobile-chart')).toHaveLength(3);
  });

  it('renders KPI card titles correctly', async () => {
    renderWithClient(<RedesignedDashboardPage />);
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Total Filed Cases')).toBeInTheDocument();
    expect(screen.getByText('Total Resolved Cases')).toBeInTheDocument();
    expect(screen.getByText('Total Pending Cases')).toBeInTheDocument();
    expect(screen.getByText('Avg. Resolution Time')).toBeInTheDocument();
    expect(screen.getByText('Clearance Rate')).toBeInTheDocument();
    expect(screen.getByText('Backlog Growth')).toBeInTheDocument();
  });

  it('renders chart titles correctly', async () => {
    renderWithClient(<RedesignedDashboardPage />);
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Case Trends: Filings, Resolutions, and Pending')).toBeInTheDocument();
    expect(screen.getByText('Case Age Distribution')).toBeInTheDocument();
    expect(screen.getByText('Backlog Trends by Court Level')).toBeInTheDocument();
  });
});