import { prisma } from '@/lib/db';
import { BaseRepository } from './base.repository';
import { JudgeRepository } from './interfaces';

/**
 * Judge Repository Implementation
 * 
 * Handles all data access operations for Judge entities.
 */

export class JudgeRepositoryImpl extends BaseRepository<any> implements JudgeRepository {
  constructor() {
    super(prisma.judge);
  }

  async findByName(name: string, tx?: any): Promise<any | null> {
    const client = tx || prisma.judge;
    return await client.findFirst({
      where: {
        fullName: name
      }
    });
  }

  async upsert(data: any, tx?: any): Promise<any> {
    const client = tx || prisma.judge;
    return await client.upsert(data);
  }
}

// Export singleton instance
export const judgeRepository = new JudgeRepositoryImpl();
export default judgeRepository;