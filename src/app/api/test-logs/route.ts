import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🧪 TEST LOGS: This is a test log message');
  console.log('🧪 TEST LOGS: Current time:', new Date().toISOString());
  console.log('🧪 TEST LOGS: Request URL:', request.url);
  
  return NextResponse.json({
    success: true,
    message: 'Test logs endpoint working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  console.log('🧪 TEST LOGS: POST request received');
  
  try {
    const body = await request.json();
    console.log('🧪 TEST LOGS: Request body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('🧪 TEST LOGS: No JSON body or error parsing:', error);
  }
  
  return NextResponse.json({
    success: true,
    message: 'POST test logs endpoint working'
  });
}