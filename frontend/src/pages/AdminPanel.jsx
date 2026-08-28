import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Bed, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  UserPlus, 
  AlertTriangle, 
  Cpu, 
  Database, 
  Sparkles, 
  Search, 
  RefreshCw, 
  Download, 
  Stethoscope, 
  Radio, 
  X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const INITIAL_STAFF = [
  { id: 1, name: 'Dr. Sarah Vance, MD', role: 'Bosh Shifokor / Kardiolog', department: 'Kardiologiya', shift: 'Kunduzgi (08:00 - 18:00)', status: 'On Duty', patientsCount: 8, room: 'ICU-03' },
  { id: 2, name: 'Dr. Akbar Rahimov, MD', role: 'Pulmonolog / Reanimatolog', department: 'Pulmonologiya', shift: 'Tungi (18:00 - 08:00)', status: 'On Duty', patientsCount: 6, room: 'Ward-12B' },
  { id: 3, name: 'Dr. Madina Karimova, MD', role: 'Nevrolog / Neyroradiolog', department: 'Nevrologiya', shift: 'Kunduzgi (08:00 - 18:00)', status: 'In Surgery', patientsCount: 5, room: 'Stroke-01' },
  { id: 4, name: 'Dr. Jasur Bekmurodov, MD', role: 'Travmatolog-Ortoped', department: 'Travmatologiya', shift: 'Navbatchilik', status: 'On Call', patientsCount: 4, room: 'OR-02' },
  { id: 5, name: 'Hamshira Nilufar Saidova', role: 'Katta Hamshira (RN)', department: 'Reanimatsiya (ICU)', shift: 'Kunduzgi', status: 'On Duty', patientsCount: 12, room: 'ICU Central' }
];

const INITIAL_BEDS = [
  { bedNumber: 'ICU-01', department: 'Reanimatsiya', patientName: 'Madina Yusupova', condition: 'Critical', vitals: 'BP 178/96 • SpO2 96%', doctor: 'Dr. Madina Karimova', occupied: true },
  { bedNumber: 'ICU-02', department: 'Reanimatsiya', patientName: 'Bo\'sh (Zaxira)', condition: 'Available', vitals: '—', doctor: '—', occupied: false },
  { bedNumber: 'ICU-03', department: 'Reanimatsiya', patientName: 'Jasur Alimov', condition: 'Critical', vitals: 'BP 165/105 • HR 118', doctor: 'Dr. Sarah Vance', occupied: true },
  { bedNumber: 'Ward-12A', department: 'Pulmonologiya', patientName: 'Bo\'sh (Tozalanmoqda)', condition: 'Cleaning', vitals: '—', doctor: '—', occupied: false },
  { bedNumber: 'Ward-12B', department: 'Pulmonologiya', patientName: 'Elena Rostova', condition: 'Monitoring', vitals: 'BP 128/78 • SpO2 94%', doctor: 'Dr. Akbar Rahimov', occupied: true },
  { bedNumber: 'OPD-05', department: 'Kardiologiya', patientName: 'Bobur Karimov', condition: 'Stable', vitals: 'BP 118/72 • SpO2 98%', doctor: 'Dr. Sarah Vance', occupied: true },
  { bedNumber: 'OPD-11', department: 'Gastroenterologiya', patientName: 'Sardor Tashmatov', condition: 'Stable', vitals: 'BP 112/68 • SpO2 99%', doctor: 'Dr. Sarah Vance', occupied: true },
  { bedNumber: 'OPD-12', department: 'Terapiya', patientName: 'Bo\'sh (Tayyor)', condition: 'Available', vitals: '—', doctor: '—', occupied: false }
];

const INITIAL_AUDIT_LOGS = [
  { id: 101, timestamp: '12:28:14', actor: 'Dr. Sarah Vance', action: 'EHR Accessed', target: 'Jasur Alimov (#1)', ip: '192.168.1.42', status: 'Success' },
  { id: 102, timestamp: '12:25:02', actor: 'AI Diagnostic Engine', action: 'Inference Run', target: 'STEMI Protocol (#I21.0)', ip: 'Internal AI Core', status: 'Verified' },
  { id: 103, timestamp: '12:20:45', actor: 'Dr. Akbar Rahimov', action: 'e-Prescription Signed', target: 'Bobur Karimov (#3)', ip: '192.168.1.55', status: 'Success' },
  { id: 104, timestamp: '12:15:30', actor: 'System Telemetry', action: '12-Lead ECG Stream', target: 'ICU-03 Monitor', ip: '10.0.0.12', status: 'Active' },
  { id: 105, timestamp: '12:02:11', actor: 'Admin Security', action: 'HL7 FHIR Sync', target: 'Central EHR Cloud', ip: '192.168.1.1', status: 'Synced' }
];

