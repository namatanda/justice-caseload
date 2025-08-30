import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Sample data for seeding
const sampleCourts = [
  { name: 'Supreme Court of Kenya', code: 'SCK', type: 'SC' as const },
  { name: 'High Court of Kenya', code: 'HCK', type: 'HC' as const },
  { name: 'Milimani Commercial Court', code: 'MCC', type: 'MC' as const },
  { name: 'Kibera Law Courts', code: 'KLC', type: 'MC' as const },
  { name: 'Employment and Labour Relations Court', code: 'ELRC', type: 'ELRC' as const },
  { name: 'Environment and Land Court', code: 'ELC', type: 'ELC' as const },
  { name: 'Court of Appeal', code: 'COA', type: 'COA' as const },
  { name: 'Kadhis Court', code: 'KDC', type: 'KC' as const },
  { name: 'Small Claims Court', code: 'SCC', type: 'SCC' as const },
];

const sampleJudges = [
  { fullName: 'Hon. Justice Mary Kasango', firstName: 'Mary', lastName: 'Kasango' },
  { fullName: 'Hon. Justice David Majanja', firstName: 'David', lastName: 'Majanja' },
  { fullName: 'Hon. Justice Mumbi Ngugi', firstName: 'Mumbi', lastName: 'Ngugi' },
  { fullName: 'Hon. Magistrate John Muthama', firstName: 'John', lastName: 'Muthama' },
  { fullName: 'Hon. Magistrate Grace Nzioka', firstName: 'Grace', lastName: 'Nzioka' },
  { fullName: 'Hon. Justice William Ouko', firstName: 'William', lastName: 'Ouko' },
  { fullName: 'Hon. Justice Weldon Korir', firstName: 'Weldon', lastName: 'Korir' },
];

const sampleCaseTypes = [
  { name: 'Civil Suit', code: 'CIVIL', description: 'General civil litigation matters' },
  { name: 'Civil Appeal', code: 'APPEAL', description: 'Appeals from lower court decisions' },
  { name: 'Judicial Review', code: 'JR', description: 'Administrative law and judicial review' },
  { name: 'Commercial Matters', code: 'COMM', description: 'Commercial and business disputes' },
  { name: 'Employment Dispute', code: 'EMPLOY', description: 'Employment and labor disputes' },
  { name: 'Environmental Case', code: 'ENV', description: 'Environmental protection cases' },
  { name: 'Constitutional Petition', code: 'CONST', description: 'Constitutional law matters' },
];

const sampleUsers = [
  { email: 'admin@justice.go.ke', name: 'System Administrator', role: 'ADMIN' as const },
  { email: 'clerk1@justice.go.ke', name: 'John Clerk', role: 'DATA_ENTRY' as const },
  { email: 'clerk2@justice.go.ke', name: 'Mary Secretary', role: 'DATA_ENTRY' as const },
  { email: 'supervisor@justice.go.ke', name: 'Jane Supervisor', role: 'ADMIN' as const },
  { email: 'viewer@justice.go.ke', name: 'Public Viewer', role: 'VIEWER' as const },
];

// Activity types and outcomes
const activityTypes = [
  'Certificate of urgency',
  'Hearing',
  'Mention',
  'Ruling',
  'Judgment',
  'Application',
  'Settlement conference',
  'Case management conference',
];

const outcomes = [
  'Certified Urgent',
  'Adjourned',
  'Heard and Reserved',
  'Judgment Delivered',
  'Ruling Given',
  'Settled',
  'Withdrawn',
  'Dismissed',
  'Granted',
  'Partly Granted',
];

