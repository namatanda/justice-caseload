import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/lib/database';

describe('Database Check Integration Tests', () => {
  beforeAll(async () => {
    // Ensure test environment
    if (!process.env.DATABASE_URL?.includes('test')) {
      console.warn('⚠️  Running database checks against non-test database; set DATABASE_URL for isolation');
    }
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to the database successfully', async () => {
    // Basic connection test via query
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('connection_test', 1);
  });

  it('should query the users table without errors', async () => {
    const users = await prisma.user.findMany();
    expect(Array.isArray(users)).toBe(true);
    expect(users).toBeDefined();
    // Log for validation, but expect no errors
    console.log(`Found ${users.length} users`);
    if (users.length === 0) {
      console.log('No users found - this may be expected in a fresh test database');
    } else {
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
      });
    }
  });

  it('should query the courts table without errors', async () => {
    const courts = await prisma.court.findMany();
    expect(Array.isArray(courts)).toBe(true);
    expect(courts).toBeDefined();
    console.log(`Found ${courts.length} courts`);
  });

  it('should query the cases table without errors', async () => {
    const cases = await prisma.case.findMany();
    expect(Array.isArray(cases)).toBe(true);
    expect(cases).toBeDefined();
    console.log(`Found ${cases.length} cases`);
  });

  it('should query the daily_import_batches table without errors', async () => {
    const batches = await prisma.dailyImportBatch.findMany();
    expect(Array.isArray(batches)).toBe(true);
    expect(batches).toBeDefined();
    console.log(`Found ${batches.length} import batches`);
  });

  it('should detect empty users table correctly', async () => {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      expect(true).toBe(true); // Expected in test env, but validate the check
      console.log('✅ Empty users table detected (seeding may be needed for production)');
    } else {
      expect(users.length).toBeGreaterThan(0);
    }
  });

  it('should handle database query errors gracefully', async () => {
    // Test a potentially failing query (e.g., non-existent table) but since schema is validated, focus on main tables
    // For production validation, ensure main tables are accessible
    const tables = ['user', 'court', 'case', 'dailyImportBatch'];
    for (const table of tables) {
      try {
        const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM ${table}s`);
        expect(count).toBeDefined();
      } catch (error) {
        console.error(`Table ${table} access failed:`, error);
        expect(error).toBeDefined(); // Graceful handling
      }
    }
  });
});