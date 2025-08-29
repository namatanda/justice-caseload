// Dashboard Analytics
export {
  getDashboardAnalytics,
  getJudgeWorkload,
  getCourtAnalytics,
  refreshDashboardAnalytics,
  generateReport,
  type DashboardAnalytics,
  type JudgeWorkload,
  type CourtAnalytics
} from './dashboard';

// Performance Analytics
export {
  getPerformanceMetrics,
  getTrendAnalysis,
  getCaseTypeAnalysis,
  type PerformanceMetrics,
  type TrendAnalysis,
  type CaseTypeAnalysis
} from './performance';

// Analytics constants
export const ANALYTICS_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
} as const;

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#6366f1',
  SECONDARY: '#6b7280',
} as const;