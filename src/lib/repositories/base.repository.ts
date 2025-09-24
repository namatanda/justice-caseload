import { PrismaTransaction } from '@/lib/db';

/**
 * Base Repository Implementation
 * 
 * Provides common CRUD operations that can be extended by specific repositories.
 */

export class BaseRepository<T> {
  protected model: any;
  
  constructor(model: any) {
    this.model = model;
  }

  async findById(id: string, tx?: PrismaTransaction): Promise<T | null> {
    const client = tx || this.model;
    return await client.findUnique({
      where: { id }
    });
  }

  async findAll(tx?: PrismaTransaction): Promise<T[]> {
    const client = tx || this.model;
    return await client.findMany();
  }

  async create(data: Partial<T>, tx?: PrismaTransaction): Promise<T> {
    const client = tx || this.model;
    return await client.create({
      data
    });
  }

  async update(id: string, data: Partial<T>, tx?: PrismaTransaction): Promise<T> {
    const client = tx || this.model;
    return await client.update({
      where: { id },
      data
    });
  }

  async delete(id: string, tx?: PrismaTransaction): Promise<T> {
    const client = tx || this.model;
    return await client.delete({
      where: { id }
    });
  }
}