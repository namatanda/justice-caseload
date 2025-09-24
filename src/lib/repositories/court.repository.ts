import { prisma } from '@/lib/db';
import { BaseRepository } from './base.repository';
import { CourtRepository } from './interfaces';

/**
 * Court Repository Implementation
 * 
 * Handles all data access operations for Court entities.
 */

export class CourtRepositoryImpl extends BaseRepository<any> implements CourtRepository {
  constructor() {
    super(prisma.court);
  }

  async findByName(name: string, tx?: any): Promise<any | null> {
    const client = tx || prisma.court;
    return await client.findFirst({
      where: {
        courtName: name
      }
    });
  }

  async upsert(data: any, tx?: any): Promise<any> {
    const client = tx || prisma.court;
    return await client.upsert(data);
  }
}

// Export singleton instance
export const courtRepository = new CourtRepositoryImpl();
export default courtRepository;