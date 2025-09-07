import { Judge, Court, CaseType, User, CourtType, UserRole } from '@prisma/client';
import { prisma } from '../database';
import { logger } from '@/lib/logger';
import { 
  CreateJudgeSchema, 
  CreateCourtSchema, 
  CreateCaseTypeSchema, 
  CreateUserSchema 
} from '../validation/schemas';

// Judge CRUD Operations
export async function createJudge(
  judgeData: any
): Promise<{ success: boolean; judgeId?: string; error?: string }> {
  try {
    const validatedData = CreateJudgeSchema.parse(judgeData);
    
    // Check for duplicate judge
    const existingJudge = await prisma.judge.findFirst({
      where: {
        OR: [
          { fullName: validatedData.fullName },
          {
            AND: [
              { firstName: validatedData.firstName },
              { lastName: validatedData.lastName }
            ]
          }
        ]
      }
    });
    
    if (existingJudge) {
      return {
        success: false,
        error: 'Judge with this name already exists'
      };
    }
    
    const newJudge = await prisma.judge.create({
      data: validatedData
    });
    
    return { success: true, judgeId: newJudge.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create judge'
    };
  }
}

export async function getAllJudges(
  includeInactive: boolean = false
): Promise<Judge[]> {
  return await prisma.judge.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { fullName: 'asc' }
  });
}

export async function getJudgeById(judgeId: string): Promise<Judge | null> {
  return await prisma.judge.findUnique({
    where: { id: judgeId }
  });
}

export async function updateJudge(
  judgeId: string,
  updateData: Partial<Judge>
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.judge.update({
      where: { id: judgeId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update judge'
    };
  }
}

export async function deactivateJudge(
  judgeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.judge.update({
      where: { id: judgeId },
      data: { isActive: false, updatedAt: new Date() }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deactivate judge'
    };
  }
}

// Court CRUD Operations
export async function createCourt(
  courtData: any
): Promise<{ success: boolean; courtId?: string; error?: string }> {
  try {
    const validatedData = CreateCourtSchema.parse(courtData);
    
    // Check for duplicate court
    const existingCourt = await prisma.court.findFirst({
      where: {
        OR: [
          { courtName: validatedData.courtName },
          { courtCode: validatedData.courtCode }
        ]
      }
    });
    
    if (existingCourt) {
      return {
        success: false,
        error: 'Court with this name or code already exists'
      };
    }
    
    const newCourt = await prisma.court.create({
      data: validatedData
    });
    
    return { success: true, courtId: newCourt.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create court'
    };
  }
}

export async function getAllCourts(
  includeInactive: boolean = false
): Promise<Court[]> {
  return await prisma.court.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { courtName: 'asc' }
  });
}

export async function getCourtsByType(courtType: CourtType): Promise<Court[]> {
  return await prisma.court.findMany({
    where: { 
      courtType,
      isActive: true 
    },
    orderBy: { courtName: 'asc' }
  });
}

export async function getCourtById(courtId: string): Promise<Court | null> {
  return await prisma.court.findUnique({
    where: { id: courtId }
  });
}

export async function updateCourt(
  courtId: string,
  updateData: Partial<Court>
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.court.update({
      where: { id: courtId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update court'
    };
  }
}

export async function deactivateCourt(
  courtId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.court.update({
      where: { id: courtId },
      data: { isActive: false, updatedAt: new Date() }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deactivate court'
    };
  }
}

// Case Type CRUD Operations
export async function createCaseType(
  caseTypeData: any
): Promise<{ success: boolean; caseTypeId?: string; error?: string }> {
  try {
    const validatedData = CreateCaseTypeSchema.parse(caseTypeData);
    
    // Check for duplicate case type
    const existingCaseType = await prisma.caseType.findFirst({
      where: {
        OR: [
          { caseTypeName: validatedData.caseTypeName },
          { caseTypeCode: validatedData.caseTypeCode }
        ]
      }
    });
    
    if (existingCaseType) {
      return {
        success: false,
        error: 'Case type with this name or code already exists'
      };
    }
    
    const newCaseType = await prisma.caseType.create({
      data: validatedData
    });
    
    return { success: true, caseTypeId: newCaseType.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create case type'
    };
  }
}

export async function getAllCaseTypes(
  includeInactive: boolean = false
): Promise<CaseType[]> {
  return await prisma.caseType.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { caseTypeName: 'asc' }
  });
}

