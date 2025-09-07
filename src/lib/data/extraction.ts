import { CourtType } from '@prisma/client';
import logger from '@/lib/logger';
import { PrismaTransaction } from '../database';
import { validateExtractedCourt, validateExtractedJudge, validateExtractedCaseType } from '../validation/schemas';

// Court extraction and normalization
interface CourtExtractionResult {
  courtId: string;
  courtName: string;
  isNewCourt: boolean;
}

export async function extractAndNormalizeCourt(
  courtName: string | undefined,
  courtCode: string | undefined,
  tx: PrismaTransaction,
  derivedCourtType?: CourtType
): Promise<CourtExtractionResult | null> {
  
  if (!courtName || courtName.trim() === '') {
    return null;
  }
  
  // Validate court name
  const validation = validateExtractedCourt(courtName);
  if (!validation.isValid) {
    throw new Error(`Invalid court name: ${validation.issues.join(', ')}`);
  }
  
  const normalizedCourtName = normalizeCourtName(courtName);
  const normalizedCourtCode = normalizeCourtCode(courtCode);
  const inferredCourtType = derivedCourtType || inferCourtType(normalizedCourtName);
  
  logger.database.info('PROCESSING COURT', {
    originalName: courtName,
    normalizedName: normalizedCourtName,
    normalizedCode: normalizedCourtCode,
    inferredType: inferredCourtType,
    derivedType: derivedCourtType
  });

  // Check if court exists
  let existingCourt = await tx.court.findFirst({
    where: {
      OR: [
        { courtName: normalizedCourtName },
        ...(normalizedCourtCode ? [{ courtCode: normalizedCourtCode }] : []),
        { courtName: { contains: extractKeyWords(normalizedCourtName) } }
      ]
    }
  });
  
  if (existingCourt) {
    logger.database.info('FOUND EXISTING COURT', {
      id: existingCourt.id,
      name: existingCourt.courtName,
      code: existingCourt.courtCode,
      type: existingCourt.courtType
    });
    
    return {
      courtId: existingCourt.id,
      courtName: existingCourt.courtName,
      isNewCourt: false
    };
  }
  
  // Prepare new court data with unique court code
  let baseCourtCode = normalizedCourtCode || generateCourtCode(normalizedCourtName);
  
  // Ensure court code is unique by checking for duplicates and appending suffix if needed
  let courtCodeAttempt = 1;
  let uniqueCourtCode = baseCourtCode;
  
  while (await tx.court.findFirst({ where: { courtCode: uniqueCourtCode } })) {
    uniqueCourtCode = `${baseCourtCode}${courtCodeAttempt}`;
    courtCodeAttempt++;
    
    // Prevent infinite loop - if we've tried 100 variations, something is wrong
    if (courtCodeAttempt > 100) {
      throw new Error(`Unable to generate unique court code for: ${normalizedCourtName}`);
    }
  }

  const newCourtData = {
    courtName: normalizedCourtName,
    courtCode: uniqueCourtCode,
    courtType: inferredCourtType,
    isActive: true
  };

  logger.database.info('CREATING NEW COURT', newCourtData);

  // Create new court with error handling for constraint violations
  try {
    const newCourt = await tx.court.create({
      data: newCourtData
    });

    logger.database.info('NEW COURT CREATED', {
      id: newCourt.id,
      name: newCourt.courtName,
      code: newCourt.courtCode,
      type: newCourt.courtType
    });
    
    return {
      courtId: newCourt.id,
      courtName: newCourt.courtName,
      isNewCourt: true
    };
  } catch (error) {
    logger.database.error('COURT CREATION FAILED', error);
    
    // If it's a unique constraint violation, try to find the existing court
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      logger.database.info('CHECKING FOR EXISTING COURT WITH SAME CODE', { uniqueCourtCode });
      
      const existingCourtByCode = await tx.court.findFirst({
        where: { courtCode: uniqueCourtCode }
      });
      
      if (existingCourtByCode) {
        logger.database.info('FOUND EXISTING COURT BY CODE', { court: existingCourtByCode });
        return {
          courtId: existingCourtByCode.id,
          courtName: existingCourtByCode.courtName,
          isNewCourt: false
        };
      }
    }
    
    // Re-throw the error if we can't handle it
    throw error;
  }
}

