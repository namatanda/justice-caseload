import { PrismaClient } from '@prisma/client';
import { CaseReturnRowSchema, createDateFromParts } from '../src/lib/validation/schemas';
import { 
  extractAndNormalizeCourt, 
  extractAndNormalizeJudge, 
  extractAndNormalizeCaseType 
} from '../src/lib/data/extraction';
import { getDashboardAnalytics } from '../src/lib/analytics/dashboard';
import { 
  createCase, 
  getCaseById, 
  getCasesPaginated 
} from '../src/lib/operations/case-crud';
import { checkDatabaseConnection, getDatabaseStats } from '../src/lib/database/prisma';

interface ValidationResult {
  step: string;
  success: boolean;
  details?: any;
  error?: string;
}

class ImplementationValidator {
  private prisma: PrismaClient;
  private results: ValidationResult[] = [];

  constructor() {
    this.prisma = new PrismaClient();
  }

  async runValidation(): Promise<{ success: boolean; results: ValidationResult[] }> {
    console.log('🔍 Starting implementation validation...\n');

    try {
      await this.validateDatabaseConnection();
      await this.validateSchema();
      await this.validateDataValidation();
      await this.validateMasterDataExtraction();
      await this.validateCRUDOperations();
      await this.validateAnalytics();
      await this.validateSampleDataProcessing();
      
      const successCount = this.results.filter(r => r.success).length;
      const totalCount = this.results.length;
      
      console.log(`\n📊 Validation Summary: ${successCount}/${totalCount} tests passed`);
      
      return {
        success: successCount === totalCount,
        results: this.results
      };
    } catch (error) {
      console.error('❌ Validation failed:', error);
      return {
        success: false,
        results: this.results
      };
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async validateDatabaseConnection(): Promise<void> {
    console.log('1. Testing database connection...');
    
    try {
      const isConnected = await checkDatabaseConnection();
      this.addResult('Database Connection', isConnected, 
        isConnected ? 'Successfully connected to database' : 'Failed to connect');
    } catch (error) {
      this.addResult('Database Connection', false, undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async validateSchema(): Promise<void> {
    console.log('2. Validating database schema...');
    
    try {
      // Check if all expected tables exist
      const tables = [
        'users', 'courts', 'judges', 'case_types', 'cases', 
        'case_activities', 'case_judge_assignments', 'daily_import_batches'
      ];
      
      for (const table of tables) {
        try {
          await this.prisma.$queryRawUnsafe(`SELECT 1 FROM ${table} LIMIT 1`);
        } catch (error) {
          throw new Error(`Table ${table} does not exist or is not accessible`);
        }
      }
      
      // Check database statistics
      const stats = await getDatabaseStats();
      this.addResult('Database Schema', true, `Tables exist. Database stats: ${JSON.stringify(stats)}`);
    } catch (error) {
      this.addResult('Database Schema', false, undefined, error instanceof Error ? error.message : 'Schema validation failed');
    }
  }

  private async validateDataValidation(): Promise<void> {
    console.log('3. Testing data validation schemas...');
    
    try {
      // Test CSV row validation
      const sampleCsvRow = {
        date_dd: 15,
        date_mon: 'Mar',
        date_yyyy: 2024,
        caseid_type: 'HCCC',
        caseid_no: 'E001',
        filed_dd: 15,
        filed_mon: 'Mar',
        filed_yyyy: 2024,
        court: 'High Court of Kenya',
        case_type: 'Civil Suit',
        judge_1: 'Hon. Justice Test Judge',
        comingfor: 'Certificate of urgency',
        outcome: 'Certified Urgent',
        male_applicant: 1,
        female_applicant: 0,
        organization_applicant: 0,
        male_defendant: 0,
        female_defendant: 1,
        organization_defendant: 0,
        legalrep: 'Yes' as const,
        applicant_witness: 0,
        defendant_witness: 0,
        custody: 0,
        other_details: '',
      };
      
      const validationResult = CaseReturnRowSchema.safeParse(sampleCsvRow);
      
      if (!validationResult.success) {
        throw new Error(`CSV validation failed: ${validationResult.error.message}`);
      }
      
      // Test date creation
      const testDate = createDateFromParts(15, 'Mar', 2024);
      if (!(testDate instanceof Date)) {
        throw new Error('Date creation failed');
      }
      
      this.addResult('Data Validation', true, 'CSV schema validation and date creation working');
    } catch (error) {
      this.addResult('Data Validation', false, undefined, error instanceof Error ? error.message : 'Validation failed');
    }
  }

  private async validateMasterDataExtraction(): Promise<void> {
    console.log('4. Testing master data extraction...');
    
    try {
      await this.prisma.$transaction(async (tx) => {
        // Test court extraction
        const courtResult = await extractAndNormalizeCourt('Test Validation Court', 'TVC', tx);
        if (!courtResult || !courtResult.courtId) {
          throw new Error('Court extraction failed');
        }
        
        // Test judge extraction
        const judgeResult = await extractAndNormalizeJudge('Hon. Test Validation Judge', tx);
        if (!judgeResult || !judgeResult.judgeId) {
          throw new Error('Judge extraction failed');
        }
        
        // Test case type extraction
        const caseTypeId = await extractAndNormalizeCaseType('Test Validation Case Type', tx);
        if (!caseTypeId) {
          throw new Error('Case type extraction failed');
        }
        
        // Rollback transaction to avoid polluting database
        throw new Error('ROLLBACK');
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'ROLLBACK') {
        this.addResult('Master Data Extraction', true, 'Court, judge, and case type extraction working');
      } else {
        this.addResult('Master Data Extraction', false, undefined, error instanceof Error ? error.message : 'Extraction failed');
      }
    }
  }

  private async validateCRUDOperations(): Promise<void> {
    console.log('5. Testing CRUD operations...');
    
    try {
      // Create a test user
      const testUser = await this.prisma.user.create({
        data: {
          email: `validation-${Date.now()}@test.com`,
          name: 'Validation Test User',
          role: 'ADMIN'
        }
      });
      
      // Create a test case type
      const testCaseType = await this.prisma.caseType.create({
        data: {
          caseTypeName: 'Validation Test Type',
          caseTypeCode: `VTT${Date.now()}`,
          description: 'Test case type for validation'
        }
      });
      
      // Test case creation
      const caseData = {
        caseNumber: `VAL-${Date.now()}`,
        caseTypeId: testCaseType.id,
        filedDate: new Date(),
        parties: {
          applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
          defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
        },
        status: 'ACTIVE' as const,
        hasLegalRepresentation: false,
      };
      
      const createResult = await createCase(caseData, testUser.id);
      if (!createResult.success || !createResult.caseId) {
        throw new Error('Case creation failed');
      }
      
      // Test case retrieval
      const retrievedCase = await getCaseById(createResult.caseId);
      if (!retrievedCase) {
        throw new Error('Case retrieval failed');
      }
      
      // Test paginated retrieval
      const paginatedResult = await getCasesPaginated({ pageSize: 5 });
      if (!paginatedResult.cases || paginatedResult.cases.length === 0) {
        throw new Error('Paginated case retrieval failed');
      }
      
      // Cleanup
      await this.prisma.case.delete({ where: { id: createResult.caseId } });
      await this.prisma.caseType.delete({ where: { id: testCaseType.id } });
      await this.prisma.user.delete({ where: { id: testUser.id } });
      
      this.addResult('CRUD Operations', true, 'Case creation, retrieval, and pagination working');
    } catch (error) {
      this.addResult('CRUD Operations', false, undefined, error instanceof Error ? error.message : 'CRUD operations failed');
    }
  }

  private async validateAnalytics(): Promise<void> {
    console.log('6. Testing analytics functions...');
    
    try {
      const analytics = await getDashboardAnalytics();
      
      if (typeof analytics.totalCases !== 'number' || 
          typeof analytics.clearanceRate !== 'number' ||
          !Array.isArray(analytics.casesByType)) {
        throw new Error('Analytics data structure is invalid');
      }
      
      this.addResult('Analytics', true, `Analytics working. Total cases: ${analytics.totalCases}`);
    } catch (error) {
      this.addResult('Analytics', false, undefined, error instanceof Error ? error.message : 'Analytics failed');
    }
  }

  private async validateSampleDataProcessing(): Promise<void> {
    console.log('7. Testing sample data processing...');
    
    try {
      // Check if we have sample data
      const caseCount = await this.prisma.case.count();
      const activityCount = await this.prisma.caseActivity.count();
      const judgeCount = await this.prisma.judge.count();
      const courtCount = await this.prisma.court.count();
      
      if (caseCount === 0) {
        this.addResult('Sample Data Processing', true, 'No sample data found (expected for fresh installation)');
      } else {
        // Validate data relationships
        const casesWithActivities = await this.prisma.case.findMany({
          include: {
            activities: true,
            judgeAssignments: true,
            caseType: true
          },
          take: 5
        });
        
        let hasValidRelationships = true;
        for (const caseItem of casesWithActivities) {
          if (!caseItem.caseType) {
            hasValidRelationships = false;
            break;
          }
        }
        
        if (!hasValidRelationships) {
          throw new Error('Sample data relationships are invalid');
        }
        
        this.addResult('Sample Data Processing', true, 
          `Sample data valid. Cases: ${caseCount}, Activities: ${activityCount}, Judges: ${judgeCount}, Courts: ${courtCount}`);
      }
    } catch (error) {
      this.addResult('Sample Data Processing', false, undefined, error instanceof Error ? error.message : 'Sample data validation failed');
    }
  }

  private addResult(step: string, success: boolean, details?: string, error?: string): void {
    const result: ValidationResult = { step, success, details, error };
    this.results.push(result);
    
    const icon = success ? '✅' : '❌';
    console.log(`   ${icon} ${step}: ${success ? 'PASS' : 'FAIL'}`);
    if (details) console.log(`      ${details}`);
    if (error) console.log(`      Error: ${error}`);
  }
}

// CLI interface
async function main() {
  const validator = new ImplementationValidator();
  const result = await validator.runValidation();
  
  if (result.success) {
    console.log('\n🎉 All validation tests passed! The implementation is working correctly.');
    process.exit(0);
  } else {
    console.log('\n❌ Some validation tests failed. Please check the errors above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Validation script failed:', error);
    process.exit(1);
  });
}

export { ImplementationValidator };