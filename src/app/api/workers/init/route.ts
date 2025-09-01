import { NextResponse } from 'next/server';
import { initializeQueueWorkers, checkRedisConnection } from '@/lib/database/redis';

export async function POST() {
  try {
    console.log('🚀 Initializing queue workers...');

    // Check Redis connection first
    const isRedisConnected = await checkRedisConnection();
    if (!isRedisConnected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Redis connection failed',
          message: 'Cannot initialize queue workers without Redis connection'
        },
        { status: 500 }
      );
    }

    // Initialize queue workers
    await initializeQueueWorkers();

    return NextResponse.json({
      success: true,
      message: 'Queue workers initialized successfully',
      redisConnected: true
    });

  } catch (error) {
    console.error('Failed to initialize queue workers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize queue workers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isRedisConnected = await checkRedisConnection();

    return NextResponse.json({
      success: true,
      redisConnected: isRedisConnected,
      message: isRedisConnected ? 'Redis is connected' : 'Redis is not connected'
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check Redis connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}