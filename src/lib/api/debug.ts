/**
 * Development-only middleware for debug endpoints
 * 
 * Ensures debug routes are only accessible in development mode
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthenticationError } from '@/lib/errors/api-errors';

export function withDevOnly<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  routeName: string = 'debug'
) {
  return async (...args: T): Promise<NextResponse> => {
    // Block access to debug routes in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Debug endpoints are not available in production',
          code: 'DEBUG_DISABLED'
        }, 
        { status: 404 }
      );
    }

    // In development, require a debug token for security
    const request = args[0] as NextRequest;
    const debugToken = request.headers.get('x-debug-token') || 
                       new URL(request.url).searchParams.get('debug_token');
    
    const expectedToken = process.env.DEBUG_TOKEN || 'dev-debug-token';
    
    if (!debugToken || debugToken !== expectedToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debug token required',
          code: 'DEBUG_TOKEN_MISSING'
        },
        { status: 401 }
      );
    }

    return handler(...args);
  };
}

// Debug endpoint wrapper that adds warning headers
export function withDebugWarnings<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse
) {
  return async (...args: T): Promise<NextResponse> => {
    const response = await handler(...args);
    
    // Add warning headers to debug responses
    response.headers.set('X-Debug-Endpoint', 'true');
    response.headers.set('X-Environment', process.env.NODE_ENV || 'development');
    response.headers.set('X-Warning', 'This is a debug endpoint - not for production use');
    
    return response;
  };
}