// Judge extraction and normalization
interface JudgeExtractionResult {
  judgeId: string;
  judgeName: string;
  isNewJudge: boolean;
}

export async function extractAndNormalizeJudge(
  judgeFullName: string,
  tx: PrismaTransaction
): Promise<JudgeExtractionResult> {
  
  // Validate judge name
  const validation = validateExtractedJudge(judgeFullName);
  if (!validation.isValid) {
    throw new Error(`Invalid judge name: ${validation.issues.join(', ')}`);
  }
  
  // Normalize judge name
  const normalizedName = normalizeJudgeName(judgeFullName);
  const { firstName, lastName } = parseJudgeName(normalizedName);
  
  logger.database.info('PROCESSING JUDGE', {
    originalName: judgeFullName,
    normalizedName,
    firstName,
    lastName
  });
  
  // Check if judge exists
  let existingJudge = await tx.judge.findFirst({
    where: {
      OR: [
        { fullName: normalizedName },
        { 
          AND: [
            { firstName: firstName },
            { lastName: lastName }
          ]
        }
      ]
    }
  });
  
  if (existingJudge) {
    logger.database.info('FOUND EXISTING JUDGE', {
      id: existingJudge.id,
      fullName: existingJudge.fullName,
      firstName: existingJudge.firstName,
      lastName: existingJudge.lastName
    });
    
    return {
      judgeId: existingJudge.id,
      judgeName: existingJudge.fullName,
      isNewJudge: false
    };
  }
  
  // Prepare new judge data
  const newJudgeData = {
    fullName: normalizedName,
    firstName,
    lastName,
    isActive: true
  };

  logger.database.info('CREATING NEW JUDGE', newJudgeData);
  
  // Create new judge
  const newJudge = await tx.judge.create({
    data: newJudgeData
  });

  logger.database.info('NEW JUDGE CREATED', {
    id: newJudge.id,
    fullName: newJudge.fullName,
    firstName: newJudge.firstName,
    lastName: newJudge.lastName
  });
  
  return {
    judgeId: newJudge.id,
    judgeName: newJudge.fullName,
    isNewJudge: true
  };
}

// Case type extraction and normalization
export async function extractAndNormalizeCaseType(
  caseTypeName: string,
  tx: PrismaTransaction
): Promise<string> {
  
  // Validate case type name
  const validation = validateExtractedCaseType(caseTypeName);
  if (!validation.isValid) {
    throw new Error(`Invalid case type name: ${validation.issues.join(', ')}`);
  }
  
  const normalizedName = normalizeCaseTypeName(caseTypeName);
  const caseTypeCode = generateCaseTypeCode(normalizedName);
  
  logger.database.info('PROCESSING CASE TYPE', {
    originalName: caseTypeName,
    normalizedName,
    generatedCode: caseTypeCode
  });
  
  // Check if case type exists
  let existingCaseType = await tx.caseType.findFirst({
    where: {
      OR: [
        { caseTypeName: normalizedName },
        { caseTypeCode: caseTypeCode }
      ]
    }
  });
  
  if (existingCaseType) {
    logger.database.info('FOUND EXISTING CASE TYPE', {
      id: existingCaseType.id,
      name: existingCaseType.caseTypeName,
      code: existingCaseType.caseTypeCode
    });
    
    return existingCaseType.id;
  }
  
  // Prepare new case type data
  const newCaseTypeData = {
    caseTypeName: normalizedName,
    caseTypeCode,
    description: generateCaseTypeDescription(normalizedName),
    isActive: true
  };

  logger.database.info('CREATING NEW CASE TYPE', newCaseTypeData);
  
  // Create new case type
  const newCaseType = await tx.caseType.create({
    data: newCaseTypeData
  });

  logger.database.info('NEW CASE TYPE CREATED', {
    id: newCaseType.id,
    name: newCaseType.caseTypeName,
    code: newCaseType.caseTypeCode,
    description: newCaseType.description
  });
  
  return newCaseType.id;
}

