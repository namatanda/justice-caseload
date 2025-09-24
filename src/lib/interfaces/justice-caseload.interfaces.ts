/**
 * Separation of Concerns Interfaces
 * 
 * These interfaces define the contracts for the refactored architecture
 * that separates business logic from API routes and implements the repository pattern.
 */

// Service layer interfaces
export interface ServiceLayerInterface {
  // Marker interface for service layer contracts
}

// Repository layer interfaces
export interface RepositoryLayerInterface {
  // Marker interface for repository layer contracts
}

// API layer interfaces
export interface ApiLayerInterface {
  // Marker interface for API layer contracts - should only handle HTTP concerns
}

// Hook interfaces
export interface HookInterface {
  // Marker interface for custom hook contracts
}

/**
 * Import Service Interface
 * Defines the contract for import-related business logic
 */
export interface ImportServiceInterface extends ServiceLayerInterface {
  initiateImport(filePath: string, filename: string, fileSize: number, userId?: string): Promise<any>;
  processImport(jobData: any, options?: any): Promise<void>;
  getImportStatus(batchId: string): Promise<any>;
  getImportHistory(limit?: number): Promise<any[]>;
}

/**
 * Batch Service Interface
 * Defines the contract for batch-related business logic
 */
export interface BatchServiceInterface extends ServiceLayerInterface {
  createBatch(batchData: any): Promise<any>;
  updateBatchStatus(batchId: string, status: string): Promise<void>;
  updateBatchWithStats(batchId: string, stats: any): Promise<void>;
  getBatch(batchId: string): Promise<any | null>;
  getBatchHistory(limit: number): Promise<any[]>;
  getOrCreateSystemUser(): Promise<string>;
}

/**
 * Case Service Interface
 * Defines the contract for case-related business logic
 */
export interface CaseServiceInterface extends ServiceLayerInterface {
  createOrUpdateCase(row: any, tx: any, masterDataTracker?: any): Promise<any>;
  createCaseActivity(row: any, caseId: string, importBatchId: string, tx: any, masterDataTracker?: any): Promise<boolean>;
  findExistingCase(caseNumber: string, courtName: string, tx: any): Promise<any | null>;
}

/**
 * Base Repository Interface
 * Defines the contract for basic CRUD operations
 */
export interface BaseRepositoryInterface<T> extends RepositoryLayerInterface {
  findById(id: string, tx?: any): Promise<T | null>;
  findAll(tx?: any): Promise<T[]>;
  create(data: Partial<T>, tx?: any): Promise<T>;
  update(id: string, data: Partial<T>, tx?: any): Promise<T>;
  delete(id: string, tx?: any): Promise<T>;
}

/**
 * Batch Repository Interface
 * Defines the contract for batch data access operations
 */
export interface BatchRepositoryInterface extends BaseRepositoryInterface<any>, RepositoryLayerInterface {
  findByChecksum(checksum: string): Promise<any | null>;
  updateStatus(id: string, status: string, tx?: any): Promise<any>;
  updateWithStats(id: string, data: any, tx?: any): Promise<any>;
  findHistory(limit: number): Promise<any[]>;
}

/**
 * Case Repository Interface
 * Defines the contract for case data access operations
 */
export interface CaseRepositoryInterface extends BaseRepositoryInterface<any>, RepositoryLayerInterface {
  findByCaseNumber(caseNumber: string, courtName: string, tx?: any): Promise<any | null>;
  upsert(data: any, tx?: any): Promise<any>;
}

/**
 * Case Activity Repository Interface
 * Defines the contract for case activity data access operations
 */
export interface CaseActivityRepositoryInterface extends BaseRepositoryInterface<any>, RepositoryLayerInterface {
  findByCaseAndActivity(
    caseId: string,
    activityDate: Date,
    activityType: string,
    primaryJudgeId: string,
    tx?: any
  ): Promise<any | null>;
}

/**
 * Court Repository Interface
 * Defines the contract for court data access operations
 */
export interface CourtRepositoryInterface extends BaseRepositoryInterface<any>, RepositoryLayerInterface {
  findByName(name: string, tx?: any): Promise<any | null>;
  upsert(data: any, tx?: any): Promise<any>;
}

/**
 * Judge Repository Interface
 * Defines the contract for judge data access operations
 */
export interface JudgeRepositoryInterface extends BaseRepositoryInterface<any>, RepositoryLayerInterface {
  findByName(name: string, tx?: any): Promise<any | null>;
  upsert(data: any, tx?: any): Promise<any>;
}

/**
 * Health Service Interface
 * Defines the contract for health check business logic
 */
export interface HealthServiceInterface extends ServiceLayerInterface {
  runBasicHealthChecks(): Promise<any[]>;
}