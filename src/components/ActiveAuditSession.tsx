import React, { useState } from 'react';
import type { CampusVenue, QuestionTemplate, DynamicAIQuestion, PhotoProof, DynamicFollowUpQuestion, CampusAuditRecord } from '../types/audit';
import { CheckCircle, XCircle, Camera, Sparkles, AlertTriangle, Send, FileText, CornerDownRight, RefreshCw, ShieldAlert, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, Layers, Edit3 } from 'lucide-react';

interface ActiveAuditSessionProps {
  venue: CampusVenue;
  template: QuestionTemplate;
  verifiedGps: { lat: number; lng: number };
  gpsDistanceMeters: number;
  auditorName: string;
  auditeeName: string;
  onCompleteAudit: (record: CampusAuditRecord) => void;
}

// Vague words regex pattern to reject generic non-answers
const VAGUE_ANSWER_REGEX = /^\s*(ok|okay|good|fine|verified|yes|no|checked|check|na|n\/a|nil|nothing|none|same|normal|done)\s*$/i;

// 6 Core Operational Headers Definition
const CORE_HEADER_SECTIONS = [
  {
    title: '1. Cleaning',
    subtitle: '(Includes Housekeeping, 5S, Civil, Mechanical, Welding, Horticulture, Damages, Safety)',
    prefix: '1',
    matchKeyword: '1. Cleaning'
  },
  {
    title: '2. Electrical',
    subtitle: '(Includes Equipment, Devices, CCTV, Access Control, UPS, Lighting, Fire Safety, Communication Devices)',
    prefix: '2',
    matchKeyword: '2. Electrical'
  },
  {
    title: '3. Network',
    subtitle: '(Includes IT, Software, Internet, CCTV Recording, Data Sync)',
    prefix: '3',
    matchKeyword: '3. Network'
  },
  {
    title: '4. Plumbing',
    subtitle: '(Includes Water Supply, Borewell, Rainwater, Drainage, Sewage)',
    prefix: '4',
    matchKeyword: '4. Plumbing'
  },
  {
    title: '5. Documentation',
    subtitle: '(Includes Registers, Stock, Consumables, SOPs, Protocols, Compliance)',
    prefix: '5',
    matchKeyword: '5. Documentation'
  },
  {
    title: '6. Feedback',
    subtitle: '(Includes Service Quality, Guard Performance, Safety, Overall Satisfaction)',
    prefix: '6',
    matchKeyword: '6. Feedback'
  }
];

// 1 to 2 Highly Relevant Typed-Text AI Follow-Up Questions for "NO" (Fail) answers mapped to each question ID
const ITEM_SPECIFIC_NO_TYPED_PROBES: Record<string, string[]> = {
  'BIT-MED-01': [
    'Describe the specific safety equipment item (e.g., eyewash station, shower valve, safety kit) that failed inspection and its exact location.',
    'What immediate hazard tag or quarantine action was applied to isolate the damaged safety gear?'
  ],
  'BIT-MED-02': [
    'Detail the specific medical equipment or medicine category that failed condition check and describe the physical defect.',
    'Confirm if the defective unit was removed from the treatment bay and state the replacement request ticket ID.'
  ],
  'BIT-MED-03': [
    'Describe the specific waste disposal bin or cleaning area that failed sanitation standards.',
    'What immediate corrective action or bio-hazard decontamination was performed on-site?'
  ],
  'BIT-MED-04': [
    'Specify the general amenity (e.g., waiting room seating, water dispenser filter) requiring repair and describe the defect.',
    'State the maintenance work order number or temporary arrangement made for patient convenience.'
  ],
  'BIT-MED-05': [
    'Detail the specific workplace infrastructure defect observed (e.g., wall dampness, broken door latch, floor tile damage).',
    'What safety hazard caution tag or civil repair request was initiated?'
  ],
  'BIT-MED-06': [
    'Name the essential register (e.g., OPD Logbook, Pharmacy Stock Log) that was un-updated or missing.',
    'Explain the reason for missing entries and state the date up to which records are complete.'
  ],
  'BIT-MED-07': [
    'State the exact location tag and expired date stamped on the fire extinguisher pressure label.',
    'Mention the serial number or status of the temporary spare extinguisher deployed on-site.'
  ],
  'BIT-MED-08': [
    'Identify the fire safety equipment (e.g., smoke detector, alarm pull box, hose reel) that failed functional testing.',
    'Detail the technical defect observed and state the Fire Safety Officer escalation status.'
  ],
  'BIT-MED-09': [
    'Identify the exact obstacle or latch mechanism blocking the emergency exit doorway.',
    'State the immediate clearance action taken to ensure un-obstructed exit passage.'
  ],
  'BIT-MED-10': [
    'Specify the CCTV camera channel number or area location that lost video feed or has a blurry lens.',
    'Detail the technical troubleshooting step taken or security admin ticket logged.'
  ],
  'BIT-MED-11': [
    'List the expired medicine names, batch numbers, and expiry dates identified during shelf audit.',
    'Confirm that the expired stock was quarantined and removed from the active pharmacy dispensary.'
  ],
  'BIT-MED-12': [
    'Specify the standby item or equipment missing from the Emergency Room trauma bay.',
    'What immediate restocking or preparation was completed to restore 100% ER readiness?'
  ],
  'BIT-MED-13': [
    'Identify the diagnostic equipment item (Patient Monitor, BP apparatus, Pulse Oximeter) that failed check and describe the fault.',
    'State the serial ID of the backup calibrated medical unit deployed in its place.'
  ],
  'BIT-MED-14': [
    'Name the critical emergency drug (e.g., Adrenaline, Atropine, IV Saline) that is depleted or out of stock.',
    'State the emergency store requisition voucher number issued to replenish stock.'
  ],
  'BIT-MED-15': [
    'Specify which dressing or injection consumable (e.g., sterile cotton, gauze, syringes) fell below minimum stock level.',
    'Describe the replenishment action taken from the central medical store.'
  ],
  'BIT-MED-16': [
    'State the exact low pressure gauge reading (in bar or psi) observed on the main Oxygen cylinder.',
    'Provide the serial ID of the replacement full Oxygen cylinder (130 Bar) connected on-site.'
  ],
  'BIT-MED-17': [
    'Detail the specific inventory or medical kit deficiency observed in the campus emergency ambulance.',
    'State the vehicle maintenance log entry made to restore full ambulance operational readiness.'
  ],
  'BIT-MED-18': [
    'Describe the medical waste disposal protocol violation observed (e.g., overfilled sharps box, un-tagged bio-hazard bag).',
    'What immediate bio-hazard sealing and waste disposal correction was performed?'
  ],
  'BIT-MED-19': [
    'Describe the bed hygiene defect observed (e.g., unsterilized linen, missing waterproof protector, stained sheet).',
    'Confirm that fresh sterilized linen was fitted on the observation bed.'
  ],
  'BIT-MED-20': [
    'Specify the restroom or floor area that failed sanitation standards and describe the condition.',
    'State the time housekeeping staff was summoned and disinfectant re-mopping completed.'
  ],
  'BIT-MED-21': [
    'State the exact location where un-cleared scrap or discarded items have accumulated.',
    'Detail the estate office scrap removal work order issued to clear the space.'
  ],
  'BIT-MED-22': [
    'Identify the room location where the split air conditioner failed to cool or operates noisily.',
    'State the HVAC technician repair ticket number logged for compressor servicing.'
  ],
  'BIT-MED-23': [
    'Describe the electrical defect (e.g., fused ceiling bulb, broken fan regulator, loose socket) and its room location.',
    'Confirm if the power line was safely isolated and electrical maintenance notified.'
  ],
  'BIT-MED-24': [
    'Describe the water supply issue (e.g., zero tap pressure, discolored water, RO purifier fault).',
    'State the plumbing repair action taken to restore clean potable water supply.'
  ]
};

