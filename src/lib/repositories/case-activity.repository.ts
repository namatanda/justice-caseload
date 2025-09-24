import { prisma } from '@/lib/db';
import { BaseRepository } from './base.repository';
import { CaseActivityRepository } from './interfaces';

/**
 * Case Activity Repository Implementation
 * 
 * Handles all data access operations for CaseActivity entities.
 */

export class CaseActivityRepositoryImpl extends BaseRepository<any> implements CaseActivityRepository {
  constructor() {
    super(prisma.caseActivity);
  }

  async findByCaseAndActivity(
    caseId: string,
    activityDate: Date,
    activityType: string,
    primaryJudgeId: string,
    tx?: any
  ): Promise<any | null> {
    const client = tx || prisma.caseActivity;
    return await client.findFirst({
      where: {
        caseId,
        activityDate,
        activityType,
        primaryJudgeId,
      },
    });
  }
}

// Export singleton instance
export const caseActivityRepository = new CaseActivityRepositoryImpl();
export default caseActivityRepository;