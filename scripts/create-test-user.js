const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    console.log('✅ Test user created:', testUser.email);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();