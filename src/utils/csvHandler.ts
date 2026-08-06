import type { CSVQuestionItem, QuestionTemplate, PredefinedQuestion } from '../types/audit';

export const CSV_REQUIRED_HEADERS = [
  'Question_ID',
  'Category',
  'Question_Text',
  'Compliance_Standard',
  'Risk_Level',
  'Max_Score',
  'Guidance_Notes'
];

export const SAMPLE_CSV_CONTENT = `Question_ID,Category,Question_Text,Compliance_Standard,Risk_Level,Max_Score,Guidance_Notes
SAF-001,Fire Safety,Are all fire extinguishers pressure gauges in the green zone and hydro-inspected within 12 months?,OSHA 1910.157,HIGH,10,Verify gauge needle location and check annual inspection physical tag.
SAF-002,Electrical Safety,Is the main high-voltage circuit breaker panel clear of clutter and sealed against moisture?,NFPA 70E,HIGH,10,Ensure minimum 36-inch clearance in front of electrical enclosures.
HYG-001,Sanitation,Are emergency eyewash stations and chemical safety showers tested weekly with log entries?,ANSI Z358.1,HIGH,10,Flushed for 3 minutes; verify flow rate and tag sign-off.
INV-001,Hazardous Materials,Are hazardous chemicals stored in secondary containment trays with legible GHS labels?,GHS / OSHA HCS,MEDIUM,5,Check secondary containment capacity (110% of largest container).
EQU-001,Heavy Machinery,Do all warehouse forklift operators possess active safety certification badges?,OSHA 1910.178,MEDIUM,5,Spot-check operator IDs and daily pre-shift inspection logs.
SEC-001,Facility Access,Are emergency exit push-bars operational and pathways clear of pallet obstruction?,NFPA 101,HIGH,10,Attempt push-bar release and check 44-inch clear aisle width.
`;

/**
 * Triggers browser download of standard sample CSV file.
 */
export function downloadSampleCSV(): void {
  const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'audit_questions_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface CSVParseResult {
  success: boolean;
  items: CSVQuestionItem[];
  headersFound: string[];
  missingHeaders: string[];
  error?: string;
  totalRows: number;
}

/**
 * Parses CSV raw text into CSVQuestionItem array.
 */
export function parseCSVText(rawText: string): CSVParseResult {
  const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return {
      success: false,
      items: [],
      headersFound: [],
      missingHeaders: CSV_REQUIRED_HEADERS,
      error: 'CSV file is completely empty.',
      totalRows: 0
    };
  }

  // Parse header line
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.trim());
  const missingHeaders = CSV_REQUIRED_HEADERS.filter(req => !headers.includes(req));

  if (missingHeaders.length > 0) {
    return {
      success: false,
      items: [],
      headersFound: headers,
      missingHeaders: missingHeaders,
      error: `Missing required CSV headers: ${missingHeaders.join(', ')}`,
      totalRows: lines.length - 1
    };
  }

  const items: CSVQuestionItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowValues = parseCSVLine(lines[i]);
    if (rowValues.length < headers.length) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = rowValues[idx] ? rowValues[idx].trim() : '';
    });

    const riskRaw = (rowObj['Risk_Level'] || 'HIGH').toUpperCase();
    const riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = (riskRaw === 'MEDIUM' || riskRaw === 'LOW') ? riskRaw : 'HIGH';

    items.push({
      Question_ID: rowObj['Question_ID'] || `Q-${i}`,
      Category: rowObj['Category'] || 'General Safety',
      Question_Text: rowObj['Question_Text'] || 'Compliance checkpoint question',
      Compliance_Standard: rowObj['Compliance_Standard'] || 'Standard Operational Procedure',
      Risk_Level: riskLevel,
      Max_Score: parseInt(rowObj['Max_Score'], 10) || 10,
      Guidance_Notes: rowObj['Guidance_Notes'] || ''
    });
  }

  return {
    success: true,
    items,
    headersFound: headers,
    missingHeaders: [],
    totalRows: items.length
  };
}

/**
 * Split CSV line respecting quoted commas.
 */
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

/**
 * Converts CSVQuestionItems into a QuestionTemplate ready for Question Bank
 */
export function convertCSVItemsToTemplate(
  templateTitle: string,
  category: any,
  csvItems: CSVQuestionItem[]
): QuestionTemplate {
  const questions: PredefinedQuestion[] = csvItems.map(item => ({
    id: item.Question_ID,
    section: `1. ${item.Category}`,
    questionText: item.Question_Text,
    description: item.Guidance_Notes ? `[Standard: ${item.Compliance_Standard}] ${item.Guidance_Notes}` : `Standard: ${item.Compliance_Standard}`,
    isMandatory: item.Risk_Level === 'HIGH',
    requiresPhotoIfNo: item.Risk_Level === 'HIGH',
    priority: item.Risk_Level
  }));

  return {
    id: `TMPL-CSV-${Date.now().toString().slice(-5)}`,
    title: templateTitle,
    description: `Uploaded CSV Question Set containing ${csvItems.length} questions across ${new Set(csvItems.map(i => i.Category)).size} categories.`,
    venueCategory: category || 'Utility & Infrastructure',
    createdBy: 'Admin Upload',
    createdAt: new Date().toISOString().split('T')[0],
    questions: questions
  };
}
