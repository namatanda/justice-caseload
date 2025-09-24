import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../db';
import { logger } from '@/lib/logger';

// Simple authentication interface
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Basic user session interface
interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Enhanced authentication with multiple strategies
export async function authenticateUser(token: string): Promise<UserSession | null> {
  try {
    // Try session token first (production approach)
    if (token.startsWith('session_')) {
      return await SessionManager.validateSession(token);
    }
    
    // JWT token validation (if JWT is used)
    if (token.includes('.') && token.split('.').length === 3) {
      return await validateJWTToken(token);
    }
    
    // Development token format: user:{userId} (dev only)
    if (process.env.NODE_ENV !== 'production' && token.startsWith('user:')) {
      const userId = token.substring(5);
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });
      
      if (user && user.isActive) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }
    
    // API Key authentication for service-to-service calls
    if (token.startsWith('api_key_')) {
      return await validateApiKey(token);
    }
    
    return null;
  } catch (error) {
    logger.api.error('Authentication error', { error });
    return null;
  }
}

// JWT token validation (placeholder for real JWT implementation)
async function validateJWTToken(token: string): Promise<UserSession | null> {
  try {
    // In real implementation, use a proper JWT library like 'jsonwebtoken'
    // For now, return null to force other authentication methods
    logger.api.warn('JWT validation not implemented', { tokenPrefix: token.substring(0, 10) });
    return null;
  } catch (error) {
    logger.api.error('JWT validation error', { error });
    return null;
  }
}

// API Key validation for service authentication
async function validateApiKey(apiKey: string): Promise<UserSession | null> {
  try {
    // In production, store API keys in a secure table with associated permissions
    if (process.env.NODE_ENV === 'production') {
      // Check against database of API keys
      // This is a placeholder for real implementation
      logger.api.warn('API key validation not fully implemented');
      return null;
    }
    
    // Development API key
    if (apiKey === process.env.DEV_API_KEY) {
      return {
        id: 'system-service',
        email: 'system@justice.go.ke',
        name: 'System Service',
        role: 'ADMIN',
      };
    }
    
    return null;
  } catch (error) {
    logger.api.error('API key validation error', { error });
    return null;
  }
}

// Enhanced authentication middleware
export async function requireAuth(
  request: NextRequest, 
  options: { 
    allowedRoles?: string[],
    rateLimitConfig?: RateLimitConfig,
    requireSecureHeaders?: boolean 
  } = {}
): Promise<NextResponse | UserSession> {
  try {
    // Check for secure headers in production
    if (options.requireSecureHeaders && process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');
      const userAgent = request.headers.get('user-agent');
      
      if (!origin && !referer) {
        return NextResponse.json(
          { error: 'Missing security headers' },
          { status: 400 }
        );
      }
      
      if (!userAgent || userAgent.length < 10) {
        return NextResponse.json(
          { error: 'Invalid user agent' },
          { status: 400 }
        );
      }
    }
    
    // Extract authentication token
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('session_token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'AUTH_TOKEN_MISSING',
          message: 'Please provide authentication token in Authorization header or session cookie'
        },
        { status: 401 }
      );
    }
    
    // Rate limiting based on token
    if (options.rateLimitConfig) {
      const rateLimiter = rateLimit(options.rateLimitConfig);
      const identifier = `auth_${token.substring(0, 10)}`;
      
      if (!rateLimiter(identifier)) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts'
          },
          { status: 429 }
        );
      }
    }
    
    // Authenticate user
    const user = await authenticateUser(token);
    
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired token',
          code: 'AUTH_TOKEN_INVALID',
          message: 'The provided authentication token is invalid or has expired'
        },
        { status: 401 }
      );
    }
    
    // Check role-based permissions
    if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `This operation requires one of the following roles: ${options.allowedRoles.join(', ')}`
        },
        { status: 403 }
      );
    }
    
    return user;
  } catch (error) {
    logger.api.error('Auth middleware error', { error });
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        code: 'AUTH_SYSTEM_ERROR',
        message: 'An error occurred during authentication'
      },
      { status: 500 }
    );
  }
}

// Role-based authorization
export function requireRole(requiredRoles: string[]) {
  return (user: UserSession): boolean => {
    return requiredRoles.includes(user.role);
  };
}

