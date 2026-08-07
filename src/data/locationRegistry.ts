import type { CampusVenue, QuestionTemplate } from '../types/audit';

// Official Bannari Amman Institute of Technology Fitness Certificate - Medical Center Incharge (24 Predefined Questions)
export const OFFICIAL_BIT_MEDICAL_CENTER_TEMPLATE: QuestionTemplate = {
  id: 'TMPL-BIT-MED-24',
  title: 'Fitness Certificate - Medical Center Incharge (Bannari Amman Institute of Technology)',
  description: 'Official 24-point infrastructure & medical fitness certificate audit checklist categorized into 6 core operational headers: Cleaning, Electrical, Network, Plumbing, Documentation, and Feedback.',
  venueCategory: 'Medical Facilities',
  createdBy: 'Professor In-charge (Bannari Amman Institute of Technology)',
  createdAt: '2026-07-27',
  questions: [
    // 1. Cleaning (Includes Housekeeping, 5S, Civil, Mechanical, Welding, Horticulture, Damages, Safety)
    {
      id: 'BIT-MED-03',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Did you check the waste disposal & cleaning work?',
      description: 'Verify general waste disposal, daily housekeeping routine, and cleanliness.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Waste Disposal', 'Cleaning Work', 'Housekeeping', 'Sanitation Log'],
      sampleFollowUpQuestionsIfNo: [
        'Which waste disposal area failed sanitation standards?',
        'Was improper segregation of hazardous medical waste observed?'
      ]
    },
    {
      id: 'BIT-MED-04',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Did you check the General Amenities?',
      description: 'Check patient seating, drinking water dispenser, and waiting hall amenities cleanliness.',
      isMandatory: false,
      requiresPhotoIfNo: true,
      priority: 'LOW',
      aiContextKeywords: ['General Amenities', 'Waiting Hall Seating', 'Drinking Water Filter'],
      sampleFollowUpQuestionsIfNo: [
        'Specify which general amenity requires repair or replacement.'
      ]
    },
    {
      id: 'BIT-MED-05',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Whether the workplace infrastructure maintained properly?',
      description: 'Inspect wall paint, doors, window glazing, ceiling, and structural flooring integrity.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Workplace Maintenance', 'Infrastructure Integrity', 'Structural Finish'],
      sampleFollowUpQuestionsIfNo: [
        'Is there visible structural damage, dampness, or broken fixtures?'
      ]
    },
    {
      id: 'BIT-MED-09',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Are all emergency doors open freely without obstacles?',
      description: 'Verify panic bar latches and clear un-obstructed passage in emergency exit corridors.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Emergency Door Latch', 'Exit Obstruction', 'Panic Bar Latch'],
      sampleFollowUpQuestionsIfNo: [
        'What obstacle is blocking the emergency exit doorway?'
      ]
    },
    {
      id: 'BIT-MED-18',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Did you check the disposal of Medicine and Medical waste?',
      description: 'Verify bio-medical waste disposal, bio-hazard bin color liners, and sharp needle box.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Medical Waste Disposal', 'Sharps Container', 'Expired Drug Disposal'],
      sampleFollowUpQuestionsIfNo: [
        'Is expired medicine disposed of per biomedical waste protocol?'
      ]
    },
    {
      id: 'BIT-MED-19',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Did you check Bed Making?',
      description: 'Check clean linen, pillow covers, bed sheet sterilization, and mattress hygiene.',
      isMandatory: false,
      requiresPhotoIfNo: true,
      priority: 'LOW',
      aiContextKeywords: ['Bed Making Linen', 'Patient Mattress Hygiene', 'Sterile Sheet'],
      sampleFollowUpQuestionsIfNo: [
        'How many patient observation beds are missing clean sterile linen?'
      ]
    },
    {
      id: 'BIT-MED-20',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Are all the floors & restrooms cleaned properly?',
      description: 'Check floor cleaning log, disinfectant mopping, and restroom sanitation.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Floor Cleaning Log', 'Restroom Sanitation', 'Disinfectant Mop'],
      sampleFollowUpQuestionsIfNo: [
        'Which restroom or bay failed hygiene standards?'
      ]
    },
    {
      id: 'BIT-MED-21',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Are the scrap removed periodically?',
      description: 'Verify scrap clearance from rear yard, storage rooms, and corridors.',
      isMandatory: false,
      requiresPhotoIfNo: true,
      priority: 'LOW',
      aiContextKeywords: ['Scrap Removal', 'Corridor Clearance', 'Waste Accumulation'],
      sampleFollowUpQuestionsIfNo: [
        'Where is un-cleared scrap accumulated in the facility?'
      ]
    },

    // 2. Electrical (Includes Equipment, Devices, CCTV, Access Control, UPS, Lighting, Fire Safety, Communication Devices)
    {
      id: 'BIT-MED-01',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are all the Safety equipment working in good condition?',
      description: 'Inspect main electrical safety gear, eyewash, emergency showers, and protective devices.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Safety Equipment', 'Eyewash Station', 'Personal Protective Equipment', 'Safety Inspection Tag'],
      sampleFollowUpQuestionsIfNo: [
        'Which specific safety equipment item is damaged or out of service?',
        'Is replacement safety equipment available in the central store?'
      ]
    },
    {
      id: 'BIT-MED-02',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are the medicines & medical equipment available in good condition?',
      description: 'Check stock condition, diagnostic equipment integrity, and storage environment.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Medicine Condition', 'Medical Equipment Check', 'Storage Cabinet Integrity'],
      sampleFollowUpQuestionsIfNo: [
        'State which medicine category or equipment has failed condition check.',
        'Has the damaged equipment been isolated from the active treatment bay?'
      ]
    },
    {
      id: 'BIT-MED-07',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are all the Fire extinguishers have a valid expiry date?',
      description: 'Inspect hydro-test date and inspection tag on all CO2 / ABC fire extinguishers.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Fire Extinguisher Tag', 'Extinguisher Expiry Date', 'Hydro-Test Tag'],
      sampleFollowUpQuestionsIfNo: [
        'Which extinguisher location has an expired inspection tag?'
      ]
    },
    {
      id: 'BIT-MED-08',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are all fire safety equipment working in good condition?',
      description: 'Test smoke detectors, fire alarm pull stations, and hose reels.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Fire Safety Gear', 'Smoke Detector LED', 'Fire Hose Reel', 'Alarm Panel'],
      sampleFollowUpQuestionsIfNo: [
        'Which fire safety device failed functional testing?'
      ]
    },
    {
      id: 'BIT-MED-10',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are all the cameras functioning properly?',
      description: 'Check CCTV camera live feed on security monitor and camera lens clarity.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['CCTV Camera Feed', 'Security Camera Lens', 'DVR Recording Log'],
      sampleFollowUpQuestionsIfNo: [
        'Which specific CCTV camera channel has lost video signal?'
      ]
    },
    {
      id: 'BIT-MED-13',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Did you check the medical equipment (Monitor, BP equipment, etc.)?',
      description: 'Test Patient Monitor, Sphygmomanometer, Stethoscope, Pulse Oximeter, and ECG Machine.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Patient Monitor', 'BP Equipment Sphygmomanometer', 'Pulse Oximeter', 'ECG Unit'],
      sampleFollowUpQuestionsIfNo: [
        'Which electronic medical monitor or BP cuff failed calibration?'
      ]
    },
    {
      id: 'BIT-MED-22',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Did you check the A/C working in all the floors?',
      description: 'Test air conditioning cooling performance and compressor sound in all rooms.',
      isMandatory: false,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['AC Air Conditioning', 'Cooling Temperature', 'AC Compressor Unit'],
      sampleFollowUpQuestionsIfNo: [
        'Which room or floor has a non-functional split AC unit?'
      ]
    },
    {
      id: 'BIT-MED-23',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Did you check all the electrical items functioning properly? (Bulbs / Fans Switchboards)',
      description: 'Inspect lighting bulbs, ceiling fans, switchboards, and electrical sockets.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Electrical Switchboards', 'Light Bulbs Fans', 'Power Sockets Earthing'],
      sampleFollowUpQuestionsIfNo: [
        'Specify broken switchboards or fused light fixtures identified.'
      ]
    },

    // 3. Network (Includes IT, Software, Internet, CCTV Recording, Data Sync) - (Note: No specific Network questions in Medical FC checklist)

    // 4. Plumbing (Includes Water Supply, Borewell, Rainwater, Drainage, Sewage)
    {
      id: 'BIT-MED-24',
      section: '4. Plumbing (Water Supply, Drainage & Sewage)',
      questionText: 'Did you check the water supply?',
      description: 'Test tap water pressure, continuous supply, overhead tank level, and RO purifier.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Water Supply Pressure', 'RO Purifier Filter', 'Overhead Tank Level'],
      sampleFollowUpQuestionsIfNo: [
        'Is there a interruption in continuous potable water supply?'
      ]
    },

    // 5. Documentation (Includes Registers, Stock, Consumables, SOPs, Protocols, Compliance)
    {
      id: 'BIT-MED-06',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Whether the essential registers maintained properly?',
      description: 'Verify Out-Patient Log, Emergency Register, Pharmacy Stock Register, and Ambulance Log.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Essential Registers', 'OPD Logbook', 'Pharmacy Register', 'Ambulance Log'],
      sampleFollowUpQuestionsIfNo: [
        'Which specific official register is missing or un-updated?'
      ]
    },
    {
      id: 'BIT-MED-11',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Are all the medicines have a valid expiry date?',
      description: 'Audit pharmacy shelf stock and emergency crash cart for zero expired medications.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Medicine Expiry Date', 'Pharmacy Shelf Audit', 'Crash Cart Expiry'],
      sampleFollowUpQuestionsIfNo: [
        'List expired drug names and batch numbers identified.'
      ]
    },
    {
      id: 'BIT-MED-14',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Are the emergency medicines available?',
      description: 'Verify 100% availability of Adrenaline, Atropine, Antihistamines, and IV Fluids.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Emergency Medicines Stock', 'IV Fluids Availability', 'Adrenaline Vials'],
      sampleFollowUpQuestionsIfNo: [
        'Which critical emergency drug is out of stock?'
      ]
    },
    {
      id: 'BIT-MED-15',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Are the dressing & injection items (Cotton, Gauze, Plaster, disposable syringe, etc.) available?',
      description: 'Inspect sterile cotton rolls, gauze, adhesive plasters, and disposable needle syringes.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Dressing Items', 'Sterile Gauze', 'Disposable Syringes', 'Adhesive Plaster'],
      sampleFollowUpQuestionsIfNo: [
        'Which dressing or injection item is depleted below minimum threshold?'
      ]
    },
    {
      id: 'BIT-MED-16',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Did you check the availability of Oxygen gas in the Cylinder?',
      description: 'Inspect pressure gauge on main Oxygen cylinder (Must read >120 Bar).',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Oxygen Cylinder Gas', 'Oxygen Tank Pressure', 'Flowmeter Gauge'],
      sampleFollowUpQuestionsIfNo: [
        'What exact pressure reading (bar / psi) is shown on the Oxygen cylinder gauge?'
      ]
    },
    {
      id: 'BIT-MED-17',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Did you check the Inventory and Ambulance Medicine?',
      description: 'Audit campus emergency ambulance vehicle, portable suction, stretcher, and medicine box.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Ambulance Inventory', 'Ambulance Medicine Box', 'Portable Stretcher'],
      sampleFollowUpQuestionsIfNo: [
        'Is the campus emergency ambulance operational and ready for deployment?'
      ]
    },

    // 6. Feedback (Includes Service Quality, Guard Performance, Safety, Overall Satisfaction)
    {
      id: 'BIT-MED-12',
      section: '6. Feedback (Service Quality, Safety & Overall Satisfaction)',
      questionText: 'Did you check the readiness of the Emergency Room?',
      description: 'Verify emergency room readiness, staff responsiveness, and overall service satisfaction.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Emergency Room Readiness', 'Trauma Bay Setup', 'Crash Cart Standby'],
      sampleFollowUpQuestionsIfNo: [
        'What critical item is missing from Emergency Room standby?'
      ]
    }
  ]
};