export async function getCaseTypeById(caseTypeId: string): Promise<CaseType | null> {
  return await prisma.caseType.findUnique({
    where: { id: caseTypeId }
  });
}

export async function updateCaseType(
  caseTypeId: string,
  updateData: Partial<CaseType>
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.caseType.update({
      where: { id: caseTypeId },
      data: updateData
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update case type'
    };
  }
}

export async function deactivateCaseType(
  caseTypeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.caseType.update({
      where: { id: caseTypeId },
      data: { isActive: false }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deactivate case type'
    };
  }
}

// User CRUD Operations
export async function createUser(
  userData: any
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const validatedData = CreateUserSchema.parse(userData);
    
    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }
    
    const newUser = await prisma.user.create({
      data: validatedData
    });
    
    return { success: true, userId: newUser.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    };
  }
}

export async function getAllUsers(
  includeInactive: boolean = false
): Promise<User[]> {
  return await prisma.user.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { name: 'asc' }
  });
}

export async function getUserById(userId: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function updateUser(
  userId: string,
  updateData: Partial<User>
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    };
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        role,
        updatedAt: new Date()
      }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user role'
    };
  }
}

export async function deactivateUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false, updatedAt: new Date() }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deactivate user'
    };
  }
}

// Combined statistics for all master data
export async function getMasterDataStatistics(): Promise<{
  judges: { total: number; active: number; inactive: number };
  courts: { total: number; active: number; inactive: number; byType: Record<string, number> };
  caseTypes: { total: number; active: number; inactive: number };
  users: { total: number; active: number; inactive: number; byRole: Record<string, number> };
}> {
  try {
    const [judges, courts, caseTypes, users] = await Promise.all([
      prisma.judge.groupBy({
        by: ['isActive'],
        _count: { id: true }
      }),
      prisma.court.groupBy({
        by: ['isActive', 'courtType'],
        _count: { id: true }
      }),
      prisma.caseType.groupBy({
        by: ['isActive'],
        _count: { id: true }
      }),
      prisma.user.groupBy({
        by: ['isActive', 'role'],
        _count: { id: true }
      })
    ]);
    
    // Process judge statistics
    const judgeStats = judges.reduce((acc, item) => {
      acc[item.isActive ? 'active' : 'inactive'] += item._count.id;
      acc.total += item._count.id;
      return acc;
    }, { total: 0, active: 0, inactive: 0 });
    
    // Process court statistics
    const courtStats = courts.reduce((acc, item) => {
      acc[item.isActive ? 'active' : 'inactive'] += item._count.id;
      acc.total += item._count.id;
      acc.byType[item.courtType] = (acc.byType[item.courtType] || 0) + item._count.id;
      return acc;
    }, { total: 0, active: 0, inactive: 0, byType: {} as Record<string, number> });
    
    // Process case type statistics
    const caseTypeStats = caseTypes.reduce((acc, item) => {
      acc[item.isActive ? 'active' : 'inactive'] += item._count.id;
      acc.total += item._count.id;
      return acc;
    }, { total: 0, active: 0, inactive: 0 });
    
    // Process user statistics
    const userStats = users.reduce((acc, item) => {
      acc[item.isActive ? 'active' : 'inactive'] += item._count.id;
      acc.total += item._count.id;
      acc.byRole[item.role] = (acc.byRole[item.role] || 0) + item._count.id;
      return acc;
    }, { total: 0, active: 0, inactive: 0, byRole: {} as Record<string, number> });
    
    return {
      judges: judgeStats,
      courts: courtStats,
      caseTypes: caseTypeStats,
      users: userStats
    };
  } catch (error) {
    logger.database.error('Error fetching master data statistics', { error });
    throw new Error('Failed to fetch master data statistics');
  }
}