// Check if user has admin privileges
export function isAdmin(user: UserSession): boolean {
  return user.role === 'ADMIN';
}

// Check if user can perform data entry operations
export function canPerformDataEntry(user: UserSession): boolean {
  return ['ADMIN', 'DATA_ENTRY'].includes(user.role);
}

// Session management utilities (using in-memory store for now)
const sessionStore = new Map<string, {
  userId: string;
  expiresAt: Date;
  lastActivity: Date;
  metadata: any;
}>();

export class SessionManager {
  static async createSession(userId: string): Promise<string> {
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    sessionStore.set(sessionToken, {
      userId,
      expiresAt,
      lastActivity: new Date(),
      metadata: {
        createdAt: new Date().toISOString(),
        userAgent: 'api',
      },
    });
    
    return sessionToken;
  }
  
  static async validateSession(sessionToken: string): Promise<UserSession | null> {
    try {
      const session = sessionStore.get(sessionToken);
      
      if (!session || session.expiresAt < new Date()) {
        if (session) {
          sessionStore.delete(sessionToken);
        }
        return null;
      }
      
      // Update last activity
      session.lastActivity = new Date();
      
      // Get user data from database
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });
      
      if (!user || !user.isActive) {
        sessionStore.delete(sessionToken);
        return null;
      }
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      logger.api.error('Session validation error', { error });
      return null;
    }
  }
  
  static async deleteSession(sessionToken: string): Promise<void> {
    try {
      sessionStore.delete(sessionToken);
    } catch (error) {
      logger.api.error('Session deletion error', { error });
    }
  }
  
  // Cleanup expired sessions (call periodically)
  static cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [token, session] of sessionStore.entries()) {
      if (session.expiresAt < now) {
        sessionStore.delete(token);
      }
    }
  }
}

// Rate limiting utilities
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Clean up old entries
    const keysToDelete: string[] = [];
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => rateLimitStore.delete(key));
    
    const current = rateLimitStore.get(identifier);
    
    if (!current || current.resetTime < now) {
      // First request in window or window expired
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }
    
    if (current.count >= config.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Increment count
    current.count++;
    return true;
  };
}

// Common rate limit configurations
export const rateLimitConfigs = {
  upload: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 uploads per minute
  validation: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 validations per minute
  status: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 status checks per minute
  auth: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 auth attempts per minute
};

// Authentication wrapper for API routes
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, user: UserSession, ...args: T) => Promise<NextResponse> | NextResponse,
  options: {
    allowedRoles?: string[];
    rateLimitConfig?: RateLimitConfig;
    requireSecureHeaders?: boolean;
  } = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await requireAuth(request, options);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }
    
    // Auth successful, call handler with authenticated user
    return handler(request, authResult, ...args);
  };
}

// Admin-only wrapper
export function withAdminAuth<T extends any[]>(
  handler: (request: NextRequest, user: UserSession, ...args: T) => Promise<NextResponse> | NextResponse
) {
  return withAuth(handler, { 
    allowedRoles: ['ADMIN'],
    requireSecureHeaders: true,
    rateLimitConfig: rateLimitConfigs.auth
  });
}

// Data entry wrapper (ADMIN or DATA_ENTRY roles)
export function withDataEntryAuth<T extends any[]>(
  handler: (request: NextRequest, user: UserSession, ...args: T) => Promise<NextResponse> | NextResponse
) {
  return withAuth(handler, { 
    allowedRoles: ['ADMIN', 'DATA_ENTRY'],
    rateLimitConfig: rateLimitConfigs.auth
  });
}

// Optional auth wrapper (proceeds without auth, but provides user if available)
export function withOptionalAuth<T extends any[]>(
  handler: (request: NextRequest, user: UserSession | null, ...args: T) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    let user: UserSession | null = null;
    
    try {
      const authHeader = request.headers.get('authorization');
      const cookieToken = request.cookies.get('session_token')?.value;
      const token = authHeader?.replace('Bearer ', '') || cookieToken;
      
      if (token) {
        user = await authenticateUser(token);
      }
    } catch (error) {
      // Silently fail for optional auth
      logger.api.debug('Optional auth failed', { error: error instanceof Error ? error.message : String(error) });
    }
    
    return handler(request, user, ...args);
  };
}