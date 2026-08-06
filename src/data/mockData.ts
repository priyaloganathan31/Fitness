import type { CampusAuditRecord, AuditAssignment } from '../types/audit';

export const MOCK_AUDIT_ASSIGNMENTS: AuditAssignment[] = [
  {
    id: 'ASG-2026-001',
    title: 'Medical Center Oxygen & Cold Chain Inspection',
    departmentSite: 'Campus Health & Medical Center (MED-CTR-01)',
    venueId: 'FC-LOC-01',
    venueName: 'Campus Health & Medical Center',
    venueCode: 'MED-CTR-01',
    templateId: 'TMPL-BIT-MED-24',
    templateTitle: 'Fitness Certificate - Medical Center Incharge',
    auditorId: 'auditor-sibi',
    auditorName: 'Prof. Sibi John',
    assignedByAdmin: 'Registrar Infrastructure Office',
    assignedDate: '2026-07-28',
    dueDate: '2026-08-05',
    status: 'Completed',
    priority: 'HIGH',
    specialInstructions: 'Verify oxygen line pressure sensors and emergency exits in Bay A.',
    progressPercentage: 100,
    recordId: 'AUD-2026-MED-091'
  },
  {
    id: 'ASG-2026-FM-002',
    title: 'Campus FM Radio Station 90.4 MHz Broadcast & Infrastructure FC Audit',
    departmentSite: 'Campus FM Radio Station (FM-RAD-01)',
    venueId: 'FC-LOC-02',
    venueName: 'Campus FM Radio Station (90.4 MHz)',
    venueCode: 'FM-RAD-01',
    templateId: 'TMPL-BIT-FM-10',
    templateTitle: 'Fitness Certificate - FM Radio Station Incharge',
    auditorId: 'auditor-soundar',
    auditorName: 'Prof. Soundararajan',
    assignedByAdmin: 'Registrar Infrastructure Office',
    assignedDate: '2026-07-28',
    dueDate: '2026-08-04',
    status: 'Completed',
    priority: 'HIGH',
    specialInstructions: 'Inspect all 10 FM station checkpoints: common area cleaning, fire extinguishers, UPS & batteries, ACs, lights/fans, transmitter & antenna, mics/consoles, studio equipment, speakers/receivers/recorders, and essential registers.',
    progressPercentage: 100,
    recordId: 'AUD-2026-FM-092'
  },
  {
    id: 'ASG-2026-002',
    title: 'Central Kitchen Exhaust Fan & Hygiene Audit',
    departmentSite: 'Central Student Dining Hall & Kitchen (DIN-CNT-01)',
    venueId: 'FC-LOC-05',
    venueName: 'Central Student Dining Hall & Kitchen',
    venueCode: 'DIN-CNT-01',
    templateId: 'TMPL-MED-001',
    templateTitle: 'Food Safety & Hygiene Checklist',
    auditorId: 'auditor-priya',
    auditorName: 'Priya',
    assignedByAdmin: 'Registrar Infrastructure Office',
    assignedDate: '2026-07-28',
    dueDate: '2026-08-02',
    status: 'Under Review',
    priority: 'HIGH',
    specialInstructions: 'Inspect kitchen exhaust hoods and grease trap seals.',
    progressPercentage: 100,
    recordId: 'AUD-2026-DIN-044'
  },
  {
    id: 'ASG-2026-003',
    title: 'Cleanroom High Hazard Chemical Inspection',
    departmentSite: 'Nanotechnology Cleanroom & Materials Lab (LAB-CLEAN-02)',
    venueId: 'FC-LOC-02',
    venueName: 'Nanotechnology Cleanroom & Materials Lab',
    venueCode: 'LAB-CLEAN-02',
    templateId: 'TMPL-MED-001',
    templateTitle: 'High Hazard Chemical & Electrical Compliance',
    auditorId: 'auditor-priya',
    auditorName: 'Priya',
    assignedByAdmin: 'Registrar Infrastructure Office',
    assignedDate: '2026-07-29',
    dueDate: '2026-08-10',
    status: 'Assigned',
    priority: 'MEDIUM',
    specialInstructions: 'Verify HEPA filter pressure differential and eyewash station flow.',
    progressPercentage: 0
  },
  {
    id: 'ASG-2026-004',
    title: 'Hostel Fire Safety & Stairwell Clearance',
    departmentSite: 'Boys Hostel Complex Block-C (HST-BLK-C)',
    venueId: 'FC-LOC-03',
    venueName: 'Boys Hostel Complex Block-C',
    venueCode: 'HST-BLK-C',
    templateId: 'TMPL-MED-001',
    templateTitle: 'Hostel Fire & Structural Safety Template',
    auditorId: 'auditor-priya',
    auditorName: 'Priya',
    assignedByAdmin: 'Registrar Infrastructure Office',
    assignedDate: '2026-07-29',
    dueDate: '2026-08-12',
    status: 'In Progress',
    priority: 'LOW',
    specialInstructions: 'Check stairwell fire extinguishers and emergency lights.',
    progressPercentage: 35
  }
];

