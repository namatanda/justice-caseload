import { NextResponse } from 'next/server';
import { getMetrics } from '@/lib/metrics';
import { withMetrics } from '@/lib/api';

async function getMetricsHandler() {
  try {
    const metrics = await getMetrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(getMetricsHandler, '/api/metrics');