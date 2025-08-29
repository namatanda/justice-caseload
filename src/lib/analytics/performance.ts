import { prisma } from '../database';
import { Prisma } from '@prisma/client';

// Performance metrics interfaces
export interface PerformanceMetrics {
  caseResolutionRate: number;
  averageResolutionTime: number;
  caseBacklog: number;
  judgeEfficiency: Array<{
    judgeName: string;
    casesHandled: number;
    averageResolutionTime: number;
    efficiencyScore: number;
  }>;
  courtPerformance: Array<{
    courtName: string;
    throughput: number;
    backlogGrowth: number;
    performanceScore: number;
  }>;
}

export interface TrendAnalysis {
  filingTrends: Array<{
    period: string;
    filings: number;
    growthRate: number;
  }>;
  resolutionTrends: Array<{
    period: string;
    resolutions: number;
    resolutionRate: number;
  }>;
  backlogTrends: Array<{
    period: string;
    backlog: number;
    changeFromPrevious: number;
  }>;
  seasonalPatterns: {
    quarterlyDistribution: Record<string, number>;
    monthlyDistribution: Record<string, number>;
    weeklyDistribution: Record<string, number>;
  };
}

export interface CaseTypeAnalysis {
  caseTypePerformance: Array<{
    caseType: string;
    totalCases: number;
    activePercentage: number;
    averageResolutionTime: number;
    complexityScore: number;
  }>;
  outcomeAnalysis: Array<{
    caseType: string;
    outcomes: Record<string, number>;
    successRate: number;
  }>;
  resourceAllocation: Array<{
    caseType: string;
    judgeHours: number;
    averageHearings: number;
    resourceIntensity: number;
  }>;
}

// Performance metrics calculation
export async function getPerformanceMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<PerformanceMetrics> {
  const whereClause: Prisma.CaseWhereInput = {};
  
  if (startDate || endDate) {
    whereClause.filedDate = {};
    if (startDate) whereClause.filedDate.gte = startDate;
    if (endDate) whereClause.filedDate.lte = endDate;
  }
  
  // Calculate case resolution rate
  const [totalCases, resolvedCases] = await Promise.all([
    prisma.case.count({ where: whereClause }),
    prisma.case.count({ 
      where: { ...whereClause, status: 'RESOLVED' } 
    }),
  ]);
  
  const caseResolutionRate = totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0;
  
  // Calculate average resolution time
  const avgResolutionTime = await prisma.$queryRaw<Array<{ avg_days: number }>>`
    SELECT AVG(case_age_days) as avg_days
    FROM cases 
    WHERE status = 'RESOLVED'
      ${startDate ? Prisma.sql`AND filed_date >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND filed_date <= ${endDate}` : Prisma.empty}
  `;
  
  const averageResolutionTime = avgResolutionTime[0]?.avg_days || 0;
  
  // Calculate current backlog
  const caseBacklog = await prisma.case.count({
    where: { status: { in: ['ACTIVE', 'PENDING'] } }
  });
  
  // Judge efficiency analysis
  const judgeEfficiency = await getJudgeEfficiencyMetrics(startDate, endDate);
  
  // Court performance analysis
  const courtPerformance = await getCourtPerformanceMetrics(startDate, endDate);
  
  return {
    caseResolutionRate: Math.round(caseResolutionRate * 100) / 100,
    averageResolutionTime: Math.round(averageResolutionTime),
    caseBacklog,
    judgeEfficiency,
    courtPerformance,
  };
}

