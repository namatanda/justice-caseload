/**
 * Stores Index
 * 
 * Centralized exports for all Zustand stores
 */

// Auth Store
export {
  useAuthStore,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  type User,
} from './auth-store';

// Dashboard Store
export {
  useDashboardStore,
  useDashboardFilters,
  useDashboardMetrics,
  useDashboardLoading,
  useDashboardError,
  useDashboardLastUpdated,
  useHasActiveFilters,
  useFilterSummary,
  type DashboardFilters,
  type DashboardMetrics,
} from './dashboard-store';

// Import Store
export {
  useImportStore,
  useSelectedFile,
  useUploadState,
  useValidationState,
  useImportBatchState,
  useImportUIState,
  useCanProceedToValidation,
  useCanProceedToImport,
  useHasErrors,
  type ImportFile,
  type ImportValidation,
  type ImportBatch,
} from './import-store';