## Issues to fix
Not able to handle data that starts with empty row - Fixed 
not able to identify duplicated entries/activites alowing uploading of same file multiple times with a change of checksum
maping of case code and case type instead of description
case court_name is a name instead of fk to court table
activity to have judge table fk instead of judge name
court does not require code
Not able to handle untrimmed columns
[INFO] general: 🔧 Diagnostic: process.env.DATABASE_URL = postgresql://fiend:1a6n4g3e5l1a@127.0.0.1:5432/caseload


[DEBUG] import: Creating date from parts {
  day: { value: 30, type: 'number' },
  month: { value: 'May', type: 'string' },
  year: { value: 2022, type: 'number' }
}
[DEBUG] import: Converting date parts to numbers {
  dayNum: { value: 30, isNaN: false },
  yearNum: { value: 2022, isNaN: false }
}
[DEBUG] import: Created date object {
  input: { dayNum: 30, monthIndex: 4, yearNum: 2022 },
  created: 2022-05-29T21:00:00.000Z,
  validation: { getDate: 30, getMonth: 4, getFullYear: 2022, isValid: true }
}
[DEBUG] import: Valid date created { date: 2022-05-29T21:00:00.000Z }
[INFO] database: PROCESSING CASE TYPE {
  originalName: 'Civil Appeal',
  normalizedName: 'Civil Appeal',
  generatedCode: 'APPEAL'
}