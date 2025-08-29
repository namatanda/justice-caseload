import { Prisma } from '@prisma/client';
import { prisma } from '../database';
import { cacheManager } from '../database/redis';
import { AnalyticsFiltersSchema } from '../validation/schemas';

// Dashboard analytics interfaces
export interface DashboardAnalytics {
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

export interface JudgeWorkload {
  judgeId: string;
  judgeName: string;
  totalActivities: number;
  uniqueCases: number;
  averageActivitiesPerCase: number;
  outcomeBreakdown: Record<string, number>;
  periodStart: Date;
  periodEnd: Date;
  productivity: number; // Activities per day
}

export interface CourtAnalytics {
  courtId: string;
  courtName: string;
  courtType: string;
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  averageCaseAge: number;
  clearanceRate: number;
  caseload: Array<{
    month: string;
    newCases: number;
    resolvedCases: number;
    backlog: number;
  }>;
}

// Main dashboard analytics function
export async function getDashboardAnalytics(
  filters: any = {}
): Promise<DashboardAnalytics> {
  try {
    const validatedFilters = AnalyticsFiltersSchema.parse(filters);
    const cacheKey = `dashboard:${JSON.stringify(validatedFilters)}`;
    
    // Check cache first
    const cached = await cacheManager.getCachedDashboardData(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Build where clause for filtering
    const whereClause: Prisma.CaseWhereInput = {};
    
    if (validatedFilters.startDate || validatedFilters.endDate) {
      whereClause.filedDate = {};
      if (validatedFilters.startDate) whereClause.filedDate.gte = validatedFilters.startDate;
      if (validatedFilters.endDate) whereClause.filedDate.lte = validatedFilters.endDate;
    }
    
    if (validatedFilters.caseTypeId) {
      whereClause.caseTypeId = validatedFilters.caseTypeId;
    }
    
    if (validatedFilters.courtId) {
      whereClause.originalCourtId = validatedFilters.courtId;
    }
    
    if (validatedFilters.status) {
      whereClause.status = validatedFilters.status as any;
    }
    
    // Execute multiple queries in parallel for better performance
    const [
      totalCasesResult,
      casesByStatus,
      caseAgeStats,
      casesByType,
      monthlyTrends,
      courtWorkload,
      recentActivity,
    ] = await Promise.all([
      // Total cases count
      prisma.case.count({ where: whereClause }),
      
      // Cases grouped by status
      prisma.case.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true },
      }),
      
      // Case age statistics
      prisma.case.aggregate({
        where: whereClause,
        _avg: { caseAgeDays: true },
      }),
      
      // Cases by type
      prisma.case.groupBy({
        by: ['caseTypeId'],
        where: whereClause,
        _count: { id: true },
      }),
      
      // Monthly trends (last 12 months)
      getMonthlyTrends(validatedFilters),
      
      // Court workload
      getCourtWorkload(validatedFilters),
      
      // Recent activity
      getRecentActivity(validatedFilters),
    ]);
    
    // Process status counts
    const statusCounts = casesByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>);
    
    const activeCases = statusCounts.ACTIVE || 0;
    const resolvedCases = statusCounts.RESOLVED || 0;
    const pendingCases = statusCounts.PENDING || 0;
    const transferredCases = statusCounts.TRANSFERRED || 0;
    
    // Calculate clearance rate
    const clearanceRate = totalCasesResult > 0 
      ? (resolvedCases / totalCasesResult) * 100 
      : 0;
    
    // Get detailed case age distribution
    const caseAgeDistribution = await getCaseAgeDistribution(whereClause);
    
    // Get case type details
    const caseTypeDetails = await getCaseTypeDetails(casesByType);
    
    // Process status breakdown with percentages
    const casesByStatusWithPercentage = casesByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
      percentage: totalCasesResult > 0 ? (item._count.id / totalCasesResult) * 100 : 0,
    }));
    
    const analytics: DashboardAnalytics = {
      totalCases: totalCasesResult,
      activeCases,
      resolvedCases,
      pendingCases,
      transferredCases,
      clearanceRate: Math.round(clearanceRate * 100) / 100,
      averageCaseAge: Math.round(caseAgeStats._avg.caseAgeDays || 0),
      caseAgeDistribution,
      casesByType: caseTypeDetails,
      casesByStatus: casesByStatusWithPercentage,
      monthlyTrends,
      courtWorkload,
      recentActivity,
    };
    
    // Cache the results for 5 minutes
    await cacheManager.setCachedDashboardData(cacheKey, analytics);
    
    return analytics;
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    throw new Error('Failed to fetch dashboard analytics');
  }
}

