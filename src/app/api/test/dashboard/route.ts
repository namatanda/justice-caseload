import { NextResponse } from 'next/server';
import { getDashboardAnalytics } from '@/lib/analytics/dashboard';

export async function GET() {
  try {
    // Test the dashboard analytics function
    const analytics = await getDashboardAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error testing dashboard analytics:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test dashboard analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}