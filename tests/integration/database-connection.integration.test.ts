import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { vi } from 'vitest';
import { prisma } from '../../src/lib/database';
import logger from '../../src/lib/logger';

vi.mock('../../src/lib/logger', () => ({
  default: {
    general: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
    system: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
    import: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
  },
}));
describe('Database Connection Integration Tests', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Ensure test environment
    if (!process.env.DATABASE_URL?.includes('test')) {
      (logger as any).system.warn('Running against non-test database; set DATABASE_URL for isolation');
    }
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Cleanup test user if exists before each test
    if (testUserId) {
      try {
        await prisma.user.delete({ where: { id: testUserId } });
      } catch (error) {
        // Ignore if not found
      }
    }
  });

  it('should connect to the database successfully', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[])[0]).toHaveProperty('test', 1);
    (logger as any).general.info('Basic connection successful', result);
  });

  it('should retrieve database configuration', async () => {
    // This is more of a log, but validate env vars are set
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.DATABASE_URL).toMatch(/^postgresql:\/\//);
    (logger as any).general.info('DATABASE_URL', { url: process.env.DATABASE_URL });
    (logger as any).general.info('NODE_ENV', { env: process.env.NODE_ENV || '<not set>' });
  });

  it('should access main tables and count records', async () => {
    const userCount = await prisma.user.count();
    const courtCount = await prisma.court.count();
    const batchCount = await prisma.dailyImportBatch.count();
    const caseCount = await prisma.case.count();
    const activityCount = await prisma.caseActivity.count();

    expect(userCount).toBeGreaterThan(0);
    expect(courtCount).toBeGreaterThan(0);
    expect(batchCount).toBeGreaterThanOrEqual(0);
    expect(caseCount).toBeGreaterThanOrEqual(0);
    expect(activityCount).toBeGreaterThanOrEqual(0);

    (logger as any).general.info('Users count', { count: userCount });
    (logger as any).general.info('Courts count', { count: courtCount });
    (logger as any).general.info('Import Batches count', { count: batchCount });
    (logger as any).general.info('Cases count', { count: caseCount });
    (logger as any).general.info('Case Activities count', { count: activityCount });
  });

  it('should perform a successful write operation', async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test Connection User',
        role: 'ADMIN',
      },
    });

    expect(testUser).toBeDefined();
    expect(testUser.id).toBeDefined();
    expect(testUser.email).toBe(testEmail);
    expect(testUser.name).toBe('Test Connection User');
    expect(testUser.role).toBe('ADMIN');

    (logger as any).general.info('Created test user', { id: testUser.id });
    testUserId = testUser.id;
  });

  it('should perform a successful read operation', async () => {
    // Create test user first
    const testEmail = `read-test-${Date.now()}@example.com`;
    await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: testEmail,
          name: 'Read Test User',
          role: 'ADMIN',
        },
      });

      const foundUser = await tx.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser!.email).toBe(testEmail);
      expect(foundUser!.id).toBe(createdUser.id);

      return createdUser.id;
    });

    (logger as any).general.info('Found test user', { email: testEmail });
    testUserId = '' as any;
  });

  it('should perform successful cleanup after write', async () => {
    // Create and delete in one test to validate full CRUD
    const testEmail = `cleanup-test-${Date.now()}@example.com`;
    const createdUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Cleanup Test User',
        role: 'ADMIN',
      },
    });

    const beforeDeleteCount = await prisma.user.count();
    expect(beforeDeleteCount).toBeGreaterThan(0);

    await prisma.user.delete({
      where: { id: createdUser.id },
    });

    const afterDeleteCount = await prisma.user.count();
    expect(afterDeleteCount).toBeLessThan(beforeDeleteCount);

    (logger as any).general.info('Deleted test user');
  });

  it('should handle database errors gracefully', async () => {
    // Attempt an invalid operation to test error handling
    try {
      await prisma.user.create({
        data: {
          email: '', // Invalid email
          name: 'Invalid User',
          role: 'ADMIN',
        },
      });
    } catch (error) {
      expect(error).toBeDefined();
      (logger as any).general.error('Expected error on invalid data', error);
    }
  });
});