// Court normalization functions
function normalizeCourtName(courtName: string): string {
  return courtName
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\.$/, '') // Remove trailing period
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeCourtCode(courtCode: string | undefined): string {
  if (!courtCode) return '';
  return courtCode.trim().toUpperCase();
}

function extractKeyWords(courtName: string): string {
  // Extract key identifying words from court name
  const stopWords = ['court', 'of', 'the', 'and', 'for'];
  return courtName
    .toLowerCase()
    .split(' ')
    .filter(word => !stopWords.includes(word) && word.length > 2)
    .slice(0, 3) // Take first 3 meaningful words
    .join(' ');
}

function generateCourtCode(courtName: string): string {
  // Generate court code from name if not provided
  // Include more characters to reduce collisions
  const words = courtName
    .split(' ')
    .filter(word => word.length > 2);
    
  if (words.length === 1) {
    // Single word - take first 6 characters
    return words[0].substring(0, 6).toUpperCase();
  } else if (words.length === 2) {
    // Two words - take first 3 chars of each
    return (words[0].substring(0, 3) + words[1].substring(0, 3)).toUpperCase();
  } else {
    // Multiple words - take first 2 chars of first 3 words
    return words.slice(0, 3)
      .map(word => word.substring(0, 2))
      .join('')
      .toUpperCase();
  }
}

/**
 * Derives CourtType from caseid_type prefix according to CSV data structure requirements.
 * Rules from requirements.md:
 * - Check for 3-letter SCC first to avoid conflict with SC (Supreme Court)
 * - Then check 2-letter prefixes for other court types
 * - Default to TC (Tribunal Court) for unmatched prefixes
 */
function deriveCourtTypeFromCaseId(caseidType: string): CourtType {
  if (!caseidType || typeof caseidType !== 'string') {
    return CourtType.TC; // Default fallback
  }

  const prefix = caseidType.toUpperCase().trim();

  // Check for 3-letter SCC first to avoid SC conflict
  if (prefix.startsWith('SCC')) {
    return CourtType.SCC;
  }

  // Check 2-letter prefixes
  const twoLetterPrefix = prefix.substring(0, 2);

  switch (twoLetterPrefix) {
    case 'SC':
      return CourtType.SC;
    case 'EL':
      // Check if it's ELC or ELRC
      return prefix.startsWith('ELC') ? CourtType.ELC : CourtType.ELRC;
    case 'KC':
      return CourtType.KC;
    case 'CO':
      return CourtType.COA;
    case 'MC':
      return CourtType.MC;
    case 'HC':
      return CourtType.HC;
    default:
      return CourtType.TC; // Default for unmatched prefixes
  }
}

function inferCourtType(courtName: string): CourtType {
  const name = courtName.toLowerCase();

  if (name.includes('supreme court') || name.includes('sc')) return CourtType.SC;
  if (name.includes('high court') || name.includes('hc')) return CourtType.HC;
  if (name.includes('magistrate') || name.includes('commercial')) return CourtType.MC;
  if (name.includes('small claims')) return CourtType.SCC;
  if (name.includes('court of appeal') || name.includes('coa')) return CourtType.COA;
  if (name.includes('employment') || name.includes('labour')) return CourtType.ELRC;
  if (name.includes('environment') || name.includes('land')) return CourtType.ELC;
  if (name.includes('kadhis') || name.includes('kadhi')) return CourtType.KC;
  if (name.includes('tribunal')) return CourtType.TC;

  return CourtType.SC; // Default to Supreme Court
}

// Judge normalization functions
function normalizeJudgeName(judgeName: string): string {
  return judgeName
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^(Hon\.|Justice|Judge)\s*/i, '') // Remove titles
    .trim();
}

function parseJudgeName(fullName: string): { firstName: string; lastName: string } {
  // Handle "LastName, FirstName MiddleName" format
  if (fullName.includes(',')) {
    const [lastName, firstPart] = fullName.split(',').map(part => part.trim());
    const firstName = firstPart.split(' ')[0] || '';
    return { firstName, lastName };
  }
  
  // Handle "FirstName MiddleName LastName" format
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';
  
  return { firstName, lastName };
}

