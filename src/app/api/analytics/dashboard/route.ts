import { NextRequest, NextResponse } from 'next/server';
import { getDashboardAnalytics } from '@/lib/analytics/dashboard';
import { withErrorHandler, DatabaseError } from '@/lib/errors/api-errors';

async function dashboardHandler(request: NextRequest) {
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
    // Transform database errors to our error types
    if (error instanceof Error && error.message.includes('database')) {
      throw new DatabaseError('Failed to fetch analytics data');
    }
    throw error;
  }
}

// Export with error handling wrapper
export const GET = withErrorHandler(dashboardHandler, '/api/analytics/dashboard');