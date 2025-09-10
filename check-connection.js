const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConnection() {
  // Check the actual connection details
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    await prisma.$connect();
    console.log('Connected successfully');
    
    // Check what database we're actually connected to
    const result = await prisma.$queryRaw`SELECT current_database(), current_schema();`;
    console.log('Current database and schema:', result);
    
    // Check user count
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // List all tables
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
    console.log('Tables in public schema:', tables.length);
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();