// Case type normalization functions
function normalizeCaseTypeName(caseTypeName: string): string {
  return caseTypeName
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateCaseTypeCode(caseTypeName: string): string {
  const mapping: Record<string, string> = {
    'Civil Suit': 'CIVIL',
    'Civil Appeal': 'APPEAL',
    'Civil Case Miscellaneous': 'MISC',
    'Commercial Matters': 'COMM',
    'Criminal Revision': 'CRIM_REV',
    'Judicial Review': 'JR',
    'Criminal Case': 'CRIM',
    'Family Matters': 'FAMILY',
    'Employment Dispute': 'EMPLOY',
    'Constitutional Petition': 'CONST',
    'Environmental Matters': 'ENV',
    'Election Petition': 'ELECT'
  };
  
  return mapping[caseTypeName] || 
    caseTypeName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 20); // Limit to 20 characters
}

function generateCaseTypeDescription(caseTypeName: string): string {
  const descriptions: Record<string, string> = {
    'Civil Suit': 'General civil litigation matters between private parties',
    'Civil Appeal': 'Appeals from lower court civil decisions',
    'Civil Case Miscellaneous': 'Miscellaneous civil applications and motions',
    'Commercial Matters': 'Commercial and business-related disputes',
    'Criminal Revision': 'Review of criminal court decisions and sentences',
    'Judicial Review': 'Administrative law and judicial review applications',
    'Criminal Case': 'Criminal prosecution matters',
    'Family Matters': 'Family law disputes including divorce, custody, and maintenance',
    'Employment Dispute': 'Employment and labor-related disputes',
    'Constitutional Petition': 'Constitutional law matters and fundamental rights cases',
    'Environmental Matters': 'Environmental protection and natural resource cases',
    'Election Petition': 'Election-related disputes and petitions'
  };
  
  return descriptions[caseTypeName] || `${caseTypeName} proceedings and related matters`;
}

// Bulk extraction utilities
export interface MasterDataStats {
  newCourts: number;
  newJudges: number;
  newCaseTypes: number;
  existingCourts: number;
  existingJudges: number;
  existingCaseTypes: number;
}

export class MasterDataTracker {
  private stats: MasterDataStats = {
    newCourts: 0,
    newJudges: 0,
    newCaseTypes: 0,
    existingCourts: 0,
    existingJudges: 0,
    existingCaseTypes: 0,
  };

  trackCourt(isNew: boolean): void {
    if (isNew) {
      this.stats.newCourts++;
    } else {
      this.stats.existingCourts++;
    }
  }

  trackJudge(isNew: boolean): void {
    if (isNew) {
      this.stats.newJudges++;
    } else {
      this.stats.existingJudges++;
    }
  }

  trackCaseType(isNew: boolean): void {
    if (isNew) {
      this.stats.newCaseTypes++;
    } else {
      this.stats.existingCaseTypes++;
    }
  }

  getStats(): MasterDataStats {
    return { ...this.stats };
  }

  reset(): void {
    this.stats = {
      newCourts: 0,
      newJudges: 0,
      newCaseTypes: 0,
      existingCourts: 0,
      existingJudges: 0,
      existingCaseTypes: 0,
    };
  }
}

// Helper function to extract all judges from a row
export function extractJudgesFromRow(row: any): string[] {
  const judges: string[] = [];
  
  for (let i = 1; i <= 7; i++) {
    const judgeField = row[`judge_${i}`];
    if (judgeField && judgeField.trim()) {
      judges.push(judgeField.trim());
    }
  }
  
  return judges;
}

// Helper function to create case number
export function createCaseNumber(caseType: string, caseNo: string): string {
  return `${caseType}-${caseNo}`;
}

// Helper function to determine custody status
export function determineCustodyStatus(custodyCount: number): 'IN_CUSTODY' | 'ON_BAIL' | 'NOT_APPLICABLE' {
  if (custodyCount > 0) {
    return 'IN_CUSTODY';
  }
  return 'NOT_APPLICABLE';
}