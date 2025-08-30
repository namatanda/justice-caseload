import { NextRequest, NextResponse } from 'next/server';
import { getImportHistory } from '@/lib/import/csv-processor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 per page
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate parameters
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Get import history with filters
    const history = await getImportHistory(limit);

    // Apply client-side filtering (in a real app, you'd do this in the database)
    let filteredHistory = history;

    if (status) {
      filteredHistory = filteredHistory.filter(item => item.status === status);
    }

    if (startDate) {
      const start = new Date(startDate);
      filteredHistory = filteredHistory.filter(item =>
        new Date(item.createdAt) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredHistory = filteredHistory.filter(item =>
        new Date(item.createdAt) <= end
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedHistory,
      pagination: {
        page,
        limit,
        total: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / limit),
      },
      filters: {
        status: status || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },
    });

  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}