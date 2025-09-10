const { PrismaClient } = require('@prisma/client');

async function testWithFreshClient() {
  // Create a fresh Prisma client
  const prisma = new PrismaClient();
  
  try {
    // Count users with fresh client
    const userCount = await prisma.user.count();
    console.log('User count with fresh client:', userCount);
    
    // List all users with fresh client
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    console.log('Users with fresh client:', users.length);
    
    // Close the connection
    await prisma.$disconnect();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create another fresh client
    const prisma2 = new PrismaClient();
    
    // Count again
    const userCount2 = await prisma2.user.count();
    console.log('User count with second fresh client:', userCount2);
    
    await prisma2.$disconnect();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testWithFreshClient();