// Helper function for case age distribution
async function getCaseAgeDistribution(
  whereClause: Prisma.CaseWhereInput
): Promise<Record<string, number>> {
  const cases = await prisma.case.findMany({
    where: whereClause,
    select: { caseAgeDays: true },
  });
  
  const distribution = {
    '0-30 days': 0,
    '31-90 days': 0,
    '91-180 days': 0,
    '181-365 days': 0,
    '1+ years': 0,
  };
  
  cases.forEach(case_ => {
    const age = case_.caseAgeDays;
    if (age <= 30) distribution['0-30 days']++;
    else if (age <= 90) distribution['31-90 days']++;
    else if (age <= 180) distribution['91-180 days']++;
    else if (age <= 365) distribution['181-365 days']++;
    else distribution['1+ years']++;
  });
  
  return distribution;
}

// Helper function to get case type details
async function getCaseTypeDetails(
  casesByType: Array<{ caseTypeId: string; _count: { id: number } }>
): Promise<Array<{ caseType: string; caseTypeCode: string; count: number }>> {
  if (casesByType.length === 0) return [];
  
  const caseTypeIds = casesByType.map(item => item.caseTypeId);
  const caseTypes = await prisma.caseType.findMany({
    where: { id: { in: caseTypeIds } },
    select: { id: true, caseTypeName: true, caseTypeCode: true },
  });
  
  return casesByType.map(item => {
    const caseType = caseTypes.find(ct => ct.id === item.caseTypeId);
    return {
      caseType: caseType?.caseTypeName || 'Unknown',
      caseTypeCode: caseType?.caseTypeCode || 'UNK',
      count: item._count.id,
    };
  }).sort((a, b) => b.count - a.count);
}

