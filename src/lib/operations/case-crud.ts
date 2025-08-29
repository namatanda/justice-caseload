import { Prisma, Case, CaseActivity, CaseStatus } from '@prisma/client';
import { prisma, withTransaction, PrismaTransaction } from '../database';
import { cacheManager } from '../database/redis';
import { 
  CreateCaseSchema, 
  UpdateCaseSchema, 
  UpdateCaseStatusSchema,
  BulkUpdateCasesSchema,
  AnalyticsFiltersSchema,
  PaginationSchema,
  CaseSearchSchema
} from '../validation/schemas';

// Interfaces
export interface PaginatedCases {
  cases: Array<Case & {
    caseType: { caseTypeName: string };
    originalCourt?: { courtName: string } | null;
    activities: Array<{ 
      activityDate: Date; 
      outcome: string; 
      activityType: string;
      primaryJudge: { fullName: string };
    }>;
    judgeAssignments: Array<{
      judge: { fullName: string };
      isPrimary: boolean;
    }>;
  }>;
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface CaseDetails extends Case {
  caseType: { caseTypeName: string; caseTypeCode: string };
  originalCourt?: { courtName: string; courtType: string } | null;
  activities: Array<CaseActivity & {
    primaryJudge: { fullName: string };
  }>;
  judgeAssignments: Array<{
    judge: { fullName: string; firstName: string; lastName: string };
    isPrimary: boolean;
    assignedAt: Date;
  }>;
}

export interface BulkUpdateResult {
  success: boolean;
  updatedCount: number;
  errors: Array<{ caseId: string; error: string }>;
}

// Create Operations
export async function createCase(
  caseData: any,
  userId: string
): Promise<{ success: boolean; caseId?: string; error?: string }> {
  try {
    const validatedData = CreateCaseSchema.parse(caseData);
    
    const newCase = await prisma.case.create({
      data: validatedData,
    });
    
    // Invalidate cache
    await cacheManager.invalidateDashboardCache();
    
    return { success: true, caseId: newCase.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create case',
    };
  }
}

export async function createCaseActivity(
  activityData: any
): Promise<{ success: boolean; activityId?: string; error?: string }> {
  try {
    const newActivity = await withTransaction(async (tx) => {
      // Create the activity
      const activity = await tx.caseActivity.create({
        data: activityData,
      });
      
      // Update case statistics
      await tx.case.update({
        where: { id: activityData.caseId },
        data: {
          lastActivityDate: activityData.activityDate,
          totalActivities: { increment: 1 },
          updatedAt: new Date(),
        },
      });
      
      return activity;
    });
    
    await cacheManager.invalidateDashboardCache();
    
    return { success: true, activityId: newActivity.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create case activity',
    };
  }
}

// Read Operations
export async function getCaseById(caseId: string): Promise<CaseDetails | null> {
  try {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        caseType: {
          select: { caseTypeName: true, caseTypeCode: true },
        },
        originalCourt: {
          select: { courtName: true, courtType: true },
        },
        activities: {
          include: {
            primaryJudge: {
              select: { fullName: true },
            },
          },
          orderBy: { activityDate: 'desc' },
        },
        judgeAssignments: {
          include: {
            judge: {
              select: { fullName: true, firstName: true, lastName: true },
            },
          },
          orderBy: { assignedAt: 'desc' },
        },
      },
    });
    
    return caseRecord as CaseDetails | null;
  } catch (error) {
    console.error('Error fetching case:', error);
    return null;
  }
}

