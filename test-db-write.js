const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.create({
    data: {
      email: 'test4@example.com',
      name: 'Test User 4',
      role: 'DATA_ENTRY'
    }
  });
  console.log('Created user with ID:', user.id);
  
  // Force disconnect to ensure commit
  await prisma.$disconnect();
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 1000));
}

test().catch(console.error);