export const MOCK_AUDIT_RECORDS: CampusAuditRecord[] = [
  {
    id: 'AUD-2026-MED-091',
    assignmentId: 'ASG-2026-001',
    certificateNumber: 'FC-COLLEGE-2026-MED001',
    venueId: 'FC-LOC-01',
    venueName: 'Campus Health & Medical Center',
    venueCode: 'MED-CTR-01',
    venueCategory: 'Medical Facilities',
    auditorName: 'Prof. Sibi John',
    auditedByAuditeeName: 'Mrs. Priya L, AP-III, Dept of IT',
    auditDate: '2026-07-27',
    timeSpentMinutes: 18.5,
    scannedQrMatched: true,
    scannedQrCode: 'QR-FC-MEDCTR01-SECURE-11493954-77274503',
    liveGpsCoordinates: { lat: 11.493956, lng: 77.274505 },
    targetGpsCoordinates: { lat: 11.493954, lng: 77.274503 },
    gpsDistanceMeters: 2.1,
    isGeoFenceVerified: true,
    templateId: 'TMPL-MED-001',
    predefinedAnswers: {
      'MED-Q1': { questionId: 'MED-Q1', answer: 'YES', notes: 'Pressure 140 bar, hydro test date valid till 2027.' },
      'MED-Q2': { questionId: 'MED-Q2', answer: 'YES', notes: 'AED indicator green.' },
      'MED-Q3': { questionId: 'MED-Q3', answer: 'YES', notes: 'Temp reading 4.2°C.' },
      'MED-Q4': { questionId: 'MED-Q4', answer: 'YES', notes: 'All supplies full.' },
      'MED-Q5': { questionId: 'MED-Q5', answer: 'YES', notes: 'Autoclave pressure calibration verified.' },
      'MED-Q6': { questionId: 'MED-Q6', answer: 'YES', notes: 'Bins lined correctly.' },
      'MED-Q7': { questionId: 'MED-Q7', answer: 'YES', notes: 'Gauge green.' },
      'MED-Q8': { questionId: 'MED-Q8', answer: 'YES', notes: 'Emergency LED operational.' },
      'MED-Q9': { questionId: 'MED-Q9', answer: 'YES', notes: 'Sensors responsive.' },
      'MED-Q10': { questionId: 'MED-Q10', answer: 'YES', notes: 'Driveway completely clear.' }
    },
    aiDynamicQuestions: [
      {
        id: 'AI-Q-1',
        questionText: 'Which specific color seal ring is attached to the oxygen pressure regulator in Room 101?',
        category: 'Physical Verification Spot-Check',
        options: ['Yellow Polymer Seal', 'Blue Anodized Metal Seal', 'Red Warning Tag', 'Green Anti-Tamper Ring'],
        correctOptionIndex: 3,
        userAnswerIndex: 3,
        isCorrect: true
      },
      {
        id: 'AI-Q-2',
        questionText: 'What is the digital temperature displayed on the cold chain vaccine unit right now?',
        category: 'Spot Verification',
        options: ['1.2 °C', '4.2 °C', '9.5 °C', '12.0 °C'],
        correctOptionIndex: 1,
        userAnswerIndex: 1,
        isCorrect: true
      }
    ],
    authenticity: {
      overallScore: 96,
      isSelfApproved: true,
      gpsProximityScore: 99,
      dwellTimeScore: 95,
      photoAuthenticityScore: 94,
      aiDynamicCheckScore: 100,
      discrepancyFlags: [],
      reviewReason: 'High confidence. Physical presence verified inside 2.1m radius. All checkpoints passed.'
    },
    status: 'PASSED_SELF_APPROVED',
    auditorReviewNotes: 'Self-Approved by AI Authenticity Engine. Fitness Certificate FC-COLLEGE-2026-MED001 generated.',
    auditorFeedback: {
      overallSummary: 'Medical facility is in stellar compliance condition. All emergency oxygen cylinders and cold chain refrigerators were tested and validated.',
      onGroundChallenges: 'None encountered. Staff provided immediate access to Room 101.',
      correctiveActionRecommended: 'Routine inspection due again in 30 days.',
      ratingScore: 5
    },
    cryptoSignatureHash: '0x89f2a0149cbe7781042f9a91c7716e'
  },
  {
    id: 'AUD-2026-DIN-044',
    assignmentId: 'ASG-2026-002',
    certificateNumber: 'FC-COLLEGE-2026-DIN005',
    venueId: 'FC-LOC-05',
    venueName: 'Central Student Dining Hall & Kitchen',
    venueCode: 'DIN-CNT-01',
    venueCategory: 'Dining & Food Services',
    auditorName: 'Prof. Sibi John',
    auditedByAuditeeName: 'Mrs. Priya L, AP-III, Dept of IT',
    auditDate: '2026-07-24',
    timeSpentMinutes: 6.2,
    scannedQrMatched: true,
    scannedQrCode: 'QR-FC-DINCNT01-SECURE-1300950-8023490',
    liveGpsCoordinates: { lat: 13.00970, lng: 80.23510 },
    targetGpsCoordinates: { lat: 13.00950, lng: 80.23490 },
    gpsDistanceMeters: 28.4,
    isGeoFenceVerified: true,
    templateId: 'TMPL-MED-001',
    predefinedAnswers: {
      'MED-Q1': { questionId: 'MED-Q1', answer: 'YES', notes: 'Checked.' },
      'MED-Q2': { questionId: 'MED-Q2', answer: 'NO', notes: 'Exhaust fan belt snapped in main kitchen section.', photoProof: {
        id: 'P-101',
        questionId: 'MED-Q2',
        photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        caption: 'Snapped motor belt on Exhaust Fan Unit #3',
        timestamp: '2026-07-24 10:14:02',
        geoTag: { lat: 13.00970, lng: 80.23510 },
        issueCategory: 'Infrastructure'
      }},
      'MED-Q3': { questionId: 'MED-Q3', answer: 'YES', notes: 'Checked.' }
    },
    aiDynamicQuestions: [
      {
        id: 'AI-Q-DIN-1',
        questionText: 'State the expiration date printed on the commercial grease trap filter tag in Bay 2.',
        category: 'Authenticity Verification',
        options: ['July 2026', 'August 2026', 'Tag Missing/Illegible', 'October 2026'],
        correctOptionIndex: 2,
        userAnswerIndex: 0,
        isCorrect: false
      }
    ],
    authenticity: {
      overallScore: 68,
      isSelfApproved: false,
      gpsProximityScore: 72,
      dwellTimeScore: 50,
      photoAuthenticityScore: 85,
      aiDynamicCheckScore: 40,
      discrepancyFlags: [
        'GPS Proximity boundary warning (28.4 meters drift)',
        'Inspection dwell time (6.2 mins) below standard 15 min threshold',
        'Failed AI Dynamic Spot-Check Question'
      ],
      reviewReason: 'Score below 85% self-approval threshold. Equipment malfunction detected and rapid completion flagged.'
    },
    status: 'FLAGGED_REVIEW_REQUIRED',
    auditorReviewNotes: 'Auditor review required: Kitchen exhaust failure requires maintenance fix before FC re-issuance.',
    auditorFeedback: {
      overallSummary: 'Main kitchen exhaust fan belt snapped causing severe heat buildup in cooking bay. Immediate maintenance required.',
      onGroundChallenges: 'Kitchen staff reported delay in receiving spare V-belts from vendor.',
      correctiveActionRecommended: 'Issue urgent maintenance work order for Exhaust Unit #3 and replace grease filter tag.',
      ratingScore: 2
    },
    cryptoSignatureHash: '0x3341bba09118e901f4c71822e00192'
  },
  {
    id: 'AUD-2026-FM-092',
    assignmentId: 'ASG-2026-FM-002',
    certificateNumber: 'FC-COLLEGE-2026-FM002',
    venueId: 'FC-LOC-02',
    venueName: 'Campus FM Radio Station (90.4 MHz)',
    venueCode: 'FM-RAD-01',
    venueCategory: 'Media & Broadcasting',
    auditorName: 'Prof. Soundararajan',
    auditedByAuditeeName: 'RJ Anand, Station Coordinator',
    auditDate: '2026-07-28',
    timeSpentMinutes: 22.0,
    scannedQrMatched: true,
    scannedQrCode: 'QR-FC-FMRAD01-SECURE-11494120-77274890',
    liveGpsCoordinates: { lat: 11.494122, lng: 77.274892 },
    targetGpsCoordinates: { lat: 11.494120, lng: 77.274890 },
    gpsDistanceMeters: 1.8,
    isGeoFenceVerified: true,
    templateId: 'TMPL-BIT-FM-10',
    predefinedAnswers: {
      'BIT-FM-01': { questionId: 'BIT-FM-01', answer: 'YES', notes: 'Common areas, reception lounge, and studio hallways clean and neatly arranged.' },
      'BIT-FM-02': { questionId: 'BIT-FM-02', answer: 'YES', notes: 'CO2 & ABC fire extinguishers inspected, pressure in green zone, hydro-test tag valid till 2027.', photoProof: {
        id: 'P-FM-201',
        questionId: 'BIT-FM-02',
        photoUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
        caption: 'Inspected CO2 Fire Extinguisher in Transmitter Room with valid tag',
        timestamp: '2026-07-28 10:22:15',
        geoTag: { lat: 11.494122, lng: 77.274892 },
        issueCategory: 'Electrical'
      }},
      'BIT-FM-03': { questionId: 'BIT-FM-03', answer: 'YES', notes: 'Broadcast Online UPS battery working condition normal, 100% charged.' },
      'BIT-FM-04': { questionId: 'BIT-FM-04', answer: 'YES', notes: 'Transmitter room precision AC cooling temperature verified at 19.5°C.' },
      'BIT-FM-05': { questionId: 'BIT-FM-05', answer: 'YES', notes: 'Studio dimmable LED lights and acoustic exhaust fans operating properly.' },
      'BIT-FM-06': { questionId: 'BIT-FM-06', answer: 'YES', notes: '1kW RF Transmitter forward power 1000W, VSWR 1.05, 90.4 MHz carrier stable.', photoProof: {
        id: 'P-FM-202',
        questionId: 'BIT-FM-06',
        photoUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
        caption: 'Live 1kW FM Transmitter telemetry panel reading 90.400 MHz',
        timestamp: '2026-07-28 10:28:40',
        geoTag: { lat: 11.494122, lng: 77.274892 },
        issueCategory: 'Network'
      }},
      'BIT-FM-07': { questionId: 'BIT-FM-07', answer: 'YES', notes: 'Broadcast condenser mics disinfected, faders smooth, zero 50Hz hum.' },
      'BIT-FM-08': { questionId: 'BIT-FM-08', answer: 'YES', notes: 'Red ON-AIR door light relay lights up on live mic activation.' },
      'BIT-FM-09': { questionId: 'BIT-FM-09', answer: 'YES', notes: 'Studio monitor speakers, off-air tuner receiver, and digital playout logger verified.' },
      'BIT-FM-10': { questionId: 'BIT-FM-10', answer: 'YES', notes: 'WPC Spectrum License, SACFA clearance, and daily transmission logbook updated.' }
    },
    aiDynamicQuestions: [
      {
        id: 'AI-Q-FM-1',
        questionText: 'What is the precise RF Forward Power reading shown on the 90.4 MHz transmitter digital panel right now?',
        category: 'Spot Verification',
        options: ['250 Watts', '500 Watts', '1000 Watts', '1500 Watts'],
        correctOptionIndex: 2,
        userAnswerIndex: 2,
        isCorrect: true
      },
      {
        id: 'AI-Q-FM-2',
        questionText: 'What color is the anti-tamper seal on the CO2 fire extinguisher in the RF rack room?',
        category: 'Physical Inspection Spot-Check',
        options: ['Red Seal', 'Yellow Seal', 'Green Safety Tag', 'Blue Wire Seal'],
        correctOptionIndex: 2,
        userAnswerIndex: 2,
        isCorrect: true
      }
    ],
    authenticity: {
      overallScore: 98,
      isSelfApproved: true,
      gpsProximityScore: 100,
      dwellTimeScore: 96,
      photoAuthenticityScore: 97,
      aiDynamicCheckScore: 100,
      discrepancyFlags: [],
      reviewReason: 'High confidence. Physical presence verified inside 1.8m radius. All 10 FM station checkpoints passed.'
    },
    status: 'PASSED_SELF_APPROVED',
    auditorReviewNotes: 'Self-Approved by AI Authenticity Engine. Fitness Certificate FC-COLLEGE-2026-FM002 generated.',
    auditorFeedback: {
      overallSummary: 'Campus FM Radio Station (90.4 MHz) broadcast infrastructure, transmitter, UPS battery backup, and essential registers are operating at 100% compliance.',
      onGroundChallenges: 'None. Station technical crew presented all live WPC license logs.',
      correctiveActionRecommended: 'Routine bi-weekly inspection scheduled for August 12.',
      ratingScore: 5
    },
    cryptoSignatureHash: '0x99e8b11a77412c99a0021'
  }
];