// Judge efficiency metrics
async function getJudgeEfficiencyMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<Array<{
  judgeName: string;
  casesHandled: number;
  averageResolutionTime: number;
  efficiencyScore: number;
}>> {
  const judgeMetrics = await prisma.$queryRaw<Array<{
    judge_name: string;
    cases_handled: number;
    avg_resolution_time: number;
    total_activities: number;
  }>>`
    SELECT 
      j.full_name as judge_name,
      COUNT(DISTINCT ca.case_id) as cases_handled,
      AVG(c.case_age_days) as avg_resolution_time,
      COUNT(ca.id) as total_activities
    FROM case_activities ca
    JOIN judges j ON ca.primary_judge_id = j.id
    JOIN cases c ON ca.case_id = c.id
    WHERE 1=1
      ${startDate ? Prisma.sql`AND ca.activity_date >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND ca.activity_date <= ${endDate}` : Prisma.empty}
    GROUP BY j.id, j.full_name
    HAVING COUNT(ca.id) >= 5
    ORDER BY cases_handled DESC
  `;
  
  return judgeMetrics.map(judge => {
    // Efficiency score based on cases handled and resolution time
    const efficiencyScore = judge.cases_handled / (judge.avg_resolution_time / 30); // Cases per month equivalent
    
    return {
      judgeName: judge.judge_name,
      casesHandled: Number(judge.cases_handled),
      averageResolutionTime: Math.round(Number(judge.avg_resolution_time) || 0),
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
    };
  });
}

// Court performance metrics
async function getCourtPerformanceMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<Array<{
  courtName: string;
  throughput: number;
  backlogGrowth: number;
  performanceScore: number;
}>> {
  const courtMetrics = await prisma.$queryRaw<Array<{
    court_name: string;
    total_cases: number;
    resolved_cases: number;
    current_backlog: number;
  }>>`
    SELECT 
      COALESCE(ct.court_name, 'Unknown Court') as court_name,
      COUNT(c.id) as total_cases,
      COUNT(CASE WHEN c.status = 'RESOLVED' THEN 1 END) as resolved_cases,
      COUNT(CASE WHEN c.status IN ('ACTIVE', 'PENDING') THEN 1 END) as current_backlog
    FROM cases c
    LEFT JOIN courts ct ON c.original_court_id = ct.id
    WHERE 1=1
      ${startDate ? Prisma.sql`AND c.filed_date >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND c.filed_date <= ${endDate}` : Prisma.empty}
    GROUP BY ct.court_name
    ORDER BY total_cases DESC
  `;
  
  return courtMetrics.map(court => {
    const throughput = Number(court.resolved_cases);
    const totalCases = Number(court.total_cases);
    const backlogGrowth = Number(court.current_backlog);
    
    // Performance score based on resolution rate and backlog management
    const resolutionRate = totalCases > 0 ? throughput / totalCases : 0;
    const backlogRatio = totalCases > 0 ? backlogGrowth / totalCases : 0;
    const performanceScore = (resolutionRate * 0.7) + ((1 - backlogRatio) * 0.3);
    
    return {
      courtName: court.court_name,
      throughput,
      backlogGrowth,
      performanceScore: Math.round(performanceScore * 100),
    };
  });
}

// Trend analysis
export async function getTrendAnalysis(
  months: number = 12
): Promise<TrendAnalysis> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  // Filing trends
  const filingTrends = await prisma.$queryRaw<Array<{
    period: string;
    filings: number;
  }>>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', filed_date), 'YYYY-MM') as period,
      COUNT(*) as filings
    FROM cases 
    WHERE filed_date >= ${startDate}
    GROUP BY DATE_TRUNC('month', filed_date)
    ORDER BY period
  `;
  
  // Calculate growth rates
  const filingTrendsWithGrowth = filingTrends.map((trend, index) => {
    const growthRate = index > 0 
      ? ((trend.filings - filingTrends[index - 1].filings) / filingTrends[index - 1].filings) * 100
      : 0;
    
    return {
      period: trend.period,
      filings: Number(trend.filings),
      growthRate: Math.round(growthRate * 100) / 100,
    };
  });
  
  // Resolution trends
  const resolutionTrends = await prisma.$queryRaw<Array<{
    period: string;
    resolutions: number;
    total_cases: number;
  }>>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', filed_date), 'YYYY-MM') as period,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolutions,
      COUNT(*) as total_cases
    FROM cases 
    WHERE filed_date >= ${startDate}
    GROUP BY DATE_TRUNC('month', filed_date)
    ORDER BY period
  `;
  
  const resolutionTrendsWithRate = resolutionTrends.map(trend => ({
    period: trend.period,
    resolutions: Number(trend.resolutions),
    resolutionRate: Number(trend.total_cases) > 0 
      ? Math.round((Number(trend.resolutions) / Number(trend.total_cases)) * 100)
      : 0,
  }));
  
  // Backlog trends (simplified calculation)
  const backlogTrends = filingTrends.map((trend, index) => {
    const resolutions = resolutionTrends[index]?.resolutions || 0;
    const backlogChange = trend.filings - Number(resolutions);
    
    return {
      period: trend.period,
      backlog: Math.max(0, backlogChange), // Simplified backlog calculation
      changeFromPrevious: index > 0 ? backlogChange : 0,
    };
  });
  
  // Seasonal patterns
  const seasonalPatterns = await getSeasonalPatterns();
  
  return {
    filingTrends: filingTrendsWithGrowth,
    resolutionTrends: resolutionTrendsWithRate,
    backlogTrends,
    seasonalPatterns,
  };
}

