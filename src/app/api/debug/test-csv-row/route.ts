import { NextResponse } from 'next/server';
import { CaseReturnRowSchema } from '@/lib/validation/schemas';
import { logger } from '@/lib/logger';

export async function GET() {
  // Skip debug endpoints in production build
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_DEBUG_ROUTES === 'true') {
    return NextResponse.json(
      { success: false, error: 'Debug endpoints disabled in production build' },
      { status: 404 }
    );
  }

  try {
    // Test with a sample row from the CSV (as strings like CSV parser would provide)
    const sampleRow = {
      court: "Milimani Civil",
      date_dd: "6",
      date_mon: "Nov",
      date_yyyy: "2023",
      caseid_type: "HCCC",
      caseid_no: "123",
      filed_dd: "13",
      filed_mon: "Jun",
      filed_yyyy: "2019",
      original_court: "",
      original_code: "",
      original_number: "",
      original_year: "0",
      case_type: "Civil Suit",
      judge_1: "Kendagor, Caroline J",
      judge_2: "",
      judge_3: "",
      judge_4: "",
      judge_5: "",
      judge_6: "",
      judge_7: "",
      comingfor: "Mention",
      outcome: "Directions Given",
      reason_adj: "",
      next_dd: "7",
      next_mon: "Mar",
      next_yyyy: "2024",
      male_applicant: "0",
      female_applicant: "0",
      organization_applicant: "1",
      male_defendant: "0",
      female_defendant: "0",
      organization_defendant: "1",
      legalrep: "Yes",
      applicant_witness: "0",
      defendant_witness: "0",
      custody: "0",
      other_details: ""
    };

    // Also test row 2 from the actual CSV
    const csvRow2 = {
      court: "Milimani Civil",
      date_dd: "20",
      date_mon: "Nov",
      date_yyyy: "2023",
      caseid_type: "HCCC",
      caseid_no: "258",
      filed_dd: "28",
      filed_mon: "Sep",
      filed_yyyy: "2016",
      original_court: "",
      original_code: "",
      original_number: "",
      original_year: "0",
      case_type: "Civil Suit",
      judge_1: "Kendagor, Caroline J",
      judge_2: "",
      judge_3: "",
      judge_4: "",
      judge_5: "",
      judge_6: "",
      judge_7: "",
      comingfor: "Mention",
      outcome: "Directions Given",
      reason_adj: "",
      next_dd: "16",
      next_mon: "May",
      next_yyyy: "2024",
      male_applicant: "1",
      female_applicant: "0",
      organization_applicant: "0",
      male_defendant: "0",
      female_defendant: "1",
      organization_defendant: "1",
      legalrep: "Yes",
      applicant_witness: "0",
      defendant_witness: "0",
      custody: "0",
      other_details: ""
    };

    logger.info('general', 'Testing CSV row validation...');

    // Test both rows
    const testRows = [
      { name: 'Sample Row 1', data: sampleRow },
      { name: 'CSV Row 2', data: csvRow2 }
    ];

    const results = [];

    for (const testRow of testRows) {
      logger.api.info(`Testing ${testRow.name}`, testRow.data);

      const result = CaseReturnRowSchema.safeParse(testRow.data);

      if (result.success) {
        logger.info('general', `✅ ${testRow.name} validation successful`);
        results.push({
          name: testRow.name,
          success: true,
          validatedData: result.data
        });
      } else {
        logger.info('general', `❌ ${testRow.name} validation failed:`, result.error.issues);
        results.push({
          name: testRow.name,
          success: false,
          errors: result.error.issues,
          rawData: testRow.data
        });
      }
    }

    return NextResponse.json({
      success: results.every(r => r.success),
      message: 'CSV row validation test completed',
      results
    });
  } catch (error) {
    logger.error('general', 'Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}