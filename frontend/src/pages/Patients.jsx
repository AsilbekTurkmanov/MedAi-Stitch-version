import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Heart, 
  AlertCircle, 
  Pill, 
  Sparkles,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Patients({ onLaunchDiagForPatient }) {
  const { t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [triageFilter, setTriageFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const [activePatient, setActivePatient] = useState(null);
  
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [newHr, setNewHr] = useState(75);
  const [newBp, setNewBp] = useState('120/80');
  const [newSpo2, setNewSpo2] = useState(98);
  const [newTemp, setNewTemp] = useState(36.6);

  useEffect(() => {
    loadPatients();
  }, [conditionFilter, triageFilter]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients(search, conditionFilter, triageFilter);
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPatients();
  };

  const handleAddVital = async (e) => {
    e.preventDefault();
    if (!activePatient) return;
    try {
      const vital = {
        heartRateBpm: Number(newHr),
        bloodPressure: newBp,
        spO2Percent: Number(newSpo2),
        temperatureC: Number(newTemp)
      };
      await api.addPatientVital(activePatient.id, vital);
      const updated = await api.getPatientById(activePatient.id);
      setActivePatient(updated);
      setShowVitalForm(false);
      loadPatients();
    } catch (err) {
      console.error('Failed to add vital', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('patients.title')}
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {t('patients.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('patients.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t('patients.filterCondition')}</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">{t('patients.allConditions')}</option>
              <option value="Critical">Critical</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Stable">Stable</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t('patients.filterTriage')}</span>
            <select
              value={triageFilter}
              onChange={(e) => setTriageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">{t('patients.allTriage')}</option>
              <option value="Emergency">Emergency (L1)</option>
              <option value="Urgent">Urgent (L2)</option>
              <option value="Standard">Standard (L3)</option>
              <option value="Low">Routine (L4)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {patients.map((patient) => {
          const isCritical = patient.condition === 'Critical' || patient.triageLevel === 'Emergency';
          const latestVital = patient.vitalSigns?.[0];

          return (
            <div
              key={patient.id}
              onClick={() => setActivePatient(patient)}
              className={`glass-panel glass-panel-hover rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isCritical ? 'border-rose-900/40 hover:border-rose-500/50' : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{patient.fullName}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({patient.age}y, {patient.gender})</span>
                    </h3>
                    <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                      Blood: {patient.bloodGroup} • Bed: {patient.roomNumber}
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-md ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : patient.condition === 'Monitoring'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {patient.condition}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400">{t('patients.diagnosis')}</div>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2 mt-0.5">
                    {patient.primaryDiagnosis}
                  </p>
                </div>

                {latestVital ? (
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-slate-400">Heart Rate</div>
                      <div className="font-bold text-rose-400 font-mono text-xs">{latestVital.heartRateBpm} BPM</div>
                    </div>
                    <div>
                      <div className="text-slate-400">BP</div>
                      <div className="font-bold text-cyan-300 font-mono text-xs">{latestVital.bloodPressure}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">SpO2</div>
                      <div className="font-bold text-amber-400 font-mono text-xs">{latestVital.spO2Percent}%</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 text-center py-2">{t('patients.noVitals')}</div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  Triage: <strong className="text-slate-300">{patient.triageLevel}</strong>
                </span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  {t('patients.openDossier')} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Dossier Modal */}
      {activePatient && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 border border-cyan-500/30 max-h-[90vh] overflow-y-auto space-y-6 animate-fadeIn">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{activePatient.fullName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                    ID #{activePatient.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {activePatient.age}y • {activePatient.gender} • Blood: {activePatient.bloodGroup} • Bed: {activePatient.roomNumber}
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePatient(null);
                  setShowVitalForm(false);
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (onLaunchDiagForPatient) onLaunchDiagForPatient(activePatient);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('patients.runDiagOnPatient')}</span>
              </button>

              <button
                onClick={() => setShowVitalForm(!showVitalForm)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('patients.logNewVital')}</span>
              </button>
            </div>

            {showVitalForm && (
              <form onSubmit={handleAddVital} className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase">{t('patients.logNewVital')}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Heart Rate (BPM)</label>
                    <input
                      type="number"
                      value={newHr}
                      onChange={(e) => setNewHr(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Blood Pressure</label>
                    <input
                      type="text"
                      value={newBp}
                      onChange={(e) => setNewBp(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">SpO2 (%)</label>
                    <input
                      type="number"
                      value={newSpo2}
                      onChange={(e) => setNewSpo2(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newTemp}
                      onChange={(e) => setNewTemp(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowVitalForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                  >
                    {t('patients.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white"
                  >
                    {t('patients.saveVitals')}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {t('patients.allergies')}
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {activePatient.allergies || 'None recorded'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Pill className="w-4 h-4" /> {t('patients.medications')}
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {activePatient.currentMedications || 'None recorded'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase">{t('patients.caseNotes')}</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activePatient.notes}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {t('patients.telemetryHistory')} ({activePatient.vitalSigns?.length || 0})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activePatient.vitalSigns?.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-400">
                      {new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-rose-400 font-bold">{v.heartRateBpm} BPM</span>
                    <span className="text-cyan-300 font-bold">{v.bloodPressure}</span>
                    <span className="text-amber-400 font-bold">{v.spO2Percent}% SpO2</span>
                    <span className="text-emerald-400 font-bold">{v.temperatureC}°C</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