// Seasonal patterns analysis
async function getSeasonalPatterns(): Promise<{
  quarterlyDistribution: Record<string, number>;
  monthlyDistribution: Record<string, number>;
  weeklyDistribution: Record<string, number>;
}> {
  const [quarterly, monthly, weekly] = await Promise.all([
    // Quarterly distribution
    prisma.$queryRaw<Array<{ quarter: string; count: number }>>`
      SELECT 
        'Q' || EXTRACT(QUARTER FROM filed_date) as quarter,
        COUNT(*) as count
      FROM cases 
      WHERE filed_date >= CURRENT_DATE - INTERVAL '2 years'
      GROUP BY EXTRACT(QUARTER FROM filed_date)
      ORDER BY quarter
    `,
    
    // Monthly distribution
    prisma.$queryRaw<Array<{ month: string; count: number }>>`
      SELECT 
        TO_CHAR(filed_date, 'Month') as month,
        COUNT(*) as count
      FROM cases 
      WHERE filed_date >= CURRENT_DATE - INTERVAL '2 years'
      GROUP BY EXTRACT(MONTH FROM filed_date), TO_CHAR(filed_date, 'Month')
      ORDER BY EXTRACT(MONTH FROM filed_date)
    `,
    
    // Weekly distribution
    prisma.$queryRaw<Array<{ day: string; count: number }>>`
      SELECT 
        TO_CHAR(filed_date, 'Day') as day,
        COUNT(*) as count
      FROM cases 
      WHERE filed_date >= CURRENT_DATE - INTERVAL '1 year'
      GROUP BY EXTRACT(DOW FROM filed_date), TO_CHAR(filed_date, 'Day')
      ORDER BY EXTRACT(DOW FROM filed_date)
    `,
  ]);
  
  return {
    quarterlyDistribution: quarterly.reduce((acc, item) => {
      acc[item.quarter] = Number(item.count);
      return acc;
    }, {} as Record<string, number>),
    
    monthlyDistribution: monthly.reduce((acc, item) => {
      acc[item.month.trim()] = Number(item.count);
      return acc;
    }, {} as Record<string, number>),
    
    weeklyDistribution: weekly.reduce((acc, item) => {
      acc[item.day.trim()] = Number(item.count);
      return acc;
    }, {} as Record<string, number>),
  };
}

// Case type analysis
export async function getCaseTypeAnalysis(): Promise<CaseTypeAnalysis> {
  // Case type performance
  const caseTypePerformance = await prisma.$queryRaw<Array<{
    case_type: string;
    total_cases: number;
    active_cases: number;
    avg_resolution_time: number;
    avg_activities: number;
  }>>`
    SELECT 
      ct.case_type_name as case_type,
      COUNT(c.id) as total_cases,
      COUNT(CASE WHEN c.status = 'ACTIVE' THEN 1 END) as active_cases,
      AVG(CASE WHEN c.status = 'RESOLVED' THEN c.case_age_days END) as avg_resolution_time,
      AVG(c.total_activities) as avg_activities
    FROM cases c
    JOIN case_types ct ON c.case_type_id = ct.id
    GROUP BY ct.id, ct.case_type_name
    ORDER BY total_cases DESC
  `;
  
  const caseTypePerformanceFormatted = caseTypePerformance.map(item => {
    const totalCases = Number(item.total_cases);
    const activeCases = Number(item.active_cases);
    const activePercentage = totalCases > 0 ? (activeCases / totalCases) * 100 : 0;
    
    // Complexity score based on resolution time and activities
    const resolutionTime = Number(item.avg_resolution_time) || 0;
    const avgActivities = Number(item.avg_activities) || 0;
    const complexityScore = (resolutionTime / 30) + (avgActivities / 5); // Normalized score
    
    return {
      caseType: item.case_type,
      totalCases,
      activePercentage: Math.round(activePercentage),
      averageResolutionTime: Math.round(resolutionTime),
      complexityScore: Math.round(complexityScore * 100) / 100,
    };
  });
  
  // Outcome analysis
  const outcomeAnalysis = await getOutcomeAnalysis();
  
  // Resource allocation
  const resourceAllocation = await getResourceAllocation();
  
  return {
    caseTypePerformance: caseTypePerformanceFormatted,
    outcomeAnalysis,
    resourceAllocation,
  };
}

