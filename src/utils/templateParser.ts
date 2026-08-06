import type { QuestionTemplate, PredefinedQuestion } from '../types/audit';

export const MEDICAL_CENTER_6_HEADERS = [
  '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
  '2. Electrical (Equipment, CCTV, Access Control, UPS, Fire Safety)',
  '3. Network (IT, Software, Internet & CCTV Recording)',
  '4. Plumbing (Water Supply, Drainage & Sewage)',
  '5. Documentation (Registers, Stock, Consumables & SOPs)',
  '6. Feedback (Service Quality, Safety & Guard Performance)'
] as const;

export type MedicalHeaderType = typeof MEDICAL_CENTER_6_HEADERS[number];

/**
 * Automatically categorizes question text into one of the 6 core Medical Center operational headers.
 */
export function categorizeQuestionToHeader(questionText: string, description: string = ''): MedicalHeaderType {
  const text = (questionText + ' ' + description).toLowerCase();

  // 1. CLEANING KEYWORDS
  if (
    /clean|wash|dust|waste|trash|biohazard|sanitat|housekeep|disinfect|hygiene|floor|janitor|litter|contain|bed making|linen|restroom|sweep|mop|scrub|laundry|5s|civil/i.test(text)
  ) {
    return '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)';
  }

  // 2. ELECTRICAL KEYWORDS
  if (
    /electr|power|breaker|light|switch|ups|cctv|wire|cable|socket|panel|transformer|battery|sensor|bulb|fixture|voltage|short circuit|generator|fire safety|alarm|smoke detector|extinguisher/i.test(text)
  ) {
    return '2. Electrical (Equipment, CCTV, Access Control, UPS, Fire Safety)';
  }

  // 3. NETWORK KEYWORDS
  if (
    /network|wifi|router|server|internet|ethernet|data|port|switch|ip|software|camera feed|sync|lan|wlan|bandwidth|modem/i.test(text)
  ) {
    return '3. Network (IT, Software, Internet & CCTV Recording)';
  }

  // 4. PLUMBING KEYWORDS
  if (
    /plumb|water|drain|sewer|pipe|tap|sink|leak|valve|flush|eyewash|shower|borewell|tank|basin|restroom water|dispenser/i.test(text)
  ) {
    return '4. Plumbing (Water Supply, Drainage & Sewage)';
  }

  // 5. DOCUMENTATION KEYWORDS
  if (
    /docu|register|log|record|sign|stock|inventory|sop|protocol|tag|certificate|manual|file|inspection tag|logbook|register book|Sign-off/i.test(text)
  ) {
    return '5. Documentation (Registers, Stock, Consumables & SOPs)';
  }

  // 6. FEEDBACK KEYWORDS
  if (
    /feedb|service|guard|satisfact|vendor|performance|complaint|rating|user|patient|visitor|staff feedback|security/i.test(text)
  ) {
    return '6. Feedback (Service Quality, Safety & Guard Performance)';
  }

  // Default fallback heuristic based on text features
  if (text.includes('check') || text.includes('inspect')) {
    return '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)';
  }

  return '5. Documentation (Registers, Stock, Consumables & SOPs)';
}

export interface ParsedAuditQuestion {
  id: string;
  questionText: string;
  description: string;
  categoryHeader: MedicalHeaderType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isMandatory: boolean;
}

export interface TemplateParseResult {
  success: boolean;
  fileName: string;
  fileType: string;
  totalQuestionsParsed: number;
  headerDistribution: Record<string, number>;
  questions: ParsedAuditQuestion[];
  error?: string;
}

/**
 * Parses raw text extracted from PDF, DOC, TXT, or CSV files into structured audit questions
 * categorized into the 6 Medical Center operational headers.
 */
