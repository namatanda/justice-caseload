/**
 * Comprehensive Tests for Authentication System
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Mock database
vi.mock('../../../src/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import {
  authenticateUser,
  requireAuth,
  withAuth,
  withAdminAuth,
  withDataEntryAuth,
  withOptionalAuth,
  SessionManager,
  rateLimit,
  rateLimitConfigs,
} from '../../../src/lib/auth';
import { prisma } from '../../../src/lib/db';

const mockPrisma = prisma as any;

// Mock logger
vi.mock('../../../src/lib/logger', () => {
  const mockLogger = {
    api: {
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
    },
  };
  return {
    logger: mockLogger,
    default: mockLogger,
  };
});

describe('User Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid session token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Create a session first
      const sessionToken = await SessionManager.createSession('user-123');
      
      const user = await authenticateUser(sessionToken);
      
      expect(user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
      });
    });

    it('should return null for invalid session token', async () => {
      const user = await authenticateUser('invalid-session-token');
      expect(user).toBeNull();
    });

    it('should authenticate user with development token in non-production', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const user = await authenticateUser('user:user-123');
      
      expect(user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
      });
      
      vi.unstubAllEnvs();
    });

    it('should reject development token in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      
      const user = await authenticateUser('user:user-123');
      
      expect(user).toBeNull();
      
      vi.unstubAllEnvs();
    });

    it('should authenticate with API key in development', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('DEV_API_KEY', 'api_key_test-key');
      
      const user = await authenticateUser('api_key_test-key');
      
      expect(user).toEqual({
        id: 'system-service',
        email: 'system@justice.go.ke',
        name: 'System Service',
        role: 'ADMIN',
      });
      
      vi.unstubAllEnvs();
    });

    it('should return null for inactive user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: false, // Inactive user
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const user = await authenticateUser('user:user-123');
      
      expect(user).toBeNull();
    });
  });

  describe('requireAuth', () => {
    it('should return error response when no token provided', async () => {
      const request = new NextRequest('http://localhost/api/test');
      
      const result = await requireAuth(request);
      
      expect(result).toBeInstanceOf(NextResponse);
      if (result instanceof NextResponse) {
        expect(result.status).toBe(401);
        const data = await result.json();
        expect(data.error).toBe('Authentication required');
        expect(data.code).toBe('AUTH_TOKEN_MISSING');
      }
    });

    it('should return error response for invalid token', async () => {
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: 'Bearer invalid-token' },
      });
      
      const result = await requireAuth(request);
      
      expect(result).toBeInstanceOf(NextResponse);
      if (result instanceof NextResponse) {
        expect(result.status).toBe(401);
        const data = await result.json();
        expect(data.error).toBe('Invalid or expired token');
        expect(data.code).toBe('AUTH_TOKEN_INVALID');
      }
    });

    it('should return user for valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const result = await requireAuth(request);
      
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
      });
    });

    it('should check role-based permissions', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const result = await requireAuth(request, { allowedRoles: ['ADMIN'] });
      
      expect(result).toBeInstanceOf(NextResponse);
      if (result instanceof NextResponse) {
        expect(result.status).toBe(403);
        const data = await result.json();
        expect(data.error).toBe('Insufficient permissions');
        expect(data.code).toBe('INSUFFICIENT_PERMISSIONS');
      }
    });

    it('should accept user with correct role', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const result = await requireAuth(request, { allowedRoles: ['ADMIN'] });
      
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
      });
    });
  });

  describe('Authentication Wrappers', () => {
    it('should call handler with authenticated user in withAuth', async () => {
      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const wrappedHandler = withAuth(mockHandler);
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalledWith(request, mockUser);
    });

    it('should reject non-admin user in withAdminAuth', async () => {
      const mockHandler = vi.fn();
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const wrappedHandler = withAdminAuth(mockHandler);
      const result = await wrappedHandler(request);
      
      expect(mockHandler).not.toHaveBeenCalled();
      expect(result.status).toBe(403);
    });

    it('should accept admin user in withAdminAuth', async () => {
      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );
      
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const wrappedHandler = withAdminAuth(mockHandler);
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalledWith(request, mockUser);
    });

    it('should accept DATA_ENTRY user in withDataEntryAuth', async () => {
      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );
      
      const mockUser = {
        id: 'user-123',
        email: 'entry@example.com',
        name: 'Data Entry User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const request = new NextRequest('http://localhost/api/test', {
        headers: { authorization: `Bearer ${sessionToken}` },
      });
      
      const wrappedHandler = withDataEntryAuth(mockHandler);
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalledWith(request, mockUser);
    });

    it('should proceed with null user in withOptionalAuth when no token', async () => {
      const mockHandler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );
      
      const request = new NextRequest('http://localhost/api/test');
      
      const wrappedHandler = withOptionalAuth(mockHandler);
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalledWith(request, null);
    });
  });
});

describe('Session Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SessionManager', () => {
    it('should create a session', async () => {
      const sessionToken = await SessionManager.createSession('user-123');
      
      expect(sessionToken).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should validate a session', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const sessionToken = await SessionManager.createSession('user-123');
      const user = await SessionManager.validateSession(sessionToken);
      
      expect(user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
      });
    });

    it('should return null for expired session', async () => {
      const sessionToken = 'expired-session-token';
      const user = await SessionManager.validateSession(sessionToken);
      
      expect(user).toBeNull();
    });

    it('should delete a session', async () => {
      const sessionToken = await SessionManager.createSession('user-123');
      
      await SessionManager.deleteSession(sessionToken);
      
      const user = await SessionManager.validateSession(sessionToken);
      expect(user).toBeNull();
    });
  });
});

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow requests within limit', () => {
    const rateLimiter = rateLimit({ windowMs: 60000, maxRequests: 5 });
    
    expect(rateLimiter('user-123')).toBe(true);
    expect(rateLimiter('user-123')).toBe(true);
    expect(rateLimiter('user-123')).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    const rateLimiter = rateLimit({ windowMs: 60000, maxRequests: 2 });
    
    expect(rateLimiter('user-123')).toBe(true);
    expect(rateLimiter('user-123')).toBe(true);
    expect(rateLimiter('user-123')).toBe(false); // Exceeds limit
  });

  it('should reset limit after window expires', () => {
    const rateLimiter = rateLimit({ windowMs: 100, maxRequests: 1 });
    
    expect(rateLimiter('user-123')).toBe(true);
    expect(rateLimiter('user-123')).toBe(false);
    
    // Wait for window to expire
    return new Promise(resolve => {
      setTimeout(() => {
        expect(rateLimiter('user-123')).toBe(true);
        resolve(undefined);
      }, 150);
    });
  });

  it('should handle different identifiers separately', () => {
    const rateLimiter = rateLimit({ windowMs: 60000, maxRequests: 1 });
    
    expect(rateLimiter('user-123')).toBe(true);
    expect(rateLimiter('user-456')).toBe(true); // Different user
    expect(rateLimiter('user-123')).toBe(false); // Same user, exceeds limit
    expect(rateLimiter('user-456')).toBe(false); // Different user, now exceeds limit
  });
});