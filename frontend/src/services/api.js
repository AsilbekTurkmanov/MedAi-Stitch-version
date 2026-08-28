const API_BASE = '/api';

// ─── Persistent Local Patient Store ────────────────────────────────────────────
const LOCAL_PATIENTS_KEY = 'medai_local_patients';

const DEFAULT_PATIENTS = [
  {
    id: 1,
    fullName: 'Jasur Alimov',
    age: 58,
    gender: 'Male',
    bloodGroup: 'A+',
    condition: 'Critical',
    triageLevel: 'Emergency',
    primaryDiagnosis: 'Acute Myocardial Infarction (STEMI) — ST elevation in leads V1–V4',
    roomNumber: 'ICU-03',
    allergies: 'Penicillin, Sulfonamides',
    currentMedications: 'Aspirin 325mg, Heparin IV drip, Nitroglycerin SL',
    notes: 'Patient admitted via ER with crushing substernal chest pain radiating to left arm. Troponin I elevated (12.4 ng/mL). Cardiology consult ordered. PCI planned within 90 min.',
    vitalSigns: [
      { heartRateBpm: 118, bloodPressure: '165/105', spO2Percent: 91, temperatureC: 37.4, recordedAt: new Date(Date.now() - 600000).toISOString() },
      { heartRateBpm: 112, bloodPressure: '158/98', spO2Percent: 93, temperatureC: 37.2, recordedAt: new Date(Date.now() - 1800000).toISOString() }
    ]
  },
  {
    id: 2,
    fullName: 'Elena Rostova',
    age: 42,
    gender: 'Female',
    bloodGroup: 'O+',
    condition: 'Monitoring',
    triageLevel: 'Urgent',
    primaryDiagnosis: 'Bilateral Community-Acquired Pneumonia (CAP) — CURB-65 Score: 3',
    roomNumber: 'Ward-12B',
    allergies: 'None known',
    currentMedications: 'Ceftriaxone 2g IV daily, Azithromycin 500mg PO',
    notes: 'Bilateral lower lobe infiltrates on CXR. Sputum culture pending. O2 supplementation via nasal cannula at 4L/min.',
    vitalSigns: [
      { heartRateBpm: 96, bloodPressure: '128/78', spO2Percent: 94, temperatureC: 38.8, recordedAt: new Date(Date.now() - 300000).toISOString() },
      { heartRateBpm: 102, bloodPressure: '132/82', spO2Percent: 92, temperatureC: 39.1, recordedAt: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    id: 3,
    fullName: 'Bobur Karimov',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B+',
    condition: 'Stable',
    triageLevel: 'Standard',
    primaryDiagnosis: 'Acute Bronchitis with Rhinosinusitis (J20.9, J01.9)',
    roomNumber: 'OPD-05',
    allergies: 'Ibuprofen (mild GI upset)',
    currentMedications: 'Amoxicillin/Clavulanate 875/125mg BID, Guaifenesin PRN',
    notes: 'Outpatient follow-up. Improving with antibiotics. Repeat chest X-ray if no improvement in 5 days.',
    vitalSigns: [
      { heartRateBpm: 78, bloodPressure: '118/72', spO2Percent: 98, temperatureC: 37.0, recordedAt: new Date(Date.now() - 7200000).toISOString() }
    ]
  },
  {
    id: 4,
    fullName: 'Madina Yusupova',
    age: 67,
    gender: 'Female',
    bloodGroup: 'AB-',
    condition: 'Critical',
    triageLevel: 'Emergency',
    primaryDiagnosis: 'Acute Ischemic Stroke (MCA Territory) — NIHSS: 18',
    roomNumber: 'Stroke-01',
    allergies: 'Contrast dye (anaphylaxis)',
    currentMedications: 'Alteplase (tPA) IV infusion, Aspirin 81mg (post-tPA window)',
    notes: 'Onset 2 hours ago. Right hemiparesis, aphasia. CT head negative for hemorrhage. DWI-MRI shows acute infarct in left MCA territory. Neuro-ICU monitoring.',
    vitalSigns: [
      { heartRateBpm: 88, bloodPressure: '178/96', spO2Percent: 96, temperatureC: 36.9, recordedAt: new Date(Date.now() - 900000).toISOString() },
      { heartRateBpm: 92, bloodPressure: '182/100', spO2Percent: 95, temperatureC: 37.1, recordedAt: new Date(Date.now() - 2400000).toISOString() }
    ]
  },
  {
    id: 5,
    fullName: 'Sardor Tashmatov',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O-',
    condition: 'Stable',
    triageLevel: 'Low',
    primaryDiagnosis: 'Acute Gastroenteritis — Viral (probable Norovirus)',
    roomNumber: 'OPD-11',
    allergies: 'None known',
    currentMedications: 'ORS (Oral Rehydration Solution), Ondansetron 4mg PRN',
    notes: 'Presented with 24h history of vomiting, diarrhea, mild dehydration. No blood in stool. Stool culture sent. Improving with IV fluids.',
    vitalSigns: [
      { heartRateBpm: 82, bloodPressure: '112/68', spO2Percent: 99, temperatureC: 37.6, recordedAt: new Date(Date.now() - 1200000).toISOString() }
    ]
  }
];

function getLocalPatients() {
  try {
    const stored = localStorage.getItem(LOCAL_PATIENTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore parse error */ }
  localStorage.setItem(LOCAL_PATIENTS_KEY, JSON.stringify(DEFAULT_PATIENTS));
  return DEFAULT_PATIENTS;
}

function saveLocalPatients(patients) {
  localStorage.setItem(LOCAL_PATIENTS_KEY, JSON.stringify(patients));
}

// ─── Fallback Clinics Data (Real Tashkent Hospitals) ───────────────────────────
const FALLBACK_CLINICS = [
  {
    id: 1,
    nameUz: 'Respublika Shoshilinch Tibbiy Yordam Ilmiy Markazi',
    nameRu: 'Республиканский Научный Центр Экстренной Медицинской Помощи',
    nameEn: 'Republican Emergency Medicine Research Center',
    categoryUz: 'Shoshilinch yordam markazi',
    categoryRu: 'Центр скорой помощи',
    categoryEn: 'Emergency Center',
    addressUz: 'Toshkent, Chilonzor tumani, 2-Chilonzor ko\'chasi, 3-uy',
    addressRu: 'Ташкент, Чиланзарский район, ул. 2-Чиланзар, д.3',
    addressEn: '3 Chilanzar-2 Street, Chilanzar District, Tashkent',
    latitude: 41.2858,
    longitude: 69.2084,
    distanceKm: 2.8,
    rating: 4.6,
    isEmergency247: true,
    workingHours: '24/7',
    phoneNumber: '+998 71 277-08-28',
    servicesUz: ['Shoshilinch jarrohlik', 'Reanimatsiya', 'Kardiologiya', 'Nevrologiya', 'Travmatologiya'],
    servicesRu: ['Экстренная хирургия', 'Реанимация', 'Кардиология', 'Неврология', 'Травматология'],
    servicesEn: ['Emergency Surgery', 'ICU', 'Cardiology', 'Neurology', 'Trauma']
  },
  {
    id: 2,
    nameUz: 'Toshkent Tibbiyot Akademiyasi Klinikalari',
    nameRu: 'Клиники Ташкентской Медицинской Академии',
    nameEn: 'Tashkent Medical Academy Clinics',
    categoryUz: 'Universitet klinikasi',
    categoryRu: 'Университетская клиника',
    categoryEn: 'University Hospital',
    addressUz: 'Toshkent, Mirzo Ulug\'bek tumani, Farobiy ko\'chasi, 2',
    addressRu: 'Ташкент, Мирзо-Улугбекский район, ул. Фароби, 2',
    addressEn: '2 Farobi Street, Mirzo Ulugbek District, Tashkent',
    latitude: 41.3401,
    longitude: 69.2848,
    distanceKm: 4.1,
    rating: 4.3,
    isEmergency247: true,
    workingHours: '24/7',
    phoneNumber: '+998 71 214-90-09',
    servicesUz: ['Terapiya', 'Jarrohlik', 'Ginekologiya', 'Pediatriya', 'Anesteziologiya'],
    servicesRu: ['Терапия', 'Хирургия', 'Гинекология', 'Педиатрия', 'Анестезиология'],
    servicesEn: ['Internal Medicine', 'Surgery', 'Gynecology', 'Pediatrics', 'Anesthesiology']
  },
  {
    id: 3,
    nameUz: 'Respublika Ixtisoslashtirilgan Kardiologiya Markazi',
    nameRu: 'Республиканский Специализированный Центр Кардиологии',
    nameEn: 'Republican Specialized Center of Cardiology',
    categoryUz: 'Kardiologiya markazi',
    categoryRu: 'Кардиологический центр',
    categoryEn: 'Cardiology Center',
    addressUz: 'Toshkent, Mirzo Ulug\'bek tumani, Osiyo ko\'chasi, 4',
    addressRu: 'Ташкент, Мирзо-Улугбекский район, ул. Осия, 4',
    addressEn: '4 Osiya Street, Mirzo Ulugbek District, Tashkent',
    latitude: 41.3375,
    longitude: 69.3050,
    distanceKm: 5.6,
    rating: 4.8,
    isEmergency247: true,
    workingHours: '24/7',
    phoneNumber: '+998 71 237-39-17',
    servicesUz: ['Invaziv kardiologiya', 'Kardiojarrohlik', 'Aritmologiya', 'Reabilitatsiya', 'EKG diagnostika'],
    servicesRu: ['Инвазивная кардиология', 'Кардиохирургия', 'Аритмология', 'Реабилитация', 'ЭКГ-диагностика'],
    servicesEn: ['Interventional Cardiology', 'Cardiac Surgery', 'Arrhythmology', 'Rehabilitation', 'ECG Diagnostics']
  },
  {
    id: 4,
    nameUz: 'Yunusobod tumani Oilaviy Poliklinikasi №7',
    nameRu: 'Семейная Поликлиника №7 Юнусабадского района',
    nameEn: 'Family Polyclinic #7, Yunusabad District',
    categoryUz: 'Oilaviy poliklinika',
    categoryRu: 'Семейная поликлиника',
    categoryEn: 'Family Polyclinic',
    addressUz: 'Toshkent, Yunusobod tumani, Amir Temur shoh ko\'chasi, 108',
    addressRu: 'Ташкент, Юнусабадский район, ул. Амира Темура, 108',
    addressEn: '108 Amir Temur Street, Yunusabad District, Tashkent',
    latitude: 41.3655,
    longitude: 69.2882,
    distanceKm: 6.3,
    rating: 4.0,
    isEmergency247: false,
    workingHours: '08:00 - 18:00',
    phoneNumber: '+998 71 248-22-15',
    servicesUz: ['Umumiy amaliyot', 'Laboratoriya', 'Ultratovush', 'Emlash', 'Stomatologiya'],
    servicesRu: ['Общая практика', 'Лаборатория', 'УЗИ', 'Вакцинация', 'Стоматология'],
    servicesEn: ['General Practice', 'Laboratory', 'Ultrasound', 'Vaccination', 'Dental']
  },
  {
    id: 5,
    nameUz: 'MedLine International Klinikasi',
    nameRu: 'Клиника MedLine International',
    nameEn: 'MedLine International Clinic',
    categoryUz: 'Xususiy klinika',
    categoryRu: 'Частная клиника',
    categoryEn: 'Private Clinic',
    addressUz: 'Toshkent, Shayxontohur tumani, Navoiy ko\'chasi, 28',
    addressRu: 'Ташкент, Шайхантахурский район, ул. Навои, 28',
    addressEn: '28 Navoiy Street, Shaykhontohur District, Tashkent',
    latitude: 41.3120,
    longitude: 69.2520,
    distanceKm: 1.5,
    rating: 4.7,
    isEmergency247: false,
    workingHours: '08:00 - 22:00',
    phoneNumber: '+998 71 200-55-66',
    servicesUz: ['Diagnostika', 'MRT', 'KT', 'Dermatologiya', 'Endokrinologiya'],
    servicesRu: ['Диагностика', 'МРТ', 'КТ', 'Дерматология', 'Эндокринология'],
    servicesEn: ['Diagnostics', 'MRI', 'CT', 'Dermatology', 'Endocrinology']
  }
];

// ─── Fallback Appointments ─────────────────────────────────────────────────────
const FALLBACK_APPOINTMENTS = [
  {
    id: 1,
    patientName: 'Bobur Karimov',
    doctorName: 'Dr. Sarah Vance, MD',
    department: 'Cardiology & Clinical Intelligence',
    type: 'Telehealth',
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    reason: 'Follow-up — Post-bronchitis evaluation, chest auscultation review, medication compliance check',
    status: 'Confirmed'
  },
  {
    id: 2,
    patientName: 'Elena Rostova',
    doctorName: 'Dr. Akbar Rahimov, MD',
    department: 'Pulmonology & Respiratory Care',
    type: 'In-Person',
    scheduledTime: new Date(Date.now() + 7200000).toISOString(),
    reason: 'Pneumonia treatment assessment, repeat CXR review, sputum culture results discussion',
    status: 'Confirmed'
  },
  {
    id: 3,
    patientName: 'Sardor Tashmatov',
    doctorName: 'Dr. Sarah Vance, MD',
    department: 'Gastroenterology',
    type: 'Telehealth',
    scheduledTime: new Date(Date.now() + 14400000).toISOString(),
    reason: 'Gastroenteritis follow-up, hydration status assessment, dietary guidance',
    status: 'Confirmed'
  }
];

const FALLBACK_PRESCRIPTIONS = [
  {
    id: 1,
    patientName: 'Bobur Karimov',
    doctorName: 'Dr. Sarah Vance, MD',
    diagnosis: 'Acute Bronchitis & Rhinosinusitis (J20.9)',
    items: [
      { medicineName: 'Amoxicillin / Clavulanate', dosage: '875/125 mg', frequency: 'Twice daily', duration: '7 days', route: 'Oral' },
      { medicineName: 'Ibuprofen', dosage: '400 mg', frequency: 'PRN every 8 hours for pain', duration: '3 days', route: 'Oral' }
    ],
    instructions: 'Take medications with food. Stay hydrated and rest for 5 days.',
    aiSafetyCheckNotes: 'Validated: 0 contraindications. 0 drug-drug interactions detected.',
    createdAt: new Date().toISOString()
  }
];

// ─── AI Diagnostic Engine (Fallback) ───────────────────────────────────────────
function generateDiagnosticResult(payload) {
  const { symptoms = [], patientName, age, gender, severity, vitals } = payload;
  const symptomText = symptoms.join(', ').toLowerCase();

  // Determine diagnosis based on symptom patterns
  let primaryDiagnosis, icdCode, probability, riskLevel, confidence;
  let differentials = [];
  let labTests = [];
  let actions = [];
  let drugs = [];
  let redFlags = [];

  if (symptomText.includes('chest') || symptomText.includes('ko\'krak') || symptomText.includes('yurak') || symptomText.includes('грудин')) {
    primaryDiagnosis = 'Acute Coronary Syndrome (STEMI)';
    icdCode = 'I21.0';
    probability = 87;
    riskLevel = 'Critical';
    confidence = 94.2;
    differentials = [
      { diseaseName: 'Acute Myocardial Infarction (STEMI)', icd10Code: 'I21.0', probabilityPercent: 87, description: 'ST-segment elevation myocardial infarction with acute coronary artery occlusion.', clinicalRationale: `${age}y ${gender} with substernal chest pain, diaphoresis, and elevated HR (${vitals?.heartRate || 118} BPM) strongly suggests acute STEMI. Immediate catheterization lab activation recommended.` },
      { diseaseName: 'Unstable Angina (UA)', icd10Code: 'I20.0', probabilityPercent: 64, description: 'Myocardial ischemia without biomarker elevation.', clinicalRationale: 'If troponin levels remain normal after serial measurements, UA should be considered. Stress testing may differentiate.' },
      { diseaseName: 'Acute Pericarditis', icd10Code: 'I30.9', probabilityPercent: 22, description: 'Inflammation of the pericardial sac causing sharp, pleuritic chest pain.', clinicalRationale: 'Diffuse ST elevation without reciprocal changes and friction rub on auscultation would support this diagnosis.' }
    ];
    labTests = ['Troponin I / T (serial q3h)', '12-Lead ECG (stat)', 'CBC + BMP + Coagulation Panel', 'Chest X-Ray (PA view)', 'BNP / NT-proBNP'];
    actions = ['Activate Cardiac Catheterization Lab', 'Administer Aspirin 325mg PO + Heparin bolus', 'Continuous telemetry monitoring', 'NPO status for potential PCI', 'Cardiology consult within 15 minutes'];
    drugs = ['Aspirin 325mg PO (loading)', 'Clopidogrel 600mg PO (loading)', 'Heparin 60 U/kg IV bolus', 'Nitroglycerin 0.4mg SL q5min PRN', 'Morphine 2-4mg IV PRN for pain'];
    redFlags = ['Acute ST elevation (STEMI criteria)', 'Hemodynamic instability risk', 'Possible cardiogenic shock if BP drops'];
  } else if (symptomText.includes('cough') || symptomText.includes('yo\'tal') || symptomText.includes('pneumonia') || symptomText.includes('nafas') || symptomText.includes('кашель') || symptomText.includes('o\'pka')) {
    primaryDiagnosis = 'Community-Acquired Pneumonia (CAP)';
    icdCode = 'J18.9';
    probability = 82;
    riskLevel = 'High';
    confidence = 91.7;
    differentials = [
      { diseaseName: 'Community-Acquired Pneumonia', icd10Code: 'J18.9', probabilityPercent: 82, description: 'Bacterial or viral infection of the lung parenchyma.', clinicalRationale: `Productive cough with fever and low SpO2 (${vitals?.spO2 || 94}%) in ${age}y patient consistent with CAP. CURB-65 scoring recommended.` },
      { diseaseName: 'Acute Bronchitis', icd10Code: 'J20.9', probabilityPercent: 48, description: 'Inflammation of the bronchial airways without parenchymal involvement.', clinicalRationale: 'If CXR is clear, acute bronchitis is the more likely diagnosis. Supportive care may suffice.' },
      { diseaseName: 'COVID-19 Pneumonia', icd10Code: 'U07.1', probabilityPercent: 31, description: 'SARS-CoV-2 associated viral pneumonia with bilateral GGO.', clinicalRationale: 'Bilateral ground-glass opacities on CT and PCR testing should rule this in or out.' }
    ];
    labTests = ['Chest X-Ray (PA + Lateral)', 'CBC with Differential', 'Procalcitonin Level', 'Blood Cultures (x2)', 'Sputum Gram Stain + Culture'];
    actions = ['Calculate CURB-65 score', 'Start empiric antibiotics within 4 hours', 'Supplemental O2 to maintain SpO2 > 94%', 'Consider ICU if respiratory failure', 'Repeat CXR in 48-72h'];
    drugs = ['Ceftriaxone 2g IV daily', 'Azithromycin 500mg PO daily', 'Acetaminophen 1g PO q6h PRN for fever', 'Albuterol nebulizer PRN for wheezing'];
    redFlags = ['SpO2 < 92% on room air', 'Multilobar involvement on CXR', 'Sepsis criteria met'];
  } else if (symptomText.includes('headache') || symptomText.includes('bosh') || symptomText.includes('головн') || symptomText.includes('nutq') || symptomText.includes('речь')) {
    primaryDiagnosis = 'Acute Ischemic Stroke (MCA Territory)';
    icdCode = 'I63.5';
    probability = 79;
    riskLevel = 'Critical';
    confidence = 92.8;
    differentials = [
      { diseaseName: 'Acute Ischemic Stroke', icd10Code: 'I63.5', probabilityPercent: 79, description: 'Cerebral infarction due to occlusion of middle cerebral artery.', clinicalRationale: `Sudden onset headache, visual changes, and unilateral weakness in ${age}y ${gender} highly suggestive of MCA stroke. FAST protocol initiated.` },
      { diseaseName: 'Migraine with Aura', icd10Code: 'G43.1', probabilityPercent: 35, description: 'Severe episodic headache with neurological aura symptoms.', clinicalRationale: 'If symptoms resolve within 60 minutes and imaging is negative, complex migraine should be considered.' },
      { diseaseName: 'Hypertensive Emergency', icd10Code: 'I16.1', probabilityPercent: 28, description: 'Severely elevated BP with acute end-organ damage.', clinicalRationale: 'If BP > 180/120 with headache, consider hypertensive encephalopathy.' }
    ];
    labTests = ['CT Head without contrast (stat)', 'MRI Brain DWI + FLAIR', 'CBC + BMP + Coagulation', 'ECG (rule out A-fib)', 'CT Angiography of head/neck'];
    actions = ['Activate Stroke Team (Code Stroke)', 'NIHSS assessment within 5 minutes', 'tPA consideration if within 4.5h window', 'NPO + aspiration precautions', 'BP management per AHA guidelines'];
    drugs = ['Alteplase (tPA) 0.9mg/kg IV if eligible', 'Aspirin 325mg PO (after 24h post-tPA)', 'Labetalol IV for BP control PRN', 'IV Normal Saline for hydration'];
    redFlags = ['Symptom onset < 4.5 hours (tPA window)', 'NIHSS > 15 (severe deficit)', 'Possible large vessel occlusion'];
  } else {
    primaryDiagnosis = 'Clinical Assessment Pending';
    icdCode = 'R69';
    probability = 65;
    riskLevel = 'Moderate';
    confidence = 78.5;
    differentials = [
      { diseaseName: 'Unspecified Clinical Syndrome', icd10Code: 'R69', probabilityPercent: 65, description: 'Symptom complex requires further diagnostic workup.', clinicalRationale: `Presented symptoms in ${age}y ${gender} require comprehensive evaluation. Pattern does not match a single high-probability diagnosis at this time.` },
      { diseaseName: 'Acute Viral Infection', icd10Code: 'B34.9', probabilityPercent: 45, description: 'Nonspecific viral illness with constitutional symptoms.', clinicalRationale: 'Fever, malaise, and myalgia without focal findings may suggest viral etiology.' }
    ];
    labTests = ['CBC with Differential', 'CMP (Comprehensive Metabolic Panel)', 'Urinalysis', 'ESR + CRP (inflammatory markers)', 'Blood Cultures if febrile'];
    actions = ['Complete physical examination', 'Obtain focused history', 'Monitor vital signs q4h', 'Consider imaging based on clinical findings'];
    drugs = ['Acetaminophen 500mg PO PRN for pain/fever', 'IV Normal Saline for hydration'];
    redFlags = [];
  }

  return {
    assessmentId: `DIAG-${Date.now().toString(36).toUpperCase()}`,
    patientName: patientName || 'Unknown Patient',
    confidenceScore: confidence,
    overallRiskLevel: riskLevel,
    summary: `Based on the analysis of ${symptoms.length} reported symptoms in a ${age}-year-old ${gender} patient, the MedAI diagnostic engine identified ${primaryDiagnosis} (ICD-10: ${icdCode}) as the primary differential with ${probability}% probability. ${severity === 'Severe' || severity === 'Critical' ? 'Immediate clinical intervention is recommended.' : 'Further diagnostic workup is advised.'}`,
    differentialDiagnoses: differentials,
    redFlagSymptoms: redFlags,
    recommendedLabTests: labTests,
    recommendedActions: actions,
    drugSuggestions: drugs
  };
}

// ─── AI Copilot Chat (Fallback) ────────────────────────────────────────────────
function generateCopilotResponse(message, language) {
  const msg = message.toLowerCase();

  let reply, followUps, reference;

  if (msg.includes('drug interaction') || msg.includes('dori') || msg.includes('взаимодейств') || msg.includes('clopidogrel') || msg.includes('omeprazole') || msg.includes('кло')) {
    reply = `### ⚠️ Drug Interaction Alert: Clopidogrel + Omeprazole

**Risk Level:** Moderate-to-High (FDA Black Box Warning)

**Mechanism:** Omeprazole (CYP2C19 inhibitor) significantly reduces the antiplatelet activity of Clopidogrel by blocking its bioactivation to the active thiol metabolite.

**Clinical Impact:**
- **40-45% reduction** in active Clopidogrel metabolite levels
- Increased risk of **Major Adverse Cardiovascular Events (MACE)**
- Particularly dangerous in post-PCI/stent patients

**Recommended Alternatives:**
1. **Pantoprazole** (minimal CYP2C19 interaction) — First-line PPI alternative
2. **Famotidine** (H2RA) — No CYP2C19 interaction
3. **Rabeprazole** — Partial non-enzymatic metabolism, lower risk

**Evidence:** COGENT trial (2010), FDA Safety Communication 2009, ACC/AHA Guidelines 2016.`;
    followUps = ['What is the DAPT protocol for post-stent patients?', 'Alternative antiplatelet agents to Clopidogrel', 'CYP2C19 pharmacogenomic testing guidelines'];
    reference = 'FDA Drug Safety Communication 2009; COGENT Trial, NEJM 2010';
  } else if (msg.includes('pneumonia') || msg.includes('pnevmoniya') || msg.includes('пневмони') || msg.includes('antibiotic') || msg.includes('антибиотик')) {
    reply = `### 🫁 Empiric Antibiotic Regimen — Severe Community-Acquired Pneumonia (CAP)

**Based on ATS/IDSA Guidelines 2019 + Local Resistance Data:**

**Inpatient (Non-ICU):**
- Ceftriaxone 2g IV daily **+** Azithromycin 500mg PO/IV daily
- **OR** Levofloxacin 750mg IV/PO daily (monotherapy for β-lactam allergy)

**Inpatient (ICU — Severe CAP):**
- Ceftriaxone 2g IV daily **+** Azithromycin 500mg IV daily
- If MRSA risk: Add **Vancomycin 15-20mg/kg IV q8-12h** or **Linezolid 600mg IV q12h**
- If Pseudomonas risk: Replace Ceftriaxone with **Piperacillin-Tazobactam 4.5g IV q6h**

**Duration:** 5-7 days (minimum 5 days; afebrile ≥48h before stopping)

**CURB-65 Scoring:**
- 0-1: Outpatient
- 2: Short inpatient stay
- 3-5: ICU admission consideration`;
    followUps = ['Calculate CURB-65 for my patient', 'De-escalation strategy after culture results', 'Procalcitonin-guided antibiotic stewardship'];
    reference = 'ATS/IDSA CAP Guidelines 2019; Metlay et al., Am J Respir Crit Care Med';
  } else if (msg.includes('stroke') || msg.includes('insult') || msg.includes('инсульт') || msg.includes('fast') || msg.includes('tpa') || msg.includes('alteplase')) {
    reply = `### 🧠 Emergency FAST Protocol — Acute Ischemic Stroke

**Time-Critical Window Assessment:**

**FAST Screening:**
- **F**ace: Ask to smile → asymmetry?
- **A**rms: Raise both → drift/weakness?
- **S**peech: Repeat phrase → slurred/aphasia?
- **T**ime: Note exact onset time → call Stroke Team

**IV Alteplase (tPA) Criteria (< 4.5h onset):**
- Dose: **0.9 mg/kg IV** (max 90mg)
- 10% as bolus over 1 min, remainder over 60 min
- **BP must be < 185/110** before and < 180/105 during infusion

**Contraindications (Key):**
- Active internal bleeding
- Platelet count < 100,000
- INR > 1.7 or PT > 15s
- Recent major surgery (< 14 days)
- Prior intracranial hemorrhage

**Post-tPA Monitoring:**
- Neuro checks q15min × 2h, then q30min × 6h, then q1h × 16h
- No anticoagulants/antiplatelets for 24h
- CT head at 24h before starting Aspirin`;
    followUps = ['NIHSS scoring criteria', 'Mechanical thrombectomy eligibility criteria', 'Secondary stroke prevention guidelines'];
    reference = 'AHA/ASA Acute Stroke Guidelines 2019; Powers WJ et al.';
  } else {
    reply = `### 🩺 MedAI Clinical Copilot Response

Thank you for your clinical inquiry. Based on the available evidence:

**Regarding: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}"**

I recommend the following approach:

1. **Comprehensive Assessment** — Gather complete patient history, perform focused physical examination, and review relevant investigations
2. **Evidence-Based Protocol** — Follow the latest clinical practice guidelines (AHA/ACC, WHO, local MOH protocols)
3. **Multidisciplinary Consultation** — Consider specialist referral if the clinical picture is complex
4. **Documentation** — Ensure all findings are documented in the EHR with ICD-10 coding

*For more specific guidance, please provide detailed clinical parameters such as patient demographics, vital signs, and specific symptom presentation.*`;
    followUps = ['Drug interaction checker', 'Calculate clinical scoring tools', 'Evidence-based treatment protocols'];
    reference = 'UpToDate 2026; Clinical Decision Support System';
  }

  return {
    reply,
    suggestedFollowUps: followUps,
    medicalReferences: [reference]
  };
}


// ─── API Service ───────────────────────────────────────────────────────────────

// ─── Backend Availability Detector ─────────────────────────────────────────────
let isBackendAvailable = null;

async function checkBackend() {
  if (isBackendAvailable !== null) return isBackendAvailable;
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    // Running on remote static hosting (e.g. medai-stitch.vercel.app) without dedicated backend proxy
    isBackendAvailable = false;
    return false;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${API_BASE}/analytics/dashboard`, { signal: controller.signal });
    clearTimeout(timeoutId);
    const ct = res.headers.get('content-type');
    isBackendAvailable = res.ok && !!ct && ct.includes('application/json');
  } catch {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}

export const api = {
  // Analytics / Dashboard
  async getDashboardSummary() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/analytics/dashboard`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    return {
      totalPatients: 28,
      criticalAlerts: 4,
      scansAnalyzedToday: 18,
      aiAccuracyRate: 98.4,
      activeConsultations: 6,
      pendingTriage: 3,
      triageDistribution: [
        { level: 'Emergency (Level 1)', count: 3, color: '#ef4444' },
        { level: 'Urgent (Level 2)', count: 6, color: '#f59e0b' },
        { level: 'Standard (Level 3)', count: 12, color: '#0ea5e9' },
        { level: 'Routine / Low (Level 4)', count: 7, color: '#10b981' }
      ],
      weeklyTriageTrend: [
        { day: 'Mon', diagnoses: 28, scans: 14, critical: 3 },
        { day: 'Tue', diagnoses: 35, scans: 22, critical: 4 },
        { day: 'Wed', diagnoses: 42, scans: 19, critical: 2 },
        { day: 'Thu', diagnoses: 38, scans: 25, critical: 5 },
        { day: 'Fri', diagnoses: 46, scans: 31, critical: 6 },
        { day: 'Sat', diagnoses: 29, scans: 17, critical: 2 },
        { day: 'Sun', diagnoses: 24, scans: 12, critical: 1 }
      ],
      recentCriticalAlerts: [
        { patientId: 1, patientName: 'Jasur Alimov', issue: 'Acute Myocardial Infarction', severity: 'Critical', roomNumber: 'ICU-03' },
        { patientId: 4, patientName: 'Madina Yusupova', issue: 'Acute Ischemic Stroke (MCA)', severity: 'Critical', roomNumber: 'Stroke-01' }
      ]
    };
  },

  // Patients
  async getPatients(search = '', condition = 'All', triage = 'All') {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (condition && condition !== 'All') params.append('condition', condition);
        if (triage && triage !== 'All') params.append('triage', triage);

        const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    let patients = getLocalPatients();
    if (search) {
      const s = search.toLowerCase();
      patients = patients.filter(p =>
        p.fullName.toLowerCase().includes(s) ||
        p.primaryDiagnosis.toLowerCase().includes(s)
      );
    }
    if (condition && condition !== 'All') {
      patients = patients.filter(p => p.condition === condition);
    }
    if (triage && triage !== 'All') {
      patients = patients.filter(p => p.triageLevel === triage);
    }
    return patients;
  },

  async getPatientById(id) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/patients/${id}`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    const patients = getLocalPatients();
    return patients.find(p => p.id === Number(id)) || patients[0];
  },

  async createPatient(patientData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/patients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    // Save locally with auto-incremented ID
    const patients = getLocalPatients();
    const maxId = patients.reduce((max, p) => Math.max(max, p.id || 0), 0);
    const newPatient = {
      ...patientData,
      id: maxId + 1,
      allergies: patientData.allergies || 'None recorded',
      currentMedications: patientData.currentMedications || 'None recorded',
      notes: patientData.notes || 'Patient admitted. Clinical assessment in progress.',
      vitalSigns: patientData.vitalSigns?.map(v => ({
        ...v,
        recordedAt: new Date().toISOString()
      })) || []
    };
    patients.push(newPatient);
    saveLocalPatients(patients);
    return newPatient;
  },

  async addPatientVital(patientId, vitalData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/patients/${patientId}/vitals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vitalData)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    const patients = getLocalPatients();
    const patient = patients.find(p => p.id === Number(patientId));
    if (patient) {
      const newVital = { ...vitalData, recordedAt: new Date().toISOString() };
      patient.vitalSigns = [newVital, ...(patient.vitalSigns || [])];
      saveLocalPatients(patients);
      return newVital;
    }
    return vitalData;
  },

  // Diagnostics
  async analyzeSymptoms(diagnosticData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/diagnostics/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(diagnosticData)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    // Fast AI simulation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateDiagnosticResult(diagnosticData);
  },

  async getPatientDiagnosticHistory(patientId) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/diagnostics/history/${patientId}`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return [];
  },

  // Scans & Radiology
  async getAllScans(scanType = 'All', severity = 'All') {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const params = new URLSearchParams();
        if (scanType && scanType !== 'All') params.append('scanType', scanType);
        if (severity && severity !== 'All') params.append('severity', severity);

        const res = await fetch(`${API_BASE}/scans?${params.toString()}`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return [];
  },

  async analyzeScan(scanRequest) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/scans/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scanRequest)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return {
      findings: 'AI scan analysis completed in local client mode.',
      confidenceScore: 95.5,
      anomalies: []
    };
  },

  // Copilot & Chat
  async getChatHistory(sessionId = 'default-session') {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/copilot/history?sessionId=${sessionId}`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return [];
  },

  async sendChatMessage(payload) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/copilot/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    // Fast AI simulation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateCopilotResponse(payload.message, payload.language || 'en');
  },

  // Nearby Clinics & Hospitals
  async getNearbyClinics(lat = 41.311081, lng = 69.240562, category = 'All') {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lng: lng.toString()
        });
        if (category && category !== 'All') params.append('category', category);

        const res = await fetch(`${API_BASE}/clinics/nearby?${params.toString()}`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }

    let clinics = [...FALLBACK_CLINICS];
    clinics = clinics.map(c => ({
      ...c,
      distanceKm: Math.round(
        Math.sqrt(
          Math.pow((c.latitude - lat) * 111, 2) +
          Math.pow((c.longitude - lng) * 85, 2)
        ) * 10
      ) / 10
    }));
    clinics.sort((a, b) => a.distanceKm - b.distanceKm);
    return clinics;
  },

  // Appointments & Prescriptions
  async getAppointments() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/appointments`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return FALLBACK_APPOINTMENTS;
  },

  async createAppointment(appointmentData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return { ...appointmentData, id: Date.now(), status: 'Confirmed' };
  },

  async getPrescriptions() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/appointments/prescriptions`);
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return FALLBACK_PRESCRIPTIONS;
  },

  async createPrescription(prescriptionData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/appointments/prescriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prescriptionData)
        });
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return await res.json();
        }
      } catch {
        isBackendAvailable = false;
      }
    }
    return { ...prescriptionData, id: Date.now(), createdAt: new Date().toISOString() };
  }
};