export function parseRawTextToQuestions(rawText: string, fileName: string): TemplateParseResult {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  if (lines.length === 0) {
    return {
      success: false,
      fileName,
      fileType: fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      totalQuestionsParsed: 0,
      headerDistribution: {},
      questions: [],
      error: 'File appears to be empty or unreadable.'
    };
  }

  const parsedQuestions: ParsedAuditQuestion[] = [];
  const distribution: Record<string, number> = {};

  MEDICAL_CENTER_6_HEADERS.forEach(h => { distribution[h] = 0; });

  let qCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip header lines or standard labels if any
    if (/^question_id|category|question_text|compliance_standard/i.test(line)) continue;
    if (/^page \d+/i.test(line) || /^audit checklist/i.test(line)) continue;

    // Clean up leading numbers or bullet markers (e.g. "1. ", "Q1: ", "- ", "1.1 ")
    const cleanText = line.replace(/^(\d+[\.\)]\s*|q\d+[:\.]\s*|[-•*]\s*)/i, '').trim();

    if (cleanText.length < 5) continue; // skip very short lines

    qCount++;
    const qId = `Q-${Date.now().toString().slice(-4)}-${qCount.toString().padStart(2, '0')}`;
    const header = categorizeQuestionToHeader(cleanText);
    
    distribution[header] = (distribution[header] || 0) + 1;

    // Assign risk level based on keywords
    const isHighRisk = /fire|safety|hazard|emergency|chemical|oxygen|high-voltage|medicine|expiry|alarm|hazard|cctv/i.test(cleanText);
    const riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = isHighRisk ? 'HIGH' : (qCount % 2 === 0 ? 'MEDIUM' : 'LOW');

    parsedQuestions.push({
      id: qId,
      questionText: cleanText,
      description: `Operational compliance checkpoint under ${header}`,
      categoryHeader: header,
      priority: riskLevel,
      isMandatory: riskLevel === 'HIGH'
    });
  }

  if (parsedQuestions.length === 0) {
    return {
      success: false,
      fileName,
      fileType: fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      totalQuestionsParsed: 0,
      headerDistribution: {},
      questions: [],
      error: 'No valid questions could be extracted from the uploaded document.'
    };
  }

  return {
    success: true,
    fileName,
    fileType: fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT',
    totalQuestionsParsed: parsedQuestions.length,
    headerDistribution: distribution,
    questions: parsedQuestions
  };
}

/**
 * Reads uploaded File (PDF, DOCX, TXT, CSV) and extracts questions organized into 6 Medical Center headers.
 */
export async function readAndParseUploadedTemplate(file: File): Promise<TemplateParseResult> {
  const fileName = file.name;
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const rawText = (e.target?.result as string) || '';
      const result = parseRawTextToQuestions(rawText, fileName);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({
        success: false,
        fileName,
        fileType: fileExt.toUpperCase(),
        totalQuestionsParsed: 0,
        headerDistribution: {},
        questions: [],
        error: `Failed to read file ${fileName}. Please ensure it is a valid PDF, DOCX, TXT, or CSV file.`
      });
    };

    reader.readAsText(file);
  });
}

import type { CampusVenue } from '../types/audit';

/**
 * Converts ParsedAuditQuestion array into a dedicated Venue QuestionTemplate categorized under 6 Medical Center headers
 */
export function convertParsedToQuestionTemplate(
  templateTitle: string,
  targetVenue: CampusVenue | null,
  parsedQuestions: ParsedAuditQuestion[]
): QuestionTemplate {
  const questions: PredefinedQuestion[] = parsedQuestions.map(pq => ({
    id: pq.id,
    section: pq.categoryHeader,
    questionText: pq.questionText,
    description: pq.description,
    isMandatory: pq.isMandatory,
    requiresPhotoIfNo: true,
    priority: pq.priority,
    aiContextKeywords: [pq.categoryHeader.split(' ')[1], 'Inspection', 'Compliance'],
    sampleFollowUpQuestionsIfNo: [
      `Describe the specific physical defect observed for "${pq.questionText}".`,
      `What corrective action or repair ticket was initiated?`
    ]
  }));

  const venueTitle = targetVenue ? `${targetVenue.name} (${targetVenue.code})` : 'Individual Facility';

  return {
    id: targetVenue ? `TMPL-VENUE-${targetVenue.code}` : `TMPL-UPLOAD-${Date.now().toString().slice(-5)}`,
    title: templateTitle || `${venueTitle} Dedicated 6-Header Audit Question Set`,
    description: `Individual venue question set containing ${parsedQuestions.length} checkpoints categorized into 6 Medical Center operational headers.`,
    venueCategory: targetVenue ? targetVenue.category : 'Medical Facilities',
    venueId: targetVenue?.id,
    venueName: targetVenue?.name,
    venueCode: targetVenue?.code,
    createdBy: 'Prof. Sibi John (Admin Upload)',
    createdAt: new Date().toISOString().split('T')[0],
    questions: questions
  };
}
