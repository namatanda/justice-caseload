import { PrismaTransaction } from '@/lib/db';

/**
 * Repository Interface Definitions
 *
 * These interfaces define the contracts for data access operations,
 * creating explicit boundaries between business logic and data access.
 */

// Base repository interface with common CRUD operations
export interface BaseRepository<T> {
  findById(id: string, tx?: PrismaTransaction): Promise<T | null>;
  findAll(tx?: PrismaTransaction): Promise<T[]>;
  create(data: Partial<T>, tx?: PrismaTransaction): Promise<T>;
  update(id: string, data: Partial<T>, tx?: PrismaTransaction): Promise<T>;
  delete(id: string, tx?: PrismaTransaction): Promise<T>;
}

// Batch repository interface
export interface BatchRepository extends BaseRepository<any> {
  findByChecksum(checksum: string): Promise<any | null>;
  updateStatus(id: string, status: string, tx?: PrismaTransaction): Promise<any>;
  updateWithStats(
    id: string,
    data: {
      status: string;
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
      errorLogs?: any[];
      emptyRowsSkipped?: number;
    },
    tx?: PrismaTransaction
  ): Promise<any>;
  updateWithEmptyRowStats(
    id: string,
    emptyRowsSkipped: number,
    tx?: PrismaTransaction
  ): Promise<any>;
  findHistory(limit: number): Promise<any[]>;
  getImportStatus(batchId: string): Promise<any>;
  getImportHistory(limit?: number): Promise<any[]>;
}

// Case repository interface
export interface CaseRepository {
  findById(id: string, tx?: PrismaTransaction): Promise<any | null>;
  findByCaseNumber(caseNumber: string, courtName: string, tx?: PrismaTransaction): Promise<any | null>;
  create(data: any, tx?: PrismaTransaction): Promise<any>;
  update(id: string, data: any, tx?: PrismaTransaction): Promise<any>;
  upsert(data: any, tx?: PrismaTransaction): Promise<any>;
}

// Case activity repository interface
export interface CaseActivityRepository {
  create(data: any, tx?: PrismaTransaction): Promise<any>;
  findByCaseAndActivity(
    caseId: string,
    activityDate: Date,
    activityType: string,
    primaryJudgeId: string,
    tx?: PrismaTransaction
  ): Promise<any | null>;
}

// Court repository interface
export interface CourtRepository {
  findById(id: string, tx?: PrismaTransaction): Promise<any | null>;
  findByName(name: string, tx?: PrismaTransaction): Promise<any | null>;
  create(data: any, tx?: PrismaTransaction): Promise<any>;
  upsert(data: any, tx?: PrismaTransaction): Promise<any>;
}

// Judge repository interface
export interface JudgeRepository {
  findById(id: string, tx?: PrismaTransaction): Promise<any | null>;
  findByName(name: string, tx?: PrismaTransaction): Promise<any | null>;
  create(data: any, tx?: PrismaTransaction): Promise<any>;
  upsert(data: any, tx?: PrismaTransaction): Promise<any>;
}