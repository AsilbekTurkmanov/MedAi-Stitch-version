import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Scan, 
  Activity, 
  ArrowUpRight, 
  Heart, 
  Sparkles, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Stethoscope,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ onNavigate, onSelectPatient }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIcuPatient, setSelectedIcuPatient] = useState(null);

  // Live heart rate simulator for ECG monitor
  const [liveHr, setLiveHr] = useState(118);
  const [liveSpo2, setLiveSpo2] = useState(91);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashData, patientList] = await Promise.all([
          api.getDashboardSummary(),
          api.getPatients()
        ]);
        setStats(dashData);
        setPatients(patientList);
        if (patientList.length > 0) {
          const critical = patientList.find(p => p.condition === 'Critical') || patientList[0];
          setSelectedIcuPatient(critical);
        }
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Vitals micro-fluctuation timer
    const interval = setInterval(() => {
      setLiveHr(prev => Math.min(130, Math.max(105, prev + (Math.random() > 0.5 ? 1 : -1))));
      setLiveSpo2(prev => Math.min(94, Math.max(89, prev + (Math.random() > 0.6 ? 1 : -1))));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <span className="text-sm font-semibold text-cyan-400">Loading MedAI Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('dashboard.copilotOnline')}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {t('dashboard.title')}
            </h1>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('diagnostics')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>{t('dashboard.newDiagRun')}</span>
            </button>
            <button
              onClick={() => onNavigate('clinics')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs tracking-wide transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{t('nav.clinics')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('dashboard.totalPatients')}</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalPatients || 28}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{t('dashboard.activeOccupancy')}</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-rose-900/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">{t('dashboard.criticalAlertsCount')}</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{stats.criticalAlerts || 4}</span>
            <span className="text-xs font-medium text-rose-400 flex items-center">
              {t('dashboard.immediateAction')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">2 ICU • 2 Emergency Room</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('dashboard.scansProcessed')}</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Scan className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.scansAnalyzedToday || 18}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{t('dashboard.avgInference')}</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('dashboard.aiAccuracy')}</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.aiAccuracyRate || 98.2}%</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5" /> Validated
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{t('dashboard.icdVerified')}</p>
        </div>
      </div>

      {/* Main Interactive Grid: Live ECG Telemetry & Urgent Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live ICU Telemetry (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Heart className="w-5 h-5 text-rose-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {t('dashboard.liveIcuTitle')}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {t('dashboard.bed')}: {selectedIcuPatient?.roomNumber || 'ICU-03'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Patient: <span className="text-slate-200 font-semibold">{selectedIcuPatient?.fullName || 'Jasur Alimov'}</span> ({selectedIcuPatient?.age || 58}y)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-400 font-mono font-bold">{t('dashboard.streaming12Lead')}</span>
            </div>
          </div>

          {/* ECG Waveform Canvas Simulation */}
          <div className="relative h-44 rounded-xl bg-[#060b14] border border-cyan-900/40 p-4 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 h-24 w-full flex items-center">
              <svg className="w-full h-full text-cyan-400" viewBox="0 0 800 100" preserveAspectRatio="none">
                <path
                  d="M0,50 L80,50 L95,50 L105,20 L115,85 L125,10 L135,65 L145,50 L220,50 L235,50 L245,20 L255,85 L265,10 L275,65 L285,50 L360,50 L375,50 L385,20 L395,85 L405,10 L415,65 L425,50 L500,50 L515,50 L525,20 L535,85 L545,10 L555,65 L565,50 L640,50 L655,50 L665,20 L675,85 L685,10 L695,65 L705,50 L800,50"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                />
              </svg>
            </div>

            {/* Vitals HUD overlay */}
            <div className="relative z-10 grid grid-cols-4 gap-4 pt-2 border-t border-slate-800/80 bg-slate-950/60 rounded-lg p-2 backdrop-blur-sm">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('dashboard.heartRate')}</div>
                <div className="text-xl font-extrabold text-rose-400 font-mono flex items-baseline gap-1">
                  {liveHr} <span className="text-[10px] text-slate-400">BPM</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('dashboard.bloodPressure')}</div>
                <div className="text-xl font-extrabold text-cyan-300 font-mono">
                  165/105 <span className="text-[10px] text-slate-400">mmHg</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('dashboard.spO2')}</div>
                <div className="text-xl font-extrabold text-amber-400 font-mono">
                  {liveSpo2}% <span className="text-[10px] text-slate-400">Ambient</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('dashboard.tempResp')}</div>
                <div className="text-xl font-extrabold text-emerald-400 font-mono">
                  37.4°C <span className="text-[10px] text-slate-400">/ 24rpm</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Clinical Warning Banner */}
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-300">{t('dashboard.triageFlagTitle')}</span>
              <span className="text-slate-300">
                {t('dashboard.triageFlagDesc')}
              </span>
            </div>
          </div>
        </div>

        {/* Urgent Triage Queue (1 col) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">{t('dashboard.emergencyQueue')}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {t('dashboard.priority12')}
              </span>
            </div>

            <div className="space-y-3">
              {patients.slice(0, 4).map((p) => {
                const isEmergency = p.triageLevel === 'Emergency';
                const isUrgent = p.triageLevel === 'Urgent';
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedIcuPatient(p);
                      if (onSelectPatient) onSelectPatient(p);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedIcuPatient?.id === p.id
                        ? 'bg-slate-800/90 border-cyan-500/50 shadow-md'
                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                        <span>{p.fullName}</span>
                        <span className="text-[10px] text-slate-400">({p.age}y)</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isEmergency 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : isUrgent
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {p.triageLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-medium">
                      {p.primaryDiagnosis}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800/50">
                      <span>Room: {p.roomNumber}</span>
                      <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                        EHR <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('patients')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('dashboard.viewAllPatients')}</span>
          </button>
        </div>
      </div>

      {/* Secondary Row: Triage Analytics Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Triage Distribution Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            {t('dashboard.triageStratification')}
          </h3>
          <div className="space-y-3.5">
            {stats.triageDistribution?.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.level}</span>
                  <span className="text-slate-400 font-mono">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / 28) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Triage Trend */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            {t('dashboard.weeklyLoad')}
          </h3>
          <div className="h-40 flex items-end justify-between gap-2 pt-4">
            {stats.weeklyTriageTrend?.map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div
                    className="w-2.5 bg-gradient-to-t from-cyan-600 to-sky-400 rounded-t-sm group-hover:brightness-125 transition-all"
                    style={{ height: `${(pt.diagnoses / 50) * 100}%` }}
                  />
                  <div
                    className="w-2.5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm group-hover:brightness-125 transition-all"
                    style={{ height: `${(pt.scans / 50) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">{pt.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-400" /> {t('dashboard.aiDiagnoses')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-400" /> {t('dashboard.aiScans')}
            </span>
          </div>
        </div>

        {/* Quick Launch Clinical Tools */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {t('dashboard.clinicalSuite')}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t('dashboard.suiteDesc')}
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('copilot')}
                className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{t('dashboard.askCopilot')}</div>
                    <div className="text-[10px] text-slate-400">{t('dashboard.askCopilotDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('appointments')}
                className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{t('dashboard.ePrescription')}</div>
                    <div className="text-[10px] text-slate-400">{t('dashboard.ePrescriptionDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>.NET 10 Web API</span>
            <span className="text-cyan-400 font-mono">2026 Core</span>
          </div>
        </div>
      </div>
    </div>
  );
}
