import { CourtType } from '@prisma/client';
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
  
  console.log('🏛️ PROCESSING COURT:', {
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
    console.log('✅ FOUND EXISTING COURT:', {
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
  
  // Prepare new court data
  const newCourtData = {
    courtName: normalizedCourtName,
    courtCode: normalizedCourtCode || generateCourtCode(normalizedCourtName),
    courtType: inferredCourtType,
    isActive: true
  };

  console.log('📝 CREATING NEW COURT:', newCourtData);

  // Create new court
  const newCourt = await tx.court.create({
    data: newCourtData
  });

  console.log('✅ NEW COURT CREATED:', {
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
  
  console.log('👨‍⚖️ PROCESSING JUDGE:', {
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
    console.log('✅ FOUND EXISTING JUDGE:', {
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

  console.log('📝 CREATING NEW JUDGE:', newJudgeData);
  
  // Create new judge
  const newJudge = await tx.judge.create({
    data: newJudgeData
  });

  console.log('✅ NEW JUDGE CREATED:', {
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
  
  console.log('📋 PROCESSING CASE TYPE:', {
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
    console.log('✅ FOUND EXISTING CASE TYPE:', {
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

  console.log('📝 CREATING NEW CASE TYPE:', newCaseTypeData);
  
  // Create new case type
  const newCaseType = await tx.caseType.create({
    data: newCaseTypeData
  });

  console.log('✅ NEW CASE TYPE CREATED:', {
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
  return courtName
    .split(' ')
    .filter(word => word.length > 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 10); // Limit to 10 characters
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