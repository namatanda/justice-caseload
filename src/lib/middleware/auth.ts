import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../database';
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

// Mock authentication for development - replace with actual auth
export async function authenticateUser(token: string): Promise<UserSession | null> {
  try {
    // For development, use a simple token format: user:{userId}
    if (token.startsWith('user:')) {
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
    
    return null;
  } catch (error) {
    logger.api.error('Authentication error', { error });
    return null;
  }
}

// Authentication middleware
export async function requireAuth(request: NextRequest): Promise<NextResponse | UserSession> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const user = await authenticateUser(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    return user;
  } catch (error) {
    logger.api.error('Auth middleware error', { error });
    return NextResponse.json(
      { error: 'Authentication failed' },
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

// Session management utilities
export class SessionManager {
  static async createSession(userId: string): Promise<string> {
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await prisma.importSession.create({
      data: {
        userId,
        sessionToken,
        status: 'ACTIVE',
        expiresAt,
        metadata: {
          createdAt: new Date().toISOString(),
          userAgent: 'api',
        },
      },
    });
    
    return sessionToken;
  }
  
  static async validateSession(sessionToken: string): Promise<UserSession | null> {
    try {
      const session = await prisma.importSession.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      
      if (!session || !session.expiresAt || session.expiresAt < new Date() || session.status !== 'ACTIVE') {
        return null;
      }
      
      // Update last activity
      await prisma.importSession.update({
        where: { id: session.id },
        data: { lastActivity: new Date() },
      });
      
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      };
    } catch (error) {
      logger.api.error('Session validation error', { error });
      return null;
    }
  }
  
  static async deleteSession(sessionToken: string): Promise<void> {
    try {
      await prisma.importSession.update({
        where: { sessionToken },
        data: { status: 'EXPIRED' },
      });
    } catch (error) {
      logger.api.error('Session deletion error', { error });
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
};