export async function getCasesPaginated({
  filters = {},
  pageSize = 50,
  cursor,
  sortBy = 'filedDate',
  sortOrder = 'desc',
}: {
  filters?: any;
  pageSize?: number;
  cursor?: string;
  sortBy?: 'filedDate' | 'caseNumber' | 'lastActivityDate';
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedCases> {
  try {
    // Validate inputs
    const validatedFilters = AnalyticsFiltersSchema.parse(filters);
    const validatedPagination = PaginationSchema.parse({
      pageSize,
      cursor,
      sortBy,
      sortOrder,
    });
    
    // Build where clause
    const whereClause: Prisma.CaseWhereInput = {};
    
    if (validatedFilters.startDate || validatedFilters.endDate) {
      whereClause.filedDate = {};
      if (validatedFilters.startDate) whereClause.filedDate.gte = validatedFilters.startDate;
      if (validatedFilters.endDate) whereClause.filedDate.lte = validatedFilters.endDate;
    }
    
    if (validatedFilters.status) {
      whereClause.status = validatedFilters.status as CaseStatus;
    }
    
    if (validatedFilters.caseTypeId) {
      whereClause.caseTypeId = validatedFilters.caseTypeId;
    }
    
    if (validatedFilters.courtId) {
      whereClause.originalCourtId = validatedFilters.courtId;
    }
    
    // Add cursor condition
    if (cursor) {
      whereClause.id = {
        [sortOrder === 'desc' ? 'lt' : 'gt']: cursor,
      };
    }
    
    // Execute queries in parallel
    const [cases, totalCount] = await Promise.all([
      prisma.case.findMany({
        where: whereClause,
        include: {
          caseType: {
            select: { caseTypeName: true },
          },
          originalCourt: {
            select: { courtName: true },
          },
          activities: {
            select: {
              activityDate: true,
              outcome: true,
              activityType: true,
              primaryJudge: { select: { fullName: true } },
            },
            orderBy: { activityDate: 'desc' },
            take: 3, // Latest 3 activities
          },
          judgeAssignments: {
            include: {
              judge: { select: { fullName: true } },
            },
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        take: pageSize + 1, // Take one extra to check if there are more
      }),
      
      prisma.case.count({ where: whereClause }),
    ]);
    
    const hasMore = cases.length > pageSize;
    const resultCases = hasMore ? cases.slice(0, pageSize) : cases;
    const nextCursor = hasMore ? resultCases[resultCases.length - 1].id : undefined;
    
    return {
      cases: resultCases as any,
      totalCount,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error('Error fetching paginated cases:', error);
    throw new Error('Failed to fetch cases');
  }
}

export async function searchCases(searchParams: any): Promise<PaginatedCases> {
  try {
    const validatedSearch = CaseSearchSchema.parse(searchParams);
    const { query, filters, pagination } = validatedSearch;
    
    // Build search where clause
    const whereClause: Prisma.CaseWhereInput = {
      OR: [
        { caseNumber: { contains: query, mode: 'insensitive' } },
        { 
          caseType: { 
            caseTypeName: { contains: query, mode: 'insensitive' } 
          } 
        },
        {
          judgeAssignments: {
            some: {
              judge: {
                fullName: { contains: query, mode: 'insensitive' }
              }
            }
          }
        },
        {
          originalCourt: {
            courtName: { contains: query, mode: 'insensitive' }
          }
        }
      ],
    };
    
    // Apply additional filters if provided
    if (filters) {
      if (filters.status) {
        whereClause.status = filters.status as CaseStatus;
      }
      if (filters.caseTypeId) {
        whereClause.caseTypeId = filters.caseTypeId;
      }
      if (filters.startDate || filters.endDate) {
        whereClause.filedDate = {};
        if (filters.startDate) whereClause.filedDate.gte = filters.startDate;
        if (filters.endDate) whereClause.filedDate.lte = filters.endDate;
      }
    }
    
    return getCasesPaginated({
      filters: whereClause,
      pageSize: pagination?.pageSize,
      cursor: pagination?.cursor,
      sortBy: pagination?.sortBy,
      sortOrder: pagination?.sortOrder,
    });
  } catch (error) {
    console.error('Error searching cases:', error);
    throw new Error('Failed to search cases');
  }
}

// Update Operations
export async function updateCase(
  caseId: string,
  updateData: any,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = UpdateCaseSchema.parse({ ...updateData, id: caseId });
    
    await prisma.case.update({
      where: { id: caseId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });
    
    await cacheManager.invalidateDashboardCache();
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update case',
    };
  }
}

export async function updateCaseStatus(
  statusData: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = UpdateCaseStatusSchema.parse(statusData);
    
    await withTransaction(async (tx) => {
      await tx.case.update({
        where: { id: validatedData.caseId },
        data: {
          status: validatedData.status,
          updatedAt: new Date(),
        },
      });
      
      // Log status change if reason provided
      if (validatedData.reason) {
        await tx.caseActivity.create({
          data: {
            caseId: validatedData.caseId,
            activityDate: new Date(),
            activityType: 'Status Change',
            outcome: `Status changed to ${validatedData.status}`,
            details: validatedData.reason,
            primaryJudgeId: '00000000-0000-0000-0000-000000000000', // System user
            hasLegalRepresentation: false,
            custodyStatus: 'NOT_APPLICABLE',
            importBatchId: '00000000-0000-0000-0000-000000000000', // System batch
          },
        });
      }
    });
    
    await cacheManager.invalidateDashboardCache();
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update case status',
    };
  }
}

export async function bulkUpdateCases(
  updateData: any
): Promise<BulkUpdateResult> {
  try {
    const validatedData = BulkUpdateCasesSchema.parse(updateData);
    const { caseIds, updates } = validatedData;
    
    const errors: Array<{ caseId: string; error: string }> = [];
    let updatedCount = 0;
    
    // Process updates in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < caseIds.length; i += batchSize) {
      const batch = caseIds.slice(i, i + batchSize);
      
      try {
        const result = await prisma.case.updateMany({
          where: { id: { in: batch } },
          data: {
            ...updates,
            updatedAt: new Date(),
          },
        });
        
        updatedCount += result.count;
      } catch (error) {
        batch.forEach(caseId => {
          errors.push({
            caseId,
            error: error instanceof Error ? error.message : 'Update failed',
          });
        });
      }
    }
    
    await cacheManager.invalidateDashboardCache();
    
    return {
      success: errors.length === 0,
      updatedCount,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      updatedCount: 0,
      errors: [{
        caseId: 'ALL',
        error: error instanceof Error ? error.message : 'Bulk update failed',
      }],
    };
  }
}

// Delete Operations (Soft Delete)
export async function softDeleteCase(
  caseId: string,
  reason: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await withTransaction(async (tx) => {
      // Mark case as deleted
      await tx.case.update({
        where: { id: caseId },
        data: {
          status: 'DELETED',
          updatedAt: new Date(),
        },
      });
      
      // Log deletion activity
      await tx.caseActivity.create({
        data: {
          caseId,
          activityDate: new Date(),
          activityType: 'Case Deletion',
          outcome: 'Case marked as deleted',
          details: `Deleted by user ${userId}. Reason: ${reason}`,
          primaryJudgeId: '00000000-0000-0000-0000-000000000000', // System user
          hasLegalRepresentation: false,
          custodyStatus: 'NOT_APPLICABLE',
          importBatchId: '00000000-0000-0000-0000-000000000000', // System batch
        },
      });
    });
    
    await cacheManager.invalidateDashboardCache();
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete case',
    };
  }
}

