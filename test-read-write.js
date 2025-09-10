const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testReadWrite() {
  try {
    // Create a user with a unique email
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    
    const user = await prisma.user.create({
      data: {
        email: email,
        name: `Test User ${timestamp}`,
        role: 'DATA_ENTRY'
      }
    });
    console.log('Created user with ID:', user.id);
    
    // Immediately query for this user through Prisma
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    console.log('Found user through Prisma:', foundUser ? 'Yes' : 'No');
    
    // Query for this user by email
    const foundUserByEmail = await prisma.user.findUnique({
      where: { email: email }
    });
    console.log('Found user by email through Prisma:', foundUserByEmail ? 'Yes' : 'No');
    
    // Count all users
    const userCount = await prisma.user.count();
    console.log('Total user count through Prisma:', userCount);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testReadWrite();