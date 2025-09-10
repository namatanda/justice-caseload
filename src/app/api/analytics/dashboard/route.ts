import { NextRequest, NextResponse } from 'next/server';
import { getDashboardAnalytics } from '@/lib/analytics/dashboard';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const caseTypeId = searchParams.get('caseTypeId');
    const courtId = searchParams.get('courtId');
    const status = searchParams.get('status');
    
    // Build filters object
    const filters: any = {};
    
    if (startDate) {
      filters.startDate = new Date(startDate);
    }
    
    if (endDate) {
      filters.endDate = new Date(endDate);
    }
    
    if (caseTypeId) {
      filters.caseTypeId = caseTypeId;
    }
    
    if (courtId) {
      filters.courtId = courtId;
    }
    
    if (status) {
      filters.status = status;
    }
    
    // Fetch dashboard analytics with filters
    const analytics = await getDashboardAnalytics(filters);
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('general', 'Error fetching dashboard analytics:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}