// Official Bannari Amman Institute of Technology Fitness Certificate - FM Radio Station Incharge (User Specified Checklist under 6 Operational Headers)
export const OFFICIAL_BIT_FM_RADIO_STATION_TEMPLATE: QuestionTemplate = {
  id: 'TMPL-BIT-FM-10',
  title: 'Fitness Certificate - Campus FM Radio Station Incharge (Bannari Amman Institute of Technology)',
  description: 'Official broadcast infrastructure, RF transmitter, studio acoustics, electrical & documentation fitness certificate audit checklist categorized into 6 core operational headers: Cleaning, Electrical, Network, Plumbing, Documentation, and Feedback.',
  venueCategory: 'Media & Broadcasting',
  createdBy: 'Prof. Soundararajan (FM Station Incharge, BIT)',
  createdAt: '2026-07-28',
  questions: [
    // 1. Cleaning (Housekeeping, 5S, Civil & Sanitation)
    {
      id: 'BIT-FM-01',
      section: '1. Cleaning (Housekeeping, 5S, Civil & Sanitation)',
      questionText: 'Are the common areas maintained clean and neatly?',
      description: 'Inspect studio reception, acoustic hallways, DJ lounge, and edit room common areas for cleanliness and 5S order.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Common Area Cleaning', 'Studio Housekeeping', 'Reception & Lounge Cleanliness'],
      sampleFollowUpQuestionsIfNo: ['Which studio common area or hallway requires cleaning or clutter removal?']
    },

    // 2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)
    {
      id: 'BIT-FM-02',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are the fire extinguishers maintained frequently?',
      description: 'Inspect hydro-test expiry tag, pressure gauge needle in green zone, and safety pin seals on all CO2/ABC extinguishers.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Fire Extinguisher Maintenance', 'Extinguisher Inspection Tag', 'CO2 Extinguisher Expiry'],
      sampleFollowUpQuestionsIfNo: ['Which fire extinguisher tag is missing or expired in the station?']
    },
    {
      id: 'BIT-FM-03',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are the UPS and battery working conditions maintained properly?',
      description: 'Test online UPS battery backup, voltage output stability, and zero-dropout power switchover for continuous broadcasting.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['UPS and Battery Working Condition', 'Online UPS Battery Bank', 'Power Backup Switchover'],
      sampleFollowUpQuestionsIfNo: ['What is the battery backup autonomy status or fault code on the UPS?']
    },
    {
      id: 'BIT-FM-04',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are the air conditioners maintained frequently?',
      description: 'Inspect cooling performance, filter cleanliness, and precision AC in the RF transmitter server room (<20°C).',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Air Conditioner Maintenance', 'Transmitter Room Cooling', 'AC Filter Cleanliness'],
      sampleFollowUpQuestionsIfNo: ['Which studio or transmitter room air conditioner is failing to cool properly?']
    },
    {
      id: 'BIT-FM-05',
      section: '2. Electrical (Equipment, Devices, CCTV, UPS, Lighting & Fire Safety)',
      questionText: 'Are the lights and fans working properly?',
      description: 'Verify studio LED ceiling lights, dimmers, emergency backup lights, and acoustic ventilation fans.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Lights & Fans Working Properly', 'Studio Lighting', 'Exhaust Fan Condition'],
      sampleFollowUpQuestionsIfNo: ['Identify broken light fixtures or non-functional studio ceiling fans.']
    },

    // 3. Network (IT, Software, Internet & Sensor Sync)
    {
      id: 'BIT-FM-06',
      section: '3. Network (IT, Software, Internet & Sensor Sync)',
      questionText: 'Is the transmitter and antenna working condition monitored?',
      description: 'Inspect 1kW FM Radio Transmitter (90.4 MHz) forward RF power gauge, VSWR ratio (<1.2), and antenna mast telemetry.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Transmitter & Antenna Monitoring', '1kW RF Forward Power', 'VSWR Ratio', '90.4 MHz Frequency'],
      sampleFollowUpQuestionsIfNo: ['What is the abnormal RF power or VSWR reading observed on the transmitter gauge?']
    },
    {
      id: 'BIT-FM-07',
      section: '3. Network (IT, Software, Internet & Sensor Sync)',
      questionText: 'Are the microphone and mixing consoles maintained properly?',
      description: 'Inspect broadcast condenser microphones, pop filters, audio mixer faders, talkback switches, and ground earthing.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Microphone & Mixing Consoles', 'Condenser Mic Pop Filter', 'Audio Console Faders'],
      sampleFollowUpQuestionsIfNo: ['Which RJ microphone or audio mixer channel requires maintenance?']
    },
    {
      id: 'BIT-FM-08',
      section: '3. Network (IT, Software, Internet & Sensor Sync)',
      questionText: 'Is the studio equipment maintained properly?',
      description: 'Inspect red ON-AIR door light indicators, headphone distribution amps, patch bays, and audio edit workstations.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Studio Equipment Maintenance', 'ON-AIR Door Light', 'Patch Bay Wiring'],
      sampleFollowUpQuestionsIfNo: ['Which piece of studio equipment or indicator relay is out of service?']
    },
    {
      id: 'BIT-FM-09',
      section: '3. Network (IT, Software, Internet & Sensor Sync)',
      questionText: 'Are the speakers, radio receivers, and recorders working properly?',
      description: 'Check active studio monitor speakers, off-air tuner receivers, digital playout automation recorders, and logging servers.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'MEDIUM',
      aiContextKeywords: ['Speakers Radio Receivers Recorders', 'Monitor Speakers', 'Off-Air Tuner', 'Playout Recorder'],
      sampleFollowUpQuestionsIfNo: ['Which monitor speaker or radio receiver is malfunctioning?']
    },

    // 4. Plumbing (Water Supply, Drainage & Sewage) - Note: No applicable questions for FM Radio Station as per user spec

    // 5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)
    {
      id: 'BIT-FM-10',
      section: '5. Documentation (Registers, Stock, Consumables, SOPs & Compliance)',
      questionText: 'Are the essential registers maintained properly?',
      description: 'Verify official WPC spectrum license display, SACFA clearance log, daily broadcast transmission logbook, and duty register.',
      isMandatory: true,
      requiresPhotoIfNo: true,
      priority: 'HIGH',
      aiContextKeywords: ['Essential Registers', 'WPC Spectrum License', 'Daily Transmission Logbook'],
      sampleFollowUpQuestionsIfNo: ['Which essential register or WPC license documentation is missing or un-updated?']
    }

    // 6. Feedback (Service Quality, Safety & Overall Satisfaction) - Note: No applicable questions for FM Radio Station as per user spec
  ]
};

