import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check if there are any courts
    const courtCount = await prisma.court.count();
    console.log(`Total courts: ${courtCount}`);
    
    // Check if there are any cases
    const caseCount = await prisma.case.count();
    console.log(`Total cases: ${caseCount}`);
    
    // Check if there are any case activities
    const activityCount = await prisma.caseActivity.count();
    console.log(`Total activities: ${activityCount}`);
    
    // Get a few sample cases
    const sampleCases = await prisma.case.findMany({
      take: 5,
      include: {
        caseType: true,
        originalCourt: true,
      }
    });
    
    console.log('\nSample cases:');
    sampleCases.forEach(case_ => {
      console.log(`- Case #${case_.caseNumber} (${case_.caseType.caseTypeName}) filed on ${case_.filedDate.toISOString().split('T')[0]} at ${case_.originalCourt?.courtName || 'Unknown Court'}`);
    });
    
    // Get status breakdown
    const statusBreakdown = await prisma.case.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    
    console.log('\nStatus breakdown:');
    statusBreakdown.forEach(item => {
      console.log(`- ${item.status}: ${item._count.id} cases`);
    });
    
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();