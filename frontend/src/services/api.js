const API_BASE = '/api';

export const api = {
  // Analytics
  async getDashboardSummary() {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using fallback stats', err);
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
    }
  },

  // Patients
  async getPatients(search = '', condition = 'All', triage = 'All') {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (condition && condition !== 'All') params.append('condition', condition);
      if (triage && triage !== 'All') params.append('triage', triage);

      const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch patients');
      return await res.json();
    } catch (err) {
      console.warn('Using local patients dataset', err);
      return [];
    }
  },

  async getPatientById(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    if (!res.ok) throw new Error('Failed to fetch patient');
    return await res.json();
  },

  async createPatient(patientData) {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    if (!res.ok) throw new Error('Failed to create patient');
    return await res.json();
  },

  async addPatientVital(patientId, vitalData) {
    const res = await fetch(`${API_BASE}/patients/${patientId}/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vitalData)
    });
    if (!res.ok) throw new Error('Failed to add vital');
    return await res.json();
  },

  // Diagnostics
  async analyzeSymptoms(diagnosticData) {
    const res = await fetch(`${API_BASE}/diagnostics/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagnosticData)
    });
    if (!res.ok) throw new Error('Failed to analyze symptoms');
    return await res.json();
  },

  async getPatientDiagnosticHistory(patientId) {
    const res = await fetch(`${API_BASE}/diagnostics/history/${patientId}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return await res.json();
  },

  // Scans & Radiology
  async getAllScans(scanType = 'All', severity = 'All') {
    const params = new URLSearchParams();
    if (scanType && scanType !== 'All') params.append('scanType', scanType);
    if (severity && severity !== 'All') params.append('severity', severity);

    const res = await fetch(`${API_BASE}/scans?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch scans');
    return await res.json();
  },

  async analyzeScan(scanRequest) {
    const res = await fetch(`${API_BASE}/scans/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanRequest)
    });
    if (!res.ok) throw new Error('Failed to analyze scan');
    return await res.json();
  },

  // Copilot & Chat
  async getChatHistory(sessionId = 'default-session') {
    const res = await fetch(`${API_BASE}/copilot/history?sessionId=${sessionId}`);
    if (!res.ok) throw new Error('Failed to get chat history');
    return await res.json();
  },

  async sendChatMessage(payload) {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to send message');
    return await res.json();
  },

  // Nearby Clinics & Hospitals
  async getNearbyClinics(lat = 41.311081, lng = 69.240562, category = 'All') {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString()
      });
      if (category && category !== 'All') params.append('category', category);

      const res = await fetch(`${API_BASE}/clinics/nearby?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to get nearby clinics');
      return await res.json();
    } catch (err) {
      console.warn('Using local clinics fallback', err);
      return [];
    }
  },

  // Appointments & Prescriptions
  async getAppointments() {
    const res = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) throw new Error('Failed to get appointments');
    return await res.json();
  },

  async createAppointment(appointmentData) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return await res.json();
  },

  async getPrescriptions() {
    const res = await fetch(`${API_BASE}/appointments/prescriptions`);
    if (!res.ok) throw new Error('Failed to get prescriptions');
    return await res.json();
  },

  async createPrescription(prescriptionData) {
    const res = await fetch(`${API_BASE}/appointments/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescriptionData)
    });
    if (!res.ok) throw new Error('Failed to create prescription');
    return await res.json();
  }
};
