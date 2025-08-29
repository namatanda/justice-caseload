// Case CRUD Operations
export {
  createCase,
  createCaseActivity,
  getCaseById,
  getCasesPaginated,
  searchCases,
  updateCase,
  updateCaseStatus,
  bulkUpdateCases,
  softDeleteCase,
  getCaseStatistics,
  getRecentCases,
  type PaginatedCases,
  type CaseDetails,
  type BulkUpdateResult
} from './case-crud';

// Master Data CRUD Operations
export {
  // Judge operations
  createJudge,
  getAllJudges,
  getJudgeById,
  updateJudge,
  deactivateJudge,
  
  // Court operations
  createCourt,
  getAllCourts,
  getCourtsByType,
  getCourtById,
  updateCourt,
  deactivateCourt,
  
  // Case Type operations
  createCaseType,
  getAllCaseTypes,
  getCaseTypeById,
  updateCaseType,
  deactivateCaseType,
  
  // User operations
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserRole,
  deactivateUser,
  
  // Combined statistics
  getMasterDataStatistics
} from './master-data-crud';