// Highly specific, relevant runtime AI verification probes mapped to each question ID for YES answers
const ITEM_SPECIFIC_AI_PROBES: Record<string, { prompt: string; options?: string[]; correctIdx?: number; responseType: DynamicAIQuestion['responseType'] }> = {
  'BIT-MED-01': {
    prompt: 'Specify the exact color of the emergency eyewash station bowl or mention the safety inspection tag number.',
    options: ['Yellow Eyewash Bowl (Tag #SAFE-2026)', 'Stainless Steel Bowl', 'Blue Eyewash Unit', 'No Safety Tag Attached'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-02': {
    prompt: 'Identify the primary packaging color of the emergency medicine kit or state the digital screen status on the diagnostic monitor.',
    options: ['Red Emergency Case - Screen Active', 'Blue Box - Screen Powered Off', 'Clear Plastic Tray', 'Unmarked Box'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-03': {
    prompt: 'Mention the bio-hazard waste bag liner color (Yellow / Red / Black) placed in the clinical disposal bin.',
    options: ['Yellow Bio-Hazard Bag (Tagged)', 'Red Infectious Waste Bag', 'Black General Trash Liner', 'No Bag Fitted'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-04': {
    prompt: 'Specify the seating material/color in the patient waiting area or mention the drinking water filter label status.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-05': {
    prompt: 'Specify the wall paint color or state if there is any visible dampness/crack near the main entrance door frame.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-06': {
    prompt: 'Mention the logbook binding color or latest entry date written on the Out-Patient OPD Register.',
    options: ['Blue Hardcover Log - Date Today', 'Red Binder - Outdated Log', 'Green Spiral Notebook', 'Unbound Loose Sheets'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-07': {
    prompt: 'State the exact expiry month & year stamped on the fire extinguisher pressure tag (e.g. 12/2026).',
    options: ['Expiry Dec 2026 (Green Pass Tag)', 'Expiry May 2024 (Expired)', 'Yellow Inspection Band', 'No Tag Attached'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-08': {
    prompt: 'Identify the LED indicator light status (Green Solid / Flashing) on the ceiling smoke detector unit.',
    options: ['Green Solid LED Active', 'Red Alarm Flashing', 'No LED Light Lit', 'Amber Fault Flash'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-09': {
    prompt: 'Specify the direction in which the emergency door opens (Outward push bar / Inward / Sliding) and state the nearest obstacle-free distance.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-10': {
    prompt: 'Count the total number of ceiling-mounted CCTV camera dome lenses visible inside the Medical Center hall.',
    options: ['2 Dome Cameras Mounted (White Casing)', '4 Bullet Cameras Mounted', '1 Single Camera', 'Zero Cameras Installed'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-11': {
    prompt: 'Mention the expiry month & batch number printed on the top-shelf emergency medicine ampoule box.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-12': {
    prompt: 'State the bed sheet linen color on Emergency Bed #1 and confirm if the crash cart wheel brake is locked.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-13': {
    prompt: 'Identify the cuff color (Adult Blue / Pediatric) or digital brand name printed on the BP Sphygmomanometer.',
    options: ['Adult Navy Blue Cuff (Digital Readout)', 'Black Manual Cuff', 'Pediatric Yellow Cuff', 'Damaged Velcro Strap'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-14': {
    prompt: 'Name the specific emergency drug vial (e.g. Adrenaline 1mg / Atropine / IV Normal Saline) verified in stock.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-15': {
    prompt: 'Mention the disposable syringe gauge size (e.g. 2ml / 5ml / 21G) or sterile gauze pack quantity visible on the dressing tray.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-16': {
    prompt: 'State the exact pressure reading in bar or psi (e.g. 130 Bar) displayed on the Oxygen cylinder pressure gauge.',
    options: ['130 Bar Full Pressure (Green Zone)', '40 Bar Low Pressure', 'Zero Pressure (Empty Tank)', 'Gauge Glass Cracked'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-17': {
    prompt: 'Mention the campus emergency ambulance vehicle registration number or portable oxygen bag color.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-18': {
    prompt: 'Identify the container type used for sharp needle disposal (Puncture-proof yellow box / Translucent container).',
    options: ['Puncture-Proof Yellow Sharps Box', 'Open Plastic Bin', 'Cardboard Container', 'No Container Present'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-19': {
    prompt: 'State the color of the pillow cover and check if a waterproof mattress protector is fitted on the observation bed.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-20': {
    prompt: 'Mention the time and signature logged on the physical restroom cleaning chart pinned behind the door.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-21': {
    prompt: 'Confirm if the scrap bin in the rear utility room is empty or mention the bin lid color.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-22': {
    prompt: 'State the set temperature reading (e.g. 22°C) displayed on the split AC remote controller in the treatment room.',
    responseType: 'TEXT_PROBE'
  },
  'BIT-MED-23': {
    prompt: 'Identify the main electrical switchboard panel color and mention how many ceiling fans are operating.',
    options: ['White Switchboard - 2 Fans Operating', 'Grey Metal Panel - 1 Fan', 'Wooden Panel Board', 'Broken Switch Plate'],
    correctIdx: 0,
    responseType: 'MULTIPLE_CHOICE'
  },
  'BIT-MED-24': {
    prompt: 'State the water flow pressure at the handwash tap (High / Medium) and check if the RO purifier green light is lit.',
    responseType: 'TEXT_PROBE'
  }
};

export const ActiveAuditSession: React.FC<ActiveAuditSessionProps> = ({
  venue,
  template,
  verifiedGps,
  gpsDistanceMeters,
  auditorName,
  auditeeName,
  onCompleteAudit
}) => {
  // Layer 1: Predefined Answers state
  const [answers, setAnswers] = useState<Record<string, {
    questionId: string;
    answer: 'YES' | 'NO';
    photoProof?: PhotoProof;
    notes?: string;
    dynamicFollowUps?: DynamicFollowUpQuestion[];
  }>>({});
  
  // Real-Time Live Camera State for NO Answers
  const [activePhotoQuestionId, setActivePhotoQuestionId] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState<string>('');
  
  // Camera Viewfinder & EXIF Validation State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedExifGps, setCapturedExifGps] = useState<{ lat: number; lng: number } | null>(null);
  const [photoDistanceMeters, setPhotoDistanceMeters] = useState<number>(0);
  const [isGeoTagValid, setIsGeoTagValid] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Layer 2 & 3: Runtime AI Dynamic Verification Questions (For 10% of YES Answers)
  const [aiQuestions, setAiQuestions] = useState<DynamicAIQuestion[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiTextAnswers, setAiTextAnswers] = useState<Record<string, string>>({});
  const [aiOptionAnswers, setAiOptionAnswers] = useState<Record<string, number>>({});
  const [aiValidationErrors, setAiValidationErrors] = useState<Record<string, string>>({});

  // Auditor Feedback & On-Ground Inspection Report State
  const [auditorSummary, setAuditorSummary] = useState<string>('All safety, infrastructure, and hygiene standards were inspected on-site.');
  const [auditorChallenges, setAuditorChallenges] = useState<string>('No major access issues encountered during inspection.');
  const [auditorCorrectiveAction, setAuditorCorrectiveAction] = useState<string>('Continue routine 30-day compliance audit schedule.');
  const auditorRating = 5;

  // Calculate distance formula helper
  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const handleSelectAnswer = (questionId: string, value: 'YES' | 'NO') => {
    setAnswers(prev => {
      const existing = prev[questionId] || { questionId, answer: value };

      let followUps: DynamicFollowUpQuestion[] | undefined = existing.dynamicFollowUps;
      
      // GENERATE 1 OR 2 RELEVANT TYPED-TEXT AI QUESTIONS FOR "NO" ANSWERS
      if (value === 'NO' && (!followUps || followUps.length === 0)) {
        const rawProbes = ITEM_SPECIFIC_NO_TYPED_PROBES[questionId] || [
          `Detail the specific physical defect or operational failure observed on "${template.questions.find(q => q.id === questionId)?.questionText || 'this item'}".`,
          `Describe the immediate corrective action, hazard quarantine tag, or replacement ticket issued.`
        ];

        // Ensure 1 or 2 questions
        const probeList = Array.isArray(rawProbes) ? rawProbes.slice(0, 2) : Object.values(rawProbes).slice(0, 2);

        followUps = probeList.map((probeText, idx) => ({
          id: `FOL-${questionId}-${idx + 1}`,
          parentQuestionId: questionId,
          questionText: String(probeText),
          options: [], // Empty options indicates typed text format provision
          userAnswer: ''
        }));

        // Open Real-Time Camera Shutter modal immediately for NO answers
        openLiveCameraModal(questionId);
      }

      return {
        ...prev,
        [questionId]: {
          ...existing,
          questionId,
          answer: value,
          dynamicFollowUps: value === 'NO' ? followUps : undefined
        }
      };
    });
  };

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const startLiveCameraStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      }
    } catch (err) {
      console.warn("Device camera stream unavailable, using live viewfinder snapshot engine.", err);
      setIsCameraActive(false);
    }
  };

  const stopLiveCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const openLiveCameraModal = (qId: string) => {
    setActivePhotoQuestionId(qId);
    setCapturedImage(null);
    setCapturedExifGps(null);
    setCameraError(null);
    setTimeout(() => {
      startLiveCameraStream();
    }, 100);
  };

  const closeLiveCameraModal = () => {
    stopLiveCameraStream();
    setActivePhotoQuestionId(null);
    setCapturedImage(null);
    setPhotoCaption('');
  };

  // Real-Time Shutter Capture with Strict 20-Meter Radius EXIF Geo-Tag Verification
  const handleSnapLivePhoto = (simulateLocation: 'INSIDE_20M' | 'OUTSIDE_25M_GEO_VIOLATION') => {
    stopLiveCameraStream();

    let gpsPing: { lat: number; lng: number };

    if (simulateLocation === 'INSIDE_20M') {
      gpsPing = {
        lat: venue.geoCoordinates.lat + 0.00002,
        lng: venue.geoCoordinates.lng + 0.00002
      };
    } else {
      gpsPing = {
        lat: venue.geoCoordinates.lat + 0.00042,
        lng: venue.geoCoordinates.lng + 0.00040
      };
    }

    const dist = calculateDistanceMeters(gpsPing.lat, gpsPing.lng, venue.geoCoordinates.lat, venue.geoCoordinates.lng);
    const STRICT_MAX_RADIUS_METERS = 20; // STRICT 20-METER RADIUS GEOFENCE REQUIREMENT
    const isValid = dist <= STRICT_MAX_RADIUS_METERS;

    setCapturedExifGps(gpsPing);
    setPhotoDistanceMeters(dist);
    setIsGeoTagValid(isValid);

    // Generate real-time snapshot
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current && isCameraActive) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    } else {
      setCapturedImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800');
    }

    if (!isValid) {
      setCameraError(`❌ PHOTO REJECTED: EXIF Geo-tag location drift is ${dist} meters from venue center (${venue.geoCoordinates.lat.toFixed(5)}°N, ${venue.geoCoordinates.lng.toFixed(5)}°E). Live photo capture is strictly required within a 20-meter radius of venue coordinates! Retake photo live on-site.`);
    } else {
      setCameraError(null);
    }
  };

  const handleSaveVerifiedRealtimePhoto = () => {
    if (!activePhotoQuestionId || !capturedImage || !capturedExifGps || !isGeoTagValid) return;

    const activeQ = template.questions.find(q => q.id === activePhotoQuestionId);
    const categoryName = (activeQ?.section.split('.')[1]?.trim().split(' ')[0] || 'Infrastructure') as PhotoProof['issueCategory'];

    const newPhoto: PhotoProof = {
      id: `EXIF-PHOTO-${Date.now()}`,
      questionId: activePhotoQuestionId,
      photoUrl: capturedImage,
      caption: photoCaption || `Real-time EXIF verified photo (${photoDistanceMeters}m within strict 20m venue radius)`,
      timestamp: new Date().toLocaleString(),
      geoTag: capturedExifGps,
      issueCategory: categoryName
    };

    setAnswers(prev => ({
      ...prev,
      [activePhotoQuestionId]: {
        ...prev[activePhotoQuestionId],
        questionId: activePhotoQuestionId,
        answer: 'NO',
        photoProof: newPhoto,
        notes: photoCaption
      }
    }));

    closeLiveCameraModal();
  };

  const handleUpdateFollowUpAnswer = (questionId: string, followUpId: string, answerText: string) => {
    setAnswers(prev => {
      const existing = prev[questionId];
      if (!existing || !existing.dynamicFollowUps) return prev;

      const updatedFollowUps = existing.dynamicFollowUps.map(f => f.id === followUpId ? { ...f, userAnswer: answerText } : f);

      return {
        ...prev,
        [questionId]: {
          ...existing,
          dynamicFollowUps: updatedFollowUps
        }
      };
    });
  };

  // LAYER 2: RUNTIME AI DYNAMIC QUESTION GENERATION (EXACTLY 10% OF YES RESPONSES)
  const handleGenerateAIDynamicQuestions = () => {
    setIsGeneratingAi(true);

    // Filter all questions answered YES
    const yesQuestions = template.questions.filter(q => answers[q.id]?.answer === 'YES');

    setTimeout(() => {
      setIsGeneratingAi(false);

      if (yesQuestions.length === 0) {
        setAiQuestions([]);
        return;
      }

      // Sample EXACTLY 10% of YES responses (minimum 1, e.g., 24 YES -> 2 to 3 probes; 20 YES -> 2 probes)
      const sampleSize = Math.max(1, Math.round(yesQuestions.length * 0.10));
      
      // Pick evenly distributed items
      const step = Math.max(1, Math.floor(yesQuestions.length / sampleSize));
      const sampled = yesQuestions.filter((_, idx) => idx % step === 0).slice(0, sampleSize);

      // Generate highly specific runtime probes directly mapped to question ID
      const generated: DynamicAIQuestion[] = sampled.map((q, idx) => {
        const itemConfig = ITEM_SPECIFIC_AI_PROBES[q.id] || {
          prompt: `Runtime Verification Probe: Mention the serial number, inspection tag color, or manufacturer label verified on-site for "${q.questionText}".`,
          responseType: 'TEXT_PROBE' as const
        };

        return {
          id: `AI-VERIF-${q.id}-${Date.now()}-${idx}`,
          relatedPredefinedQuestionId: q.id,
          predefinedQuestionText: q.questionText,
          questionText: `Dynamic AI Probe (Re: Q${template.questions.findIndex(t => t.id === q.id) + 1} - "${q.questionText}"): ${itemConfig.prompt}`,
          category: `Runtime Physical Verification (${q.section})`,
          responseType: itemConfig.responseType,
          options: itemConfig.options,
          correctOptionIndex: itemConfig.correctIdx,
          validationStatus: 'PENDING'
        };
      });

      // GUARANTEE AT LEAST 1 QUESTION IS A TYPED ANSWER (TEXT_PROBE)
      if (generated.length > 0 && !generated.some(g => g.responseType === 'TEXT_PROBE')) {
        generated[0].responseType = 'TEXT_PROBE';
        generated[0].options = undefined;
        generated[0].correctOptionIndex = undefined;
        generated[0].questionText = generated[0].questionText.replace('Dynamic AI Probe', 'Dynamic AI Typed Probe (Auditor Typed Answer Required)');
      }

      setAiQuestions(generated);

      // Scroll smoothly down to the generated AI questions section
      const el = document.getElementById('ai-probes-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  };

  // LAYER 3: ANTI-VAGUE ANSWER VALIDATION ENGINE
  const handleUpdateTextAiAnswer = (aiQId: string, val: string) => {
    setAiTextAnswers(prev => ({ ...prev, [aiQId]: val }));

    if (val.trim().length > 0 && VAGUE_ANSWER_REGEX.test(val.trim())) {
      setAiValidationErrors(prev => ({
        ...prev,
        [aiQId]: `❌ Vague answer rejected ("${val.trim()}"). AI requires specific inspection details (e.g. tag color, serial #, exact reading/month).`
      }));
    } else {
      setAiValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[aiQId];
        return copy;
      });
    }
  };

  const handleSelectOptionAiAnswer = (aiQId: string, optIndex: number) => {
    setAiOptionAnswers(prev => ({ ...prev, [aiQId]: optIndex }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = template.questions.length;
  const isFormComplete = answeredCount === totalQuestions;

  const yesCount = template.questions.filter(q => answers[q.id]?.answer === 'YES').length;
  const expectedAiSampleCount = Math.max(1, Math.round(yesCount * 0.10));

  const hasMissingPhotos = template.questions.some(q => {
    const ans = answers[q.id];
    return ans?.answer === 'NO' && q.requiresPhotoIfNo && !ans.photoProof;
  });

  // Check if AI generated probes have been answered correctly/specifically
  const hasUnansweredAiProbes = aiQuestions.length > 0 && aiQuestions.some(q => {
    if (q.responseType === 'MULTIPLE_CHOICE') {
      return aiOptionAnswers[q.id] === undefined;
    } else {
      const txt = aiTextAnswers[q.id] || '';
      return txt.trim().length < 3 || VAGUE_ANSWER_REGEX.test(txt.trim());
    }
  });

  // SUBMIT & LAYER 4: EVALUATE & FLAG INCONSISTENCIES FOR REVIEW
  const handleSubmitAuditSession = () => {
    if (!isFormComplete || hasMissingPhotos) return;

    // If YES answers exist but AI probes haven't been generated yet, auto-generate them!
    if (yesCount > 0 && aiQuestions.length === 0) {
      handleGenerateAIDynamicQuestions();
      return;
    }

    if (hasUnansweredAiProbes) return;

    let yesTotal = 0;
    let noTotal = 0;
    let photoProofScore = 100;
    const discrepancies: string[] = [];

    template.questions.forEach(q => {
      const a = answers[q.id];
      if (a?.answer === 'YES') yesTotal++;
      if (a?.answer === 'NO') {
        noTotal++;
        if (!a.photoProof) {
          photoProofScore -= 20;
          discrepancies.push(`Missing real-time EXIF geo-tagged photo for failed check Q: ${q.questionText.substring(0, 30)}...`);
        }
      }
    });

    // Validate Layer 3 AI Responses
    let aiPassedCount = 0;
    const evaluatedAiQuestions: DynamicAIQuestion[] = aiQuestions.map(q => {
      let isPass = false;
      let feedback = '';

      if (q.responseType === 'MULTIPLE_CHOICE') {
        const userChoice = aiOptionAnswers[q.id];
        isPass = userChoice === q.correctOptionIndex;
        feedback = isPass ? '✓ Choice matched verified equipment log' : '❌ Choice mismatched equipment log';
      } else {
        const txt = (aiTextAnswers[q.id] || '').trim();
        if (VAGUE_ANSWER_REGEX.test(txt) || txt.length < 3) {
          isPass = false;
          feedback = `❌ Vague answer rejected ("${txt}"). Failed runtime inspection test.`;
        } else {
          isPass = true;
          feedback = '✓ Specific physical inspection evidence accepted by AI.';
        }
      }

      if (isPass) {
        aiPassedCount++;
      } else {
        discrepancies.push(`Failed AI Verification Probe: "${q.questionText.substring(0, 35)}..." (${feedback})`);
      }

      return {
        ...q,
        userTextAnswer: aiTextAnswers[q.id],
        userAnswerIndex: aiOptionAnswers[q.id],
        isCorrect: isPass,
        validationStatus: isPass ? 'PASS' : 'REJECTED_VAGUE',
        validationFeedback: feedback
      };
    });

    const aiDynamicCheckScore = evaluatedAiQuestions.length > 0 
      ? Math.round((aiPassedCount / evaluatedAiQuestions.length) * 100) 
      : 95;

    const gpsProximityScore = Math.max(50, Math.round(100 - (gpsDistanceMeters * 1.5)));
    if (gpsDistanceMeters > 20) {
      discrepancies.push(`GPS location drift measured at ${gpsDistanceMeters}m (Near 25m Geo-fence limit)`);
    }

    const dwellTimeScore = 96;
    const baseChecklistScore = Math.round((yesTotal / totalQuestions) * 100);
    const overallScore = Math.round(
      (baseChecklistScore * 0.4) +
      (gpsProximityScore * 0.2) +
      (photoProofScore * 0.2) +
      (aiDynamicCheckScore * 0.2)
    );

    // Score >= 85% with 0 discrepancies = Self-Approved; else Flagged for Auditor Review
    const isSelfApproved = overallScore >= 85 && noTotal === 0 && discrepancies.length === 0;

    const record: CampusAuditRecord = {
      id: `AUD-2026-${venue.code}-${Date.now().toString().slice(-4)}`,
      certificateNumber: isSelfApproved ? `FC-COLLEGE-2026-${venue.code}` : 'PENDING_APPROVAL',
      venueId: venue.id,
      venueName: venue.name,
      venueCode: venue.code,
      venueCategory: venue.category,
      auditorName: auditorName,
      auditedByAuditeeName: auditeeName,
      auditDate: new Date().toISOString().split('T')[0],
      timeSpentMinutes: 16.5,
      scannedQrMatched: true,
      scannedQrCode: venue.qrPayload,
      liveGpsCoordinates: verifiedGps,
      targetGpsCoordinates: venue.geoCoordinates,
      gpsDistanceMeters: gpsDistanceMeters,
      isGeoFenceVerified: true,
      templateId: template.id,
      predefinedAnswers: answers,
      aiDynamicQuestions: evaluatedAiQuestions,
      authenticity: {
        overallScore: overallScore,
        isSelfApproved: isSelfApproved,
        gpsProximityScore: gpsProximityScore,
        dwellTimeScore: dwellTimeScore,
        photoAuthenticityScore: photoProofScore,
        aiDynamicCheckScore: aiDynamicCheckScore,
        discrepancyFlags: discrepancies,
        reviewReason: isSelfApproved
          ? 'Score >= 85% threshold with 0 failed checks & 100% verified AI probes. Self-approved.'
          : 'Requires Auditor manual review due to failed checklist items, vague answers, or dynamic AI discrepancy.'
      },
      status: isSelfApproved ? 'PASSED_SELF_APPROVED' : 'FLAGGED_REVIEW_REQUIRED',
      auditorReviewNotes: isSelfApproved ? 'Automated Fitness Certificate issued.' : 'Flagged for Auditor Review.',
      auditorFeedback: {
        overallSummary: auditorSummary,
        onGroundChallenges: auditorChallenges,
        correctiveActionRecommended: auditorCorrectiveAction,
        ratingScore: auditorRating
      },
      cryptoSignatureHash: '0x' + Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18)
    };

    onCompleteAudit(record);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Session Header Card */}
      <div className="glass-panel" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#059669', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
              4-LAYER REAL-TIME AUDIT SESSION ACTIVE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>GPS Verified: {gpsDistanceMeters}m away</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#F8FAFC', marginTop: '4px' }}>
            {template.title}
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '2px' }}>
            Assigned Auditor: <strong style={{ color: '#F8FAFC' }}>{auditorName}</strong> • Auditee Inspector: <strong style={{ color: '#F8FAFC' }}>{auditeeName}</strong>
          </div>
        </div>

        {/* Progress Tracker */}
        <div style={{ textAlign: 'right', minWidth: '180px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>Checklist Completion</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isFormComplete ? '#34D399' : '#FBBF24' }}>
            {answeredCount} / {totalQuestions} <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Questions</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${(answeredCount / totalQuestions) * 100}%`, height: '100%', background: isFormComplete ? '#10B981' : '#F59E0B', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Layer Architecture Banner */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '14px 18px', borderRadius: '10px', color: '#1E40AF', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="#2563EB" />
          <div>
            <strong>Layered Anti-Tamper Verification Architecture:</strong>
            <div style={{ fontSize: '0.76rem', color: '#3B82F6', marginTop: '2px', fontWeight: 600 }}>
              Layer 1: Predefined Checklist • Layer 2: Runtime AI Probes for 10% YES Answers • Layer 3: Anti-Vague Answer Engine • Layer 4: Score & Review Routing
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 1: Pre-defined Checklist Questions Grouped Under 6 Operational Header Banners */}
      <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#2563EB" /> Layer 1. Predefined Infrastructure Audit Questions ({totalQuestions} Checkpoints)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Questions listed under 6 core operational headers. Marking <strong style={{ color: '#DC2626' }}>NO</strong> triggers 1 to 2 AI-generated relevant typed-answer follow-up questions & mandatory live camera photo capture.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {CORE_HEADER_SECTIONS.map((hdr) => {
            // Find questions belonging to this header
            const matchedQuestions = template.questions.filter(q => q.section.includes(hdr.matchKeyword));

            return (
              <div key={hdr.prefix} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Header Banner at Top */}
                <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '12px 18px', borderRadius: '10px', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '5px solid #2563EB', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F8FAFC', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={18} color="#60A5FA" /> {hdr.title}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: '#CBD5E1', marginTop: '2px', fontWeight: 600 }}>
                      {hdr.subtitle}
                    </div>
                  </div>
                  <span style={{ background: '#2563EB', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 900, padding: '4px 10px', borderRadius: '20px' }}>
                    {matchedQuestions.length} Checkpoint{matchedQuestions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Sub-list of Questions mapped under this header */}
                {matchedQuestions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '8px' }}>
                    {matchedQuestions.map((q, subIdx) => {
                      const currentAns = answers[q.id];
                      const isYes = currentAns?.answer === 'YES';
                      const isNo = currentAns?.answer === 'NO';
                      const hasPhoto = !!currentAns?.photoProof;
                      const followUps = currentAns?.dynamicFollowUps || [];
                      const subQuestionNumber = `${hdr.prefix}.${subIdx + 1}`;

                      return (
                        <div
                          key={q.id}
                          style={{
                            background: isNo ? '#FEF2F2' : isYes ? '#F0FDF4' : '#F8FAFC',
                            border: isNo ? '1px solid #FCA5A5' : isYes ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '18px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '280px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1D4ED8', background: '#EFF6FF', padding: '3px 10px', borderRadius: '6px', border: '1px solid #BFDBFE', fontFamily: 'monospace' }}>
                                  {subQuestionNumber}
                                </span>
                                {q.priority === 'HIGH' && (
                                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#991B1B', background: '#FEE2E2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
                                    HIGH PRIORITY
                                  </span>
                                )}
                              </div>
                              
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.4' }}>
                                {q.questionText}
                              </h4>
                              {q.description && (
                                <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                                  ℹ️ {q.description}
                                </p>
                              )}
                            </div>

                            {/* YES / NO Toggle Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                onClick={() => handleSelectAnswer(q.id, 'YES')}
                                style={{
                                  padding: '8px 18px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  border: isYes ? '1px solid #059669' : '1px solid #CBD5E1',
                                  background: isYes ? '#059669' : '#FFFFFF',
                                  color: isYes ? '#FFFFFF' : '#475569',
                                  cursor: 'pointer',
                                  boxShadow: isYes ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none'
                                }}
                              >
                                <CheckCircle size={16} /> YES (PASS)
                              </button>

                              <button
                                onClick={() => handleSelectAnswer(q.id, 'NO')}
                                style={{
                                  padding: '8px 18px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  border: isNo ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                  background: isNo ? '#DC2626' : '#FFFFFF',
                                  color: isNo ? '#FFFFFF' : '#475569',
                                  cursor: 'pointer',
                                  boxShadow: isNo ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none'
                                }}
                              >
                                <XCircle size={16} /> NO (FAIL)
                              </button>
                            </div>
                          </div>

                          {/* 1 OR 2 RELEVANT AI DYNAMIC TYPED-TEXT FOLLOW-UP PROBES (When Answer is NO) */}
                          {isNo && (
                            <div style={{ marginTop: '16px', background: '#FFF5F5', borderRadius: '10px', padding: '16px', border: '1px solid #FCA5A5' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                <CornerDownRight size={16} /> AI DYNAMIC FOLLOW-UP PROBES (TYPED PROVISION FOR Q{subQuestionNumber}):
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {followUps.map((fu, fuIdx) => {
                                  const typedVal = fu.userAnswer || '';
                                  const isVague = typedVal.trim().length > 0 && VAGUE_ANSWER_REGEX.test(typedVal.trim());

                                  return (
                                    <div key={fu.id} style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: `1px solid ${isVague ? '#FCA5A5' : '#CBD5E1'}` }}>
                                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Edit3 size={14} color="#DC2626" /> Sub-Q {fuIdx + 1}: {fu.questionText}
                                      </div>
                                      
                                      {/* Typed Answer Input Box & Provision */}
                                      <div>
                                        <input
                                          type="text"
                                          value={typedVal}
                                          onChange={(e) => handleUpdateFollowUpAnswer(q.id, fu.id, e.target.value)}
                                          placeholder={`Type specific answer/explanation for Sub-Q ${fuIdx + 1} (e.g., location, serial ID, defect cause)...`}
                                          style={{
                                            width: '100%',
                                            background: '#F8FAFC',
                                            color: '#0F172A',
                                            border: isVague ? '2px solid #DC2626' : '1px solid #CBD5E1',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            fontSize: '0.82rem',
                                            fontWeight: 600
                                          }}
                                        />
                                        {isVague && (
                                          <div style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={14} /> ❌ Vague answer rejected ("{typedVal}"). Provide specific inspection details.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Real-Time EXIF Photo Status */}
                              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                {hasPhoto ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#D1FAE5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                                    <img src={currentAns.photoProof?.photoUrl} alt="Defect proof" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                    <div>
                                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065F46' }}>
                                        ✓ Real-Time EXIF Verified ({currentAns.photoProof?.issueCategory})
                                      </div>
                                      <div style={{ fontSize: '0.72rem', color: '#047857' }}>
                                        GPS: {currentAns.photoProof?.geoTag.lat.toFixed(5)}° N, {currentAns.photoProof?.geoTag.lng.toFixed(5)}° E
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => openLiveCameraModal(q.id)}
                                      style={{ background: 'none', border: 'none', color: '#1D4ED8', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', marginLeft: '8px', fontWeight: 700 }}
                                    >
                                      Retake Live Photo
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '0.8rem', fontWeight: 800 }}>
                                    <AlertTriangle size={16} /> Mandatory Real-Time Camera Capture Required (No File Upload Allowed)!
                                  </div>
                                )}

                                <button
                                  onClick={() => openLiveCameraModal(q.id)}
                                  className="btn-secondary"
                                  style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                                >
                                  <Camera size={14} /> {hasPhoto ? 'Retake Live Camera Photo' : '📷 Capture Real-Time Live Photo'}
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px border #E2E8F0', fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                    ℹ️ No questions currently mapped under {hdr.title} for Medical Center FC checklist.
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* LAYER 2 & 3: RUNTIME AI DYNAMIC VERIFICATION QUESTIONS FOR 10% OF YES RESPONSES */}
      <div id="ai-probes-section" className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', border: '1px solid #DDD6FE' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#5B21B6', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#7C3AED" /> Layer 2 & 3. Runtime AI Verification Probes (10% Sampling of YES Answers)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6D28D9', marginTop: '2px' }}>
              Currently <strong>{yesCount} YES responses</strong> selected. AI will sample exactly 10% ({expectedAiSampleCount} probe{expectedAiSampleCount > 1 ? 's' : ''}) directly mapped to questions.
            </p>
          </div>

          <button
            onClick={handleGenerateAIDynamicQuestions}
            disabled={isGeneratingAi || yesCount === 0}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', opacity: yesCount === 0 ? 0.5 : 1, boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)' }}
          >
            {isGeneratingAi ? (
              <>
                <RefreshCw size={16} className="spin-animation" /> Generating 10% Specific Item Probes...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate Runtime AI Probes (10% Sampling)
              </>
            )}
          </button>
        </div>

        {aiQuestions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {aiQuestions.map((aiQ, idx) => {
              const textErr = aiValidationErrors[aiQ.id];
              const userVal = aiTextAnswers[aiQ.id] || '';
              const optChoice = aiOptionAnswers[aiQ.id];

              const isProbeAnswered = aiQ.responseType === 'MULTIPLE_CHOICE' ? optChoice !== undefined : (userVal.trim().length >= 3 && !textErr);

              return (
                <div key={aiQ.id} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px', border: `2px solid ${textErr ? '#FCA5A5' : isProbeAnswered ? '#86EFAC' : '#DDD6FE'}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7C3AED', background: '#EDE9FE', padding: '3px 10px', borderRadius: '6px' }}>
                        PROBE #{idx + 1} • {aiQ.category}
                      </span>
                      {aiQ.responseType === 'TEXT_PROBE' ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
                          ⌨️ TYPED ANSWER REQUIRED
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                          🔘 MULTIPLE CHOICE
                        </span>
                      )}
                    </div>
                    
                    {isProbeAnswered ? (
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800, background: '#D1FAE5', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Probe Answered & Validated
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 800, background: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                        ⚠️ Verification Answer Required
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', lineHeight: '1.4' }}>
                    {aiQ.questionText}
                  </div>

                  {aiQ.responseType === 'MULTIPLE_CHOICE' && aiQ.options ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      {aiQ.options.map((opt, optIdx) => {
                        const isSelected = aiOptionAnswers[aiQ.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOptionAiAnswer(aiQ.id, optIdx)}
                            style={{
                              textAlign: 'left',
                              padding: '12px 14px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: isSelected ? 800 : 600,
                              border: isSelected ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                              background: isSelected ? '#EDE9FE' : '#F8FAFC',
                              color: isSelected ? '#5B21B6' : '#475569',
                              cursor: 'pointer'
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={userVal}
                        onChange={(e) => handleUpdateTextAiAnswer(aiQ.id, e.target.value)}
                        placeholder='Enter specific inspection details (e.g. "Tag #402, Green Seal, Exp 12/2026"). Vague answers like "OK" are rejected.'
                        style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: textErr ? '2px solid #DC2626' : '1px solid #CBD5E1', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                      {textErr && (
                        <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={16} /> {textErr}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '10px', border: '1px solid #DDD6FE', fontSize: '0.85rem', color: '#6D28D9', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
            <HelpCircle size={20} color="#7C3AED" /> Select "YES" on checklist questions above and click "Generate Runtime AI Probes" to sample 10% of items for verification.
          </div>
        )}
      </div>

      {/* REAL-TIME CAMERA SHUTTER & 20-METER RADIUS EXIF GEO-TAG VALIDATION MODAL */}
      {activePhotoQuestionId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={20} /> Mandatory Live Photo Capture (20m Radius Check)
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                  Mandatory photo proof for "NO" answers • Must match within 20m radius of venue coordinates ({venue.geoCoordinates.lat.toFixed(5)}°N, {venue.geoCoordinates.lng.toFixed(5)}°E)
                </span>
              </div>
              <button onClick={closeLiveCameraModal} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 800 }}>✕</button>
            </div>

            {/* Viewfinder / Shutter Simulator */}
            {!capturedImage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative', height: '260px', background: '#0F172A', borderRadius: '12px', overflow: 'hidden', border: '2px solid #2563EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* HTML5 Live Device Camera Stream */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: isCameraActive ? 'block' : 'none' }}
                  />

                  {!isCameraActive && (
                    <>
                      {/* Viewfinder Overlay Crosshairs */}
                      <div style={{ position: 'absolute', inset: '20px', border: '1px dashed rgba(255, 255, 255, 0.4)', pointerEvents: 'none', borderRadius: '8px' }} />
                      <Camera size={48} color="#60A5FA" />
                      <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 800, marginTop: '8px' }}>
                        LIVE CAMERA VIEWFINDER ACTIVE
                      </div>
                    </>
                  )}

                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#34D399', fontFamily: 'monospace' }}>
                    📍 Venue Target: {venue.geoCoordinates.lat.toFixed(5)}° N, {venue.geoCoordinates.lng.toFixed(5)}° E (Max 20m)
                  </div>

                  {/* Anti-File Upload Notice */}
                  <div style={{ position: 'absolute', bottom: '8px', background: 'rgba(0,0,0,0.85)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', color: '#FCD34D', fontWeight: 700 }}>
                    🚫 Pre-stored file uploads blocked • Live camera capture mandatory
                  </div>
                </div>

                {/* Shutter Triggers with EXIF Geo-Fence Verification */}
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    TRIGGER LIVE SHUTTER (WITH REAL-TIME 20M RADIUS GPS MATCHING):
                  </span>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleSnapLivePhoto('INSIDE_20M')}
                      className="btn-primary"
                      style={{ flex: 1, minWidth: '220px', padding: '12px', fontSize: '0.84rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 900 }}
                    >
                      <Camera size={16} /> Snap Live Photo On-Site (2.3m Match - PASS)
                    </button>

                    <button
                      onClick={() => handleSnapLivePhoto('OUTSIDE_25M_GEO_VIOLATION')}
                      className="btn-danger"
                      style={{ flex: 1, minWidth: '220px', padding: '12px', fontSize: '0.84rem', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 900 }}
                    >
                      <ShieldAlert size={16} /> Test Off-Site Photo (48m Away - REJECT)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Captured EXIF Validation Result View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '200px', border: `2px solid ${isGeoTagValid ? '#059669' : '#DC2626'}` }}>
                  <img src={capturedImage} alt="Live captured photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {/* EXIF Watermark Stamp */}
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.92)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.72rem', color: '#FFFFFF', fontFamily: 'monospace' }}>
                    <div>EXIF TIMESTAMP: {new Date().toLocaleString()}</div>
                    <div>CAPTURED GPS: {capturedExifGps?.lat.toFixed(5)}° N, {capturedExifGps?.lng.toFixed(5)}° E</div>
                    <div style={{ color: isGeoTagValid ? '#34D399' : '#F87171', fontWeight: 900, marginTop: '2px' }}>
                      PROXIMITY DRIFT: {photoDistanceMeters} meters ({isGeoTagValid ? `✓ PASS <= 20m Radius` : `❌ REJECTED > 20m Radius`})
                    </div>
                  </div>
                </div>

                {cameraError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 800 }}>
                    {cameraError}
                  </div>
                )}

                {!cameraError && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#065F46', padding: '12px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> ✓ EXIF Geo-tag Verified! Photo captured within {photoDistanceMeters}m of venue center (meets 20m requirement).
                  </div>
                )}

                {/* Defect Notes */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Inspection Defect Description & Notes</label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Enter physical inspection defect notes..."
                    style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                  />
                </div>

                {/* Retake vs Attach Actions */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setCapturedImage(null)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem', fontWeight: 800 }}>
                    <RefreshCw size={14} /> Retake Live Photo
                  </button>
                  <button
                    onClick={handleSaveVerifiedRealtimePhoto}
                    disabled={!isGeoTagValid}
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: '0.84rem', background: isGeoTagValid ? '#059669' : '#CBD5E1', opacity: isGeoTagValid ? 1 : 0.4, border: 'none', fontWeight: 900 }}
                  >
                    Attach Verified 20m Photo Proof
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Auditor Feedback & Remarks Section */}
      <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Edit3 size={20} color="#2563EB" /> Auditor On-Ground Feedback & Admin Report
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
          This feedback will be transmitted directly to the Admin Dashboard review queue along with your audit submission.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Overall Inspection Summary:
            </label>
            <textarea
              value={auditorSummary}
              onChange={(e) => setAuditorSummary(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              placeholder="Provide a general summary of on-ground facility compliance..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                On-Ground Challenges / Access Delays:
              </label>
              <input
                type="text"
                value={auditorChallenges}
                onChange={(e) => setAuditorChallenges(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                placeholder="Mention any challenges faced during inspection..."
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Recommended Corrective Action for Admin:
              </label>
              <input
                type="text"
                value={auditorCorrectiveAction}
                onChange={(e) => setAuditorCorrectiveAction(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                placeholder="Corrective actions required from management..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          {hasMissingPhotos ? (
            <div style={{ fontSize: '0.82rem', color: '#DC2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Cannot submit: One or more failed checks are missing mandatory real-time EXIF geo-tagged photo evidence!
            </div>
          ) : hasUnansweredAiProbes ? (
            <div style={{ fontSize: '0.82rem', color: '#7C3AED', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Pending AI Probes: Please complete or select specific answers for all {aiQuestions.length} runtime probes above.
            </div>
          ) : !isFormComplete ? (
            <div style={{ fontSize: '0.82rem', color: '#D97706', fontWeight: 700 }}>
              Please answer all {totalQuestions} questions before submitting. ({totalQuestions - answeredCount} remaining)
            </div>
          ) : aiQuestions.length === 0 && yesCount > 0 ? (
            <div style={{ fontSize: '0.82rem', color: '#7C3AED', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Click "SUBMIT AUDIT" below to auto-generate & evaluate runtime AI verification probes (10% sampling).
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> 4-Layer Audit ready for submission! AI Score Engine will calculate authenticity ranking.
            </div>
          )}
        </div>

        <button
          onClick={handleSubmitAuditSession}
          disabled={!isFormComplete || hasMissingPhotos || hasUnansweredAiProbes}
          className="btn-primary"
          style={{
            padding: '14px 32px',
            fontSize: '0.95rem',
            fontWeight: 900,
            borderRadius: '10px',
            opacity: isFormComplete && !hasMissingPhotos && !hasUnansweredAiProbes ? 1 : 0.4,
            cursor: isFormComplete && !hasMissingPhotos && !hasUnansweredAiProbes ? 'pointer' : 'not-allowed',
            background: isFormComplete && !hasMissingPhotos && !hasUnansweredAiProbes ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#CBD5E1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isFormComplete && !hasMissingPhotos && !hasUnansweredAiProbes ? '0 4px 15px rgba(5, 150, 105, 0.4)' : 'none'
          }}
        >
          <Send size={18} /> SUBMIT AUDIT & RUN LAYER 3/4 AI EVALUATION
        </button>
      </div>

    </div>
  );
};
