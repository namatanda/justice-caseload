import 'dotenv/config';
import { prisma } from '../src/lib/db/prisma';

async function main() {
  try {
    console.log('🔍 Checking users in database...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });
    
    console.log(`📊 Found ${users.length} users:`, users);
    
    if (users.length === 0) {
      console.log('🚀 Creating a system user...');
      
      const systemUser = await prisma.user.create({
        data: {
          email: 'system@justice.go.ke',
          name: 'System Import User',
          role: 'ADMIN',
          isActive: true,
        }
      });
      
      console.log('✅ System user created:', {
        id: systemUser.id,
        email: systemUser.email,
        role: systemUser.role
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to check/create users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();