// Utility Operations
export async function getCaseStatistics(): Promise<{
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  pendingCases: number;
  transferredCases: number;
  deletedCases: number;
  averageCaseAge: number;
}> {
  try {
    const [statusCounts, avgAge] = await Promise.all([
      prisma.case.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.case.aggregate({
        _avg: { caseAgeDays: true },
        where: { status: { not: 'DELETED' } },
      }),
    ]);
    
    const stats = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalCases: Object.values(stats).reduce((sum, count) => sum + count, 0),
      activeCases: stats.ACTIVE || 0,
      resolvedCases: stats.RESOLVED || 0,
      pendingCases: stats.PENDING || 0,
      transferredCases: stats.TRANSFERRED || 0,
      deletedCases: stats.DELETED || 0,
      averageCaseAge: Math.round(avgAge._avg.caseAgeDays || 0),
    };
  } catch (error) {
    console.error('Error fetching case statistics:', error);
    throw new Error('Failed to fetch case statistics');
  }
}

export async function getRecentCases(limit: number = 10): Promise<Array<Case & {
  caseType: { caseTypeName: string };
  activities: Array<{ activityDate: Date; outcome: string }>;
}>> {
  try {
    return await prisma.case.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        caseType: {
          select: { caseTypeName: true },
        },
        activities: {
          select: { activityDate: true, outcome: true },
          orderBy: { activityDate: 'desc' },
          take: 1,
        },
      },
    }) as any;
  } catch (error) {
    console.error('Error fetching recent cases:', error);
    throw new Error('Failed to fetch recent cases');
  }
}