// Outcome analysis by case type
async function getOutcomeAnalysis(): Promise<Array<{
  caseType: string;
  outcomes: Record<string, number>;
  successRate: number;
}>> {
  const outcomeData = await prisma.$queryRaw<Array<{
    case_type: string;
    outcome: string;
    count: number;
  }>>`
    SELECT 
      ct.case_type_name as case_type,
      ca.outcome,
      COUNT(*) as count
    FROM case_activities ca
    JOIN cases c ON ca.case_id = c.id
    JOIN case_types ct ON c.case_type_id = ct.id
    GROUP BY ct.case_type_name, ca.outcome
    ORDER BY case_type, count DESC
  `;
  
  // Group by case type
  const groupedData = outcomeData.reduce((acc, item) => {
    if (!acc[item.case_type]) {
      acc[item.case_type] = [];
    }
    acc[item.case_type].push({
      outcome: item.outcome,
      count: Number(item.count),
    });
    return acc;
  }, {} as Record<string, Array<{ outcome: string; count: number }>>);
  
  // Calculate success rates (simplified)
  return Object.entries(groupedData).map(([caseType, outcomes]) => {
    const totalOutcomes = outcomes.reduce((sum, o) => sum + o.count, 0);
    const successfulOutcomes = outcomes
      .filter(o => o.outcome.toLowerCase().includes('resolved') || o.outcome.toLowerCase().includes('settled'))
      .reduce((sum, o) => sum + o.count, 0);
    
    const successRate = totalOutcomes > 0 ? (successfulOutcomes / totalOutcomes) * 100 : 0;
    
    return {
      caseType,
      outcomes: outcomes.reduce((acc, o) => {
        acc[o.outcome] = o.count;
        return acc;
      }, {} as Record<string, number>),
      successRate: Math.round(successRate),
    };
  });
}

// Resource allocation analysis
async function getResourceAllocation(): Promise<Array<{
  caseType: string;
  judgeHours: number;
  averageHearings: number;
  resourceIntensity: number;
}>> {
  const resourceData = await prisma.$queryRaw<Array<{
    case_type: string;
    total_activities: number;
    unique_cases: number;
    judge_count: number;
  }>>`
    SELECT 
      ct.case_type_name as case_type,
      COUNT(ca.id) as total_activities,
      COUNT(DISTINCT ca.case_id) as unique_cases,
      COUNT(DISTINCT ca.primary_judge_id) as judge_count
    FROM case_activities ca
    JOIN cases c ON ca.case_id = c.id
    JOIN case_types ct ON c.case_type_id = ct.id
    GROUP BY ct.case_type_name
    ORDER BY total_activities DESC
  `;
  
  return resourceData.map(item => {
    const totalActivities = Number(item.total_activities);
    const uniqueCases = Number(item.unique_cases);
    const judgeCount = Number(item.judge_count);
    
    // Estimate judge hours (assuming 2 hours per activity)
    const judgeHours = totalActivities * 2;
    
    // Average hearings per case
    const averageHearings = uniqueCases > 0 ? totalActivities / uniqueCases : 0;
    
    // Resource intensity score
    const resourceIntensity = (judgeHours / 100) + (averageHearings * 10);
    
    return {
      caseType: item.case_type,
      judgeHours,
      averageHearings: Math.round(averageHearings * 100) / 100,
      resourceIntensity: Math.round(resourceIntensity * 100) / 100,
    };
  });
}