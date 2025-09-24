import { NextRequest, NextResponse } from 'next/server';
import { httpRequestDuration, httpRequestsTotal } from '../metrics';

// Wrapper function for API routes to collect HTTP metrics
export function withMetrics<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  routeName: string = 'unknown'
) {
  return async (...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const request = args[0] as NextRequest;

    try {
      const response = await handler(...args);
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds

      // Record metrics
      const method = request.method;
      const statusCode = response.status.toString();

      httpRequestDuration
        .labels(method, routeName, statusCode)
        .observe(duration);

      httpRequestsTotal
        .labels(method, routeName, statusCode)
        .inc();

      return response;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;

      // Record error metrics
      const method = request.method;
      const statusCode = '500'; // Default to 500 for errors

      httpRequestDuration
        .labels(method, routeName, statusCode)
        .observe(duration);

      httpRequestsTotal
        .labels(method, routeName, statusCode)
        .inc();

      throw error; // Re-throw the error
    }
  };
}

// Middleware function for Next.js middleware.ts
export async function metricsMiddleware(request: NextRequest) {
  const startTime = Date.now();

  // For middleware, we can't easily capture the response status
  // This is more limited, so the wrapper function above is preferred
  const response = NextResponse.next();

  // We can still record basic request count here
  // But duration and status would need to be handled differently

  return response;
}