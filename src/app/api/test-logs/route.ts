import { NextRequest, NextResponse } from 'next/server';
import { withDevOnly } from '@/lib/api/debug';

async function testLogsGetHandler(request: NextRequest) {
  console.log('🧪 TEST LOGS: This is a test log message');
  console.log('🧪 TEST LOGS: Current time:', new Date().toISOString());
  console.log('🧪 TEST LOGS: Request URL:', request.url);
  
  return NextResponse.json({
    success: true,
    message: 'Test logs endpoint working (development only)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}

async function testLogsPostHandler(request: NextRequest) {
  console.log('🧪 TEST LOGS: POST request received');
  
  try {
    const body = await request.json();
    console.log('🧪 TEST LOGS: Request body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('🧪 TEST LOGS: No JSON body or error parsing:', error);
  }
  
  return NextResponse.json({
    success: true,
    message: 'POST test logs endpoint working (development only)',
    environment: process.env.NODE_ENV
  });
}

// Secure endpoints with development-only middleware
export const GET = withDevOnly(testLogsGetHandler, 'test-logs-get');
export const POST = withDevOnly(testLogsPostHandler, 'test-logs-post');