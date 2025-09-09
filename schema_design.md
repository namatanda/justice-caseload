The remaining errors show that Case model uses originalCourtId instead of courtId, and CaseActivity uses details instead of description. From the schema, Case has originalCourtId for the court relation, and CaseActivity has details field for additional information. Need to fix these field mappings in the case upsert and case activity create sections.


The errors show that Case model uses filedDate instead of filingDate, and primaryJudgeId can't be undefined in CaseActivity create. From the schema, Case has filedDate field, and CaseActivity primaryJudgeId is required. Need to fix the date field name and ensure judge is always assigned or handle the null case properly. For simplicity, I'll make judge optional by providing a default value or skipping judge assignment when null.

The remaining errors are: Case model uses hasLegalRepresentation (boolean) instead of legalRepresentation, and CaseActivity create is missing required fields hasLegalRepresentation (boolean) and custodyStatus (enum). From the schema, hasLegalRepresentation can be set based on row.legalrep, and custodyStatus can default to NOT_APPLICABLE. Fix these field names and add missing required fields.