const STORAGE_KEYS = {
  STAFF: 'medai_admin_staff',
  BEDS: 'medai_admin_beds',
  LOGS: 'medai_admin_audit_logs'
};

export default function AdminPanel() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('overview');
  
  // Persistent staff state
  const [staffList, setStaffList] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
      return stored ? JSON.parse(stored) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Persistent bed state
  const [bedList, setBedList] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BEDS);
      return stored ? JSON.parse(stored) : INITIAL_BEDS;
    } catch {
      return INITIAL_BEDS;
    }
  });

  // Persistent audit logs
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [searchStaff, setSearchStaff] = useState('');
  
  // New Staff Modal State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Kardiolog');
  const [newStaffDept, setNewStaffDept] = useState('Kardiologiya');
  const [newStaffShift, setNewStaffShift] = useState('Kunduzgi (08:00 - 18:00)');

  // Hospital Emergency Code Trigger
  const [activeEmergencyCode, setActiveEmergencyCode] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(bedList));
  }, [bedList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action, target, status = 'Success') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      actor: user?.name || 'Admin',
      action,
      target,
      ip: '192.168.1.' + Math.floor(10 + Math.random() * 80),
      status
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff = {
      id: staffList.length + 1,
      name: newStaffName,
      role: newStaffRole,
      department: newStaffDept,
      shift: newStaffShift,
      status: 'On Duty',
      patientsCount: 0,
      room: 'OPD-' + (100 + staffList.length)
    };

    const updated = [...staffList, newStaff];
    setStaffList(updated);
    addAuditLog('Staff Added', `${newStaff.name} (${newStaff.department})`, 'Success');
    setShowAddStaffModal(false);
    setNewStaffName('');
  };

  const handleToggleBed = (index) => {
    const updated = [...bedList];
    const targetBed = updated[index];
    targetBed.occupied = !targetBed.occupied;
    if (!targetBed.occupied) {
      targetBed.patientName = lang === 'uz' ? 'Bo\'sh (Mavjud)' : lang === 'ru' ? 'Свободна (Доступно)' : 'Available (Ready)';
      targetBed.condition = 'Available';
    } else {
      targetBed.patientName = lang === 'uz' ? 'Yangi Bemor' : lang === 'ru' ? 'Новый Пациент' : 'Admitted Patient';
      targetBed.condition = 'Monitoring';
    }
    setBedList(updated);
    addAuditLog('Bed Status Changed', `${targetBed.bedNumber} -> ${targetBed.occupied ? 'Occupied' : 'Vacant'}`, 'Verified');
  };

  const handleEmergencyTrigger = (codeName) => {
    setActiveEmergencyCode(codeName);
    addAuditLog('EMERGENCY CODE ALERT', codeName, 'ACTIVE');
  };

  const handleCancelEmergency = () => {
    if (activeEmergencyCode) {
      addAuditLog('Emergency Code Cancelled', activeEmergencyCode, 'Resolved');
      setActiveEmergencyCode(null);
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchStaff.toLowerCase()) || 
    s.department.toLowerCase().includes(searchStaff.toLowerCase())
  );

  const totalBeds = bedList.length;
  const occupiedBeds = bedList.filter(b => b.occupied).length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('admin.title')}
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {t('admin.subtitle')}
          </p>
        </div>

        {/* Emergency Code Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {activeEmergencyCode ? (
            <button
              onClick={handleCancelEmergency}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950 flex items-center gap-2 animate-pulse cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{activeEmergencyCode} — {t('admin.cancelEmergency')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEmergencyTrigger('CODE BLUE (Cardiac / ICU)')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-sky-950/80 border border-sky-600/40 text-sky-400 text-xs font-bold transition-all cursor-pointer"
              >
                {t('admin.codeBlue')}
              </button>
              <button
                onClick={() => handleEmergencyTrigger('CODE RED (Evacuation / Fire)')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-rose-600/40 text-rose-400 text-xs font-bold transition-all cursor-pointer"
              >
                {t('admin.codeRed')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        {[
          { id: 'overview', label: t('admin.tabOverview'), icon: Activity },
          { id: 'staff', label: t('admin.tabStaff'), icon: Users, count: staffList.length },
          { id: 'beds', label: t('admin.tabBeds'), badge: `${occupancyRate}%` },
          { id: 'security', label: t('admin.tabSecurity'), icon: ShieldAlert },
          { id: 'system', label: t('admin.tabSystem'), icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  occupancyRate > 80 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: OVERVIEW & HOSPITAL CAPACITY ────────────────────────────────── */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>{t('admin.bedOccupancy')}</span>
                <Bed className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{occupancyRate}%</div>
              <p className="text-[11px] text-slate-400">{occupiedBeds} {t('admin.occupiedOfTotal')} ({totalBeds})</p>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${occupancyRate}%` }} />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>{t('admin.dutyStaff')}</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">{staffList.length}</div>
              <p className="text-[11px] text-slate-400">{staffList.filter(s => s.status === 'On Duty').length} Active • {staffList.length} Total</p>
              <span className="inline-block text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                {t('admin.shiftFull')}
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>{t('admin.aiCluster')}</span>
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-extrabold text-sky-400 font-mono">99.98%</div>
              <p className="text-[11px] text-slate-400">Inference: 120ms • GPU Cluster OK</p>
              <span className="inline-block text-[10px] text-sky-400 font-semibold bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
                Model v2026.4 Active
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>{t('admin.dailyConsults')}</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">64</div>
              <p className="text-[11px] text-slate-400">+18% vs Yesterday</p>
              <span className="inline-block text-[10px] text-indigo-400 font-semibold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                Avg time: 14 min
              </span>
            </div>
          </div>

          {/* Department Capacity Breakdown & Live Telemetry Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{t('admin.deptCapacity')}</span>
              </h3>

              <div className="space-y-4 pt-2">
                {[
                  { name: 'Kardiologiya & Telemetriya Bo\'limi', occupied: 18, total: 20, color: '#38bdf8' },
                  { name: 'Reanimatsiya va Shoshilinch Yordam (ICU)', occupied: 6, total: 6, color: '#f43f5e' },
                  { name: 'Pulmonologiya & Respirator Terapiya', occupied: 14, total: 16, color: '#a855f7' },
                  { name: 'Nevrologiya & Insult Markazi', occupied: 10, total: 12, color: '#10b981' },
                  { name: 'Qabul va Dastlabki Triaj Bo\'limi', occupied: 8, total: 15, color: '#f59e0b' },
                ].map((dept, i) => {
                  const pct = Math.round((dept.occupied / dept.total) * 100);
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-200">{dept.name}</span>
                        <span className="text-slate-400 font-mono">{dept.occupied}/{dept.total} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: dept.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{t('admin.serverHealth')}</span>
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  { name: '.NET 10 Web API Core', status: 'Online (200 OK)', latency: '18ms' },
                  { name: 'HL7 / FHIR Integration Gateway', status: 'Connected', latency: '42ms' },
                  { name: 'PACS Radiology DICOM Store', status: 'Ready (Storage 4.2TB)', latency: '35ms' },
                  { name: 'DeepSeek / AI Inference Node', status: 'Active (GPU 42%)', latency: '120ms' },
                  { name: 'WebRTC Telehealth Gateway', status: 'Encrypted Stream OK', latency: '24ms' },
                ].map((srv, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <div>
                        <div className="font-bold text-white">{srv.name}</div>
                        <div className="text-[10px] text-slate-400">{srv.status}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">{srv.latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: STAFF & SHIFT MANAGEMENT ───────────────────────────────────── */}
      {activeSubTab === 'staff' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('admin.searchStaffPlaceholder')}
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('admin.addStaffBtn')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5">
                      <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-cyan-400 text-xs">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{staff.name}</h3>
                      <div className="text-[11px] text-cyan-400 font-medium">{staff.role}</div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    staff.status === 'On Duty' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : staff.status === 'In Surgery'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {staff.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('admin.department')}:</span>
                    <strong className="text-slate-200">{staff.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('admin.shiftSchedule')}:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{staff.shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Room:</span>
                    <span className="text-cyan-300 font-mono">{staff.room}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400 text-[11px]">Patients: <strong className="text-white">{staff.patientsCount}</strong></span>
                  <span className="text-cyan-400 font-semibold text-xs">Active Shift</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: WARDS & BED MANAGEMENT ─────────────────────────────────────── */}
      {activeSubTab === 'beds' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">{t('admin.wardsTitle')}</h3>
              <p className="text-xs text-slate-400">{t('admin.wardsSubtitle')}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" /> {t('admin.occupiedCritical')}
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> {t('admin.occupiedStable')}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> {t('admin.availableBed')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {bedList.map((bed, idx) => (
              <div
                key={idx}
                onClick={() => handleToggleBed(idx)}
                className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  !bed.occupied
                    ? 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10'
                    : bed.condition === 'Critical'
                    ? 'border-rose-500/40 hover:border-rose-400 bg-rose-950/10'
                    : 'border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-extrabold text-sm text-white">{bed.bedNumber}</span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      !bed.occupied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : bed.condition === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {bed.occupied ? bed.condition : 'Available'}
                    </span>
                  </div>

                  <div className="text-[11px] text-cyan-400 font-semibold">{bed.department}</div>
                  <div className="text-xs font-bold text-white mt-2 truncate">{bed.patientName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{bed.vitals}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>MD: {bed.doctor.split(',')[0]}</span>
                  <span className="text-cyan-400 font-bold">Toggle ⇄</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: AUDIT LOGS & HIPAA SECURITY ────────────────────────────────── */}
      {activeSubTab === 'security' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{t('admin.auditTitle')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('admin.auditSubtitle')}</p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold font-mono">
                {t('admin.auditVerified')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                    <th className="py-2.5 px-3">{t('admin.time')}</th>
                    <th className="py-2.5 px-3">{t('admin.user')}</th>
                    <th className="py-2.5 px-3">{t('admin.action')}</th>
                    <th className="py-2.5 px-3">{t('admin.target')}</th>
                    <th className="py-2.5 px-3">{t('admin.ipAddress')}</th>
                    <th className="py-2.5 px-3 text-right">{t('admin.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-cyan-400">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-white">{log.actor}</td>
                      <td className="py-3 px-3 text-slate-300">{log.action}</td>
                      <td className="py-3 px-3 text-slate-200 font-medium">{log.target}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{log.ip}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: SYSTEM & AI MODEL HEALTH ───────────────────────────────────── */}
      {activeSubTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>{t('admin.dbBackupTitle')}</span>
            </h3>
            <p className="text-xs text-slate-300">
              {t('admin.dbBackupDesc')}
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  const data = localStorage.getItem('medai_local_patients');
                  const blob = new Blob([data || '[]'], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `medai_patients_backup_${Date.now()}.json`;
                  a.click();
                  addAuditLog('Database Backup Exported', 'JSON Export', 'Success');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{t('admin.downloadBackup')}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Bemorlar va retseptlar bazasini standart holatga qaytarishni xohlaysizmi?')) {
                    localStorage.removeItem('medai_local_patients');
                    localStorage.removeItem('medai_local_appointments');
                    localStorage.removeItem('medai_local_prescriptions');
                    localStorage.removeItem('medai_admin_staff');
                    localStorage.removeItem('medai_admin_beds');
                    localStorage.removeItem('medai_admin_audit_logs');
                    window.location.reload();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4 text-rose-400" />
                <span>{t('admin.resetCache')}</span>
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{t('admin.aiParamsTitle')}</span>
            </h3>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">MKX-10 Diagnostic Neural Classifier</div>
                  <div className="text-[10px] text-slate-400">Transformer-based Medical LLM</div>
                </div>
                <span className="font-mono text-cyan-400 font-bold">Accuracy: 98.4%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Radiology Vision Segmentation (ROI)</div>
                  <div className="text-[10px] text-slate-400">UNet++ / ResNet-101 Backbone</div>
                </div>
                <span className="font-mono text-indigo-400 font-bold">Dice Score: 0.94</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Pharmacological Drug Conflict (DDI) Engine</div>
                  <div className="text-[10px] text-slate-400">Pharmacokinetic Rule Validator</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold">0 False Positives</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-cyan-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{t('admin.addStaffModalTitle')}</h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('admin.fullName')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Otabek Rustamov, MD"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('admin.roleSpecialty')}</label>
                <input
                  type="text"
                  required
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('admin.department')}</label>
                  <select
                    value={newStaffDept}
                    onChange={(e) => setNewStaffDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Kardiologiya">Kardiologiya</option>
                    <option value="Pulmonologiya">Pulmonologiya</option>
                    <option value="Nevrologiya">Nevrologiya</option>
                    <option value="Reanimatsiya (ICU)">Reanimatsiya (ICU)</option>
                    <option value="Jarrohlik">Jarrohlik</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('admin.shiftSchedule')}</label>
                  <select
                    value={newStaffShift}
                    onChange={(e) => setNewStaffShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Kunduzgi (08:00 - 18:00)">Kunduzgi (08:00-18:00)</option>
                    <option value="Tungi (18:00 - 08:00)">Tungi (18:00-08:00)</option>
                    <option value="Navbatchilik (24h)">Navbatchilik (24h)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 text-xs font-bold text-white shadow-lg shadow-cyan-950 cursor-pointer"
                >
                  {t('admin.saveStaff')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