// Monthly trends analysis
async function getMonthlyTrends(filters: any): Promise<Array<{
  month: string;
  filed: number;
  resolved: number;
  backlog: number;
}>> {
  const monthlyData = await prisma.$queryRaw<Array<{
    month: string;
    filed: number;
    resolved: number;
  }>>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', filed_date), 'YYYY-MM') as month,
      COUNT(*) as filed,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved
    FROM cases 
    WHERE filed_date >= CURRENT_DATE - INTERVAL '12 months'
      ${filters.caseTypeId ? Prisma.sql`AND case_type_id = ${filters.caseTypeId}` : Prisma.empty}
      ${filters.courtId ? Prisma.sql`AND original_court_id = ${filters.courtId}` : Prisma.empty}
    GROUP BY DATE_TRUNC('month', filed_date)
    ORDER BY month DESC
    LIMIT 12
  `;
  
  // Calculate running backlog
  let runningBacklog = 0;
  return monthlyData.reverse().map(item => {
    runningBacklog += item.filed - item.resolved;
    return {
      month: item.month,
      filed: item.filed,
      resolved: item.resolved,
      backlog: runningBacklog,
    };
  });
}

// Court workload analysis
async function getCourtWorkload(filters: any): Promise<Array<{
  courtName: string;
  caseCount: number;
  averageAge: number;
}>> {
  const courtData = await prisma.$queryRaw<Array<{
    court_name: string;
    case_count: number;
    average_age: number;
  }>>`
    SELECT 
      c.court_name,
      COUNT(cases.id) as case_count,
      AVG(cases.case_age_days) as average_age
    FROM cases
    LEFT JOIN courts c ON cases.original_court_id = c.id
    WHERE cases.status != 'DELETED'
      ${filters.startDate ? Prisma.sql`AND cases.filed_date >= ${filters.startDate}` : Prisma.empty}
      ${filters.endDate ? Prisma.sql`AND cases.filed_date <= ${filters.endDate}` : Prisma.empty}
    GROUP BY c.court_name
    ORDER BY case_count DESC
    LIMIT 10
  `;
  
  return courtData.map(item => ({
    courtName: item.court_name || 'Unknown Court',
    caseCount: Number(item.case_count),
    averageAge: Math.round(Number(item.average_age) || 0),
  }));
}

// Recent activity
async function getRecentActivity(filters: any): Promise<Array<{
  date: Date;
  caseNumber: string;
  activityType: string;
  outcome: string;
  judgeName: string;
}>> {
  const activities = await prisma.caseActivity.findMany({
    take: 20,
    orderBy: { activityDate: 'desc' },
    include: {
      case: { select: { caseNumber: true } },
      primaryJudge: { select: { fullName: true } },
    },
    where: filters.judgeId ? { primaryJudgeId: filters.judgeId } : {},
  });
  
  return activities.map(activity => ({
    date: activity.activityDate,
    caseNumber: activity.case.caseNumber,
    activityType: activity.activityType,
    outcome: activity.outcome,
    judgeName: activity.primaryJudge.fullName,
  }));
}

// Judge workload analysis
export async function getJudgeWorkload(
  period: 'week' | 'month' | 'quarter' = 'month',
  judgeId?: string
): Promise<JudgeWorkload[]> {
  const periodStart = getPeriodStart(period);
  const periodEnd = new Date();
  const periodDays = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Build where clause
  const whereClause: Prisma.CaseActivityWhereInput = {
    activityDate: {
      gte: periodStart,
      lte: periodEnd,
    },
  };
  
  if (judgeId) {
    whereClause.primaryJudgeId = judgeId;
  }
  
  // Get activities with judge information
  const activities = await prisma.caseActivity.findMany({
    where: whereClause,
    include: {
      primaryJudge: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      activityDate: 'desc',
    },
  });
  
  // Group activities by judge
  const workloadMap = new Map<string, {
    judgeId: string;
    judgeName: string;
    activities: typeof activities;
    uniqueCases: Set<string>;
  }>();
  
  activities.forEach(activity => {
    const judgeId = activity.primaryJudgeId;
    
    if (!workloadMap.has(judgeId)) {
      workloadMap.set(judgeId, {
        judgeId,
        judgeName: activity.primaryJudge.fullName,
        activities: [],
        uniqueCases: new Set(),
      });
    }
    
    const judgeData = workloadMap.get(judgeId)!;
    judgeData.activities.push(activity);
    judgeData.uniqueCases.add(activity.caseId);
  });
  
  // Convert to workload array
  const workloadArray: JudgeWorkload[] = Array.from(workloadMap.values()).map(judgeData => {
    const outcomeBreakdown = judgeData.activities.reduce((acc, activity) => {
      acc[activity.outcome] = (acc[activity.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const uniqueCasesCount = judgeData.uniqueCases.size;
    const totalActivities = judgeData.activities.length;
    
    return {
      judgeId: judgeData.judgeId,
      judgeName: judgeData.judgeName,
      totalActivities,
      uniqueCases: uniqueCasesCount,
      averageActivitiesPerCase: uniqueCasesCount > 0 
        ? Math.round((totalActivities / uniqueCasesCount) * 100) / 100 
        : 0,
      outcomeBreakdown,
      periodStart,
      periodEnd,
      productivity: periodDays > 0 ? Math.round((totalActivities / periodDays) * 100) / 100 : 0,
    };
  });
  
  return workloadArray.sort((a, b) => b.totalActivities - a.totalActivities);
}

// Court analytics
export async function getCourtAnalytics(courtId?: string): Promise<CourtAnalytics[]> {
  const whereClause = courtId ? { originalCourtId: courtId } : {};
  
  const courtsData = await prisma.court.findMany({
    where: courtId ? { id: courtId } : { isActive: true },
    include: {
      cases: {
        where: whereClause,
        select: {
          id: true,
          status: true,
          caseAgeDays: true,
          filedDate: true,
        },
      },
    },
  });
  
  const analytics: CourtAnalytics[] = [];
  
  for (const court of courtsData) {
    const cases = court.cases;
    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status === 'ACTIVE').length;
    const resolvedCases = cases.filter(c => c.status === 'RESOLVED').length;
    const averageCaseAge = cases.length > 0 
      ? Math.round(cases.reduce((sum, c) => sum + c.caseAgeDays, 0) / cases.length)
      : 0;
    const clearanceRate = totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0;
    
    // Get monthly caseload for the court
    const caseload = await getCourtMonthlyCaseload(court.id);
    
    analytics.push({
      courtId: court.id,
      courtName: court.courtName,
      courtType: court.courtType,
      totalCases,
      activeCases,
      resolvedCases,
      averageCaseAge,
      clearanceRate: Math.round(clearanceRate * 100) / 100,
      caseload,
    });
  }
  
  return analytics.sort((a, b) => b.totalCases - a.totalCases);
}

// Helper function to get court monthly caseload
async function getCourtMonthlyCaseload(courtId: string): Promise<Array<{
  month: string;
  newCases: number;
  resolvedCases: number;
  backlog: number;
}>> {
  const monthlyData = await prisma.$queryRaw<Array<{
    month: string;
    new_cases: number;
    resolved_cases: number;
  }>>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', filed_date), 'YYYY-MM') as month,
      COUNT(*) as new_cases,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_cases
    FROM cases 
    WHERE original_court_id = ${courtId}
      AND filed_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', filed_date)
    ORDER BY month DESC
    LIMIT 12
  `;
  
  let runningBacklog = 0;
  return monthlyData.reverse().map(item => {
    runningBacklog += item.new_cases - item.resolved_cases;
    return {
      month: item.month,
      newCases: item.new_cases,
      resolvedCases: item.resolved_cases,
      backlog: runningBacklog,
    };
  });
}

// Cache refresh functions
export async function refreshDashboardAnalytics(): Promise<void> {
  await cacheManager.invalidateDashboardCache();
  
  // Pre-warm cache with default analytics
  await getDashboardAnalytics();
}

// Report generation
export async function generateReport(
  filters: any,
  userId: string
): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    // This would generate a comprehensive report
    // For now, we'll just return the analytics data
    const analytics = await getDashboardAnalytics(filters);
    
    // In a real implementation, you might:
    // 1. Generate a PDF or Excel file
    // 2. Store the report in the database
    // 3. Send an email notification
    
    return {
      success: true,
      reportId: `report_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    };
  }
}

// Helper function to get period start date
function getPeriodStart(period: 'week' | 'month' | 'quarter'): Date {
  const now = new Date();
  const start = new Date(now);
  
  switch (period) {
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
  }
  
  return start;
}