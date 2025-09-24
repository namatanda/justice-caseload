import { NextResponse } from 'next/server';
import { getQueueStats, checkRedisConnection } from '@/lib/db/redis';

export async function GET() {
  try {
    // First check if Redis is connected
    const isRedisConnected = await checkRedisConnection();
    
    if (!isRedisConnected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Redis connection unavailable',
          status: 'disconnected'
        },
        { status: 503 }
      );
    }
    
    // Get queue stats
    const stats = await getQueueStats();
    
    return NextResponse.json({
      success: true,
      stats,
      status: 'connected'
    });
  } catch (error) {
    console.error('Failed to get queue stats:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get queue stats',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      },
      { status: 500 }
    );
  }
}