// Helper function to generate random date within a range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random item from array
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate case number
function generateCaseNumber(caseTypeCode: string, year: number): string {
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `${caseTypeCode}${randomNum}/${year}`;
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clean existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Cleaning existing data...');
    await prisma.caseActivity.deleteMany({});
    await prisma.caseJudgeAssignment.deleteMany({});
    await prisma.case.deleteMany({});
    await prisma.dailyImportBatch.deleteMany({});
    await prisma.judge.deleteMany({});
    await prisma.court.deleteMany({});
    await prisma.caseType.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Seed users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const user of sampleUsers) {
      const createdUser = await prisma.user.create({
        data: user,
      });
      createdUsers.push(createdUser);
    }
    console.log(`   Created ${createdUsers.length} users`);
    
    // Seed courts
    console.log('🏛️  Seeding courts...');
    const createdCourts = [];
    for (const court of sampleCourts) {
      const createdCourt = await prisma.court.create({
        data: {
          courtName: court.name,
          courtCode: court.code,
          courtType: court.type,
        },
      });
      createdCourts.push(createdCourt);
    }
    console.log(`   Created ${createdCourts.length} courts`);
    
    // Seed judges
    console.log('⚖️  Seeding judges...');
    const createdJudges = [];
    for (const judge of sampleJudges) {
      const createdJudge = await prisma.judge.create({
        data: judge,
      });
      createdJudges.push(createdJudge);
    }
    console.log(`   Created ${createdJudges.length} judges`);
    
    // Seed case types
    console.log('📁 Seeding case types...');
    const createdCaseTypes = [];
    for (const caseType of sampleCaseTypes) {
      const createdCaseType = await prisma.caseType.create({
        data: {
          caseTypeName: caseType.name,
          caseTypeCode: caseType.code,
          description: caseType.description,
        },
      });
      createdCaseTypes.push(createdCaseType);
    }
    console.log(`   Created ${createdCaseTypes.length} case types`);
    
    // Create sample import batch
    console.log('📦 Creating sample import batch...');
    const sampleBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'sample_data_seed.csv',
        fileSize: 1024000,
        fileChecksum: 'sample_checksum_' + randomUUID(),
        totalRecords: 0, // Will be updated as we create cases
        successfulRecords: 0,
        failedRecords: 0,
        errorLogs: [],
        status: 'COMPLETED',
        createdBy: createdUsers[0].id, // Admin user
      },
    });
    
    // Seed cases with activities
    console.log('📝 Seeding cases and activities...');
    const numberOfCases = 100; // Adjust as needed
    const createdCases = [];
    let totalActivities = 0;
    
    for (let i = 0; i < numberOfCases; i++) {
      const caseType = randomItem(createdCaseTypes);
      const court = randomItem(createdCourts);
      const filedDate = randomDate(new Date(2023, 0, 1), new Date());
      const caseNumber = generateCaseNumber(caseType.caseTypeCode, filedDate.getFullYear());
      
      // Calculate case age
      const caseAgeDays = Math.floor((Date.now() - filedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Generate party counts
      const parties = {
        applicants: {
          maleCount: Math.floor(Math.random() * 3),
          femaleCount: Math.floor(Math.random() * 3),
          organizationCount: Math.floor(Math.random() * 2),
        },
        defendants: {
          maleCount: Math.floor(Math.random() * 3),
          femaleCount: Math.floor(Math.random() * 3),
          organizationCount: Math.floor(Math.random() * 2),
        },
      };
      
      // Determine case status
      const statuses = ['ACTIVE', 'RESOLVED', 'PENDING'] as const;
      const weights = [0.6, 0.3, 0.1]; // 60% active, 30% resolved, 10% pending
      
      let status: typeof statuses[number] = 'ACTIVE';
      const random = Math.random();
      let cumulativeWeight = 0;
      for (let j = 0; j < statuses.length; j++) {
        cumulativeWeight += weights[j];
        if (random <= cumulativeWeight) {
          status = statuses[j];
          break;
        }
      }
      
      // Create case
      const createdCase = await prisma.case.create({
        data: {
          caseNumber,
          caseTypeId: caseType.id,
          filedDate,
          originalCourtId: Math.random() > 0.7 ? court.id : undefined, // 30% have original court
          parties,
          status,
          caseAgeDays,
          hasLegalRepresentation: Math.random() > 0.3, // 70% have legal rep
        },
      });
      
      createdCases.push(createdCase);
      
      // Assign judges to case
      const primaryJudge = randomItem(createdJudges);
      await prisma.caseJudgeAssignment.create({
        data: {
          caseId: createdCase.id,
          judgeId: primaryJudge.id,
          isPrimary: true,
        },
      });
      
      // Possibly assign additional judges
      if (Math.random() > 0.8) {
        const secondaryJudge = createdJudges.find(j => j.id !== primaryJudge.id);
        if (secondaryJudge) {
          await prisma.caseJudgeAssignment.create({
            data: {
              caseId: createdCase.id,
              judgeId: secondaryJudge.id,
              isPrimary: false,
            },
          });
        }
      }
      
      // Create case activities
      const numActivities = Math.floor(Math.random() * 5) + 1; // 1-5 activities per case
      
      for (let j = 0; j < numActivities; j++) {
        const activityDate = randomDate(filedDate, new Date());
        const activityType = randomItem(activityTypes);
        const outcome = randomItem(outcomes);
        const assignedJudge = randomItem(createdJudges);
        
        await prisma.caseActivity.create({
          data: {
            caseId: createdCase.id,
            activityDate,
            activityType,
            outcome,
            primaryJudgeId: assignedJudge.id,
            hasLegalRepresentation: createdCase.hasLegalRepresentation,
            applicantWitnesses: Math.floor(Math.random() * 5),
            defendantWitnesses: Math.floor(Math.random() * 5),
            custodyStatus: randomItem(['IN_CUSTODY', 'ON_BAIL', 'NOT_APPLICABLE']),
            details: `Sample activity for case ${caseNumber}`,
            importBatchId: sampleBatch.id,
          },
        });
        
        totalActivities++;
      }
      
      // Update case with activity count
      await prisma.case.update({
        where: { id: createdCase.id },
        data: {
          totalActivities: numActivities,
          lastActivityDate: new Date(),
        },
      });
    }
    
    console.log(`   Created ${createdCases.length} cases`);
    console.log(`   Created ${totalActivities} case activities`);
    
    // Update import batch stats
    await prisma.dailyImportBatch.update({
      where: { id: sampleBatch.id },
      data: {
        totalRecords: totalActivities,
        successfulRecords: totalActivities,
        completedAt: new Date(),
      },
    });
    
    // Generate summary statistics
    console.log('📊 Generating summary...');
    const stats = await prisma.case.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    
    console.log('   Case summary:');
    stats.forEach(stat => {
      console.log(`     ${stat.status}: ${stat._count.id} cases`);
    });
    
    const judgeStats = await prisma.caseActivity.groupBy({
      by: ['primaryJudgeId'],
      _count: { id: true },
    });
    
    console.log(`   Judge workload: ${judgeStats.length} judges handling cases`);
    
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  
  if (!force && process.env.NODE_ENV === 'production') {
    console.error('❌ Seeding is not allowed in production. Use --force if you really need to.');
    process.exit(1);
  }
  
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };