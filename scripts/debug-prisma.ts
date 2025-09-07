import 'dotenv/config';
import { prisma } from '../src/lib/database/prisma';

async function main() {
  try {
    console.log('Testing prisma.user.findFirst()...');
    const user = await prisma.user.findFirst();
    console.log('findFirst result:', user);
  } catch (error) {
    console.error('Prisma operation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