// Food Safety & Kitchen Hygiene Template
export const INITIAL_QUESTION_TEMPLATES: QuestionTemplate[] = [
  OFFICIAL_BIT_MEDICAL_CENTER_TEMPLATE,
  OFFICIAL_BIT_FM_RADIO_STATION_TEMPLATE
];

// Campus Center Geo Reference: 11.493954° N, 77.274503° E (College Campus Coordinates)
export const CAMPUS_GEO_CENTER = { lat: 11.493954, lng: 77.274503 };

// Active Campus Fitness Certificate Venues (Demo #1 is Medical Center, Demo #2 is FM Radio Station 90.4 MHz)
export const ALL_56_CAMPUS_VENUES: CampusVenue[] = [
  {
    id: 'FC-LOC-01',
    code: 'MED-CTR-01',
    name: 'Campus Health & Medical Center',
    category: 'Medical Facilities',
    building: 'Health Sciences Block, Ground Floor',
    geoCoordinates: { lat: 11.493954, lng: 77.274503 }, // Medical Center live GPS
    geofenceRadiusMeters: 20, // 20-meter radius constraint
    qrPayload: 'QR-FC-MEDCTR01-SECURE-11493954-77274503',
    assignedAuditor: 'Prof. Sibi John (Fitness Certificate Incharge)',
    assignedAuditee: 'Mrs. Priya L, AP-III, Dept of IT',
    scheduleFrequencyDays: 15,
    lastAuditDate: '2026-07-12',
    nextAuditDueDate: '2026-07-27', // Due today
    status: 'IN_PROGRESS',
    activeTemplateId: 'TMPL-BIT-MED-24',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    totalCheckpoints: 24
  },
  {
    id: 'FC-LOC-02',
    code: 'FM-RAD-01',
    name: 'Campus FM Radio Station (90.4 MHz)',
    category: 'Media & Broadcasting',
    building: 'Media Tower & Acoustic Sound Studios, 3rd Floor',
    geoCoordinates: { lat: 11.497318, lng: 77.278462 }, // FM Radio Station GPS
    geofenceRadiusMeters: 20,
    qrPayload: 'QR-FC-FMRAD01-SECURE-11497318-77278462',
    assignedAuditor: 'Prof. Soundararajan (FM Station Incharge)',
    assignedAuditee: 'RJ Anand, Station Programme Coordinator',
    scheduleFrequencyDays: 15,
    lastAuditDate: '2026-07-20',
    nextAuditDueDate: '2026-08-04',
    status: 'SCHEDULED',
    activeTemplateId: 'TMPL-BIT-FM-10',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    totalCheckpoints: 10
  }
];
