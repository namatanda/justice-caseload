import { prisma } from '@/lib/db';
import { BaseRepository } from './base.repository';
import { CaseRepository } from './interfaces';

/**
 * Case Repository Implementation
 * 
 * Handles all data access operations for Case entities.
 */

export class CaseRepositoryImpl extends BaseRepository<any> implements CaseRepository {
  constructor() {
    super(prisma.case);
  }

  async findByCaseNumber(caseNumber: string, courtName: string, tx?: any): Promise<any | null> {
    const client = tx || prisma.case;
    return await client.findFirst({
      where: {
        caseNumber,
        courtName
      }
    });
  }

  async upsert(data: any, tx?: any): Promise<any> {
    const client = tx || prisma.case;
    return await client.upsert(data);
  }
}

// Export singleton instance
export const caseRepository = new CaseRepositoryImpl();
export default caseRepository;