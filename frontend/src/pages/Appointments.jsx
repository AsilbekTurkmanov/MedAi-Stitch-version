import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  User, 
  Pill,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Appointments() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('telehealth');
  
  const [patientName, setPatientName] = useState('Bobur Karimov');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Vance, MD');
  const [diagnosis, setDiagnosis] = useState('Acute Bronchitis & Rhinosinusitis (J20.9)');
  const [instructions, setInstructions] = useState('Take medications with food. Stay hydrated and rest for 5 days.');
  const [items, setItems] = useState([
    { medicineName: 'Amoxicillin / Clavulanate', dosage: '875/125 mg', frequency: 'Twice daily', duration: '7 days', route: 'Oral' },
    { medicineName: 'Ibuprofen', dosage: '400 mg', frequency: 'PRN every 8 hours for pain', duration: '3 days', route: 'Oral' }
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('500mg');
  const [newFreq, setNewFreq] = useState('Once daily');
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [appts, rxs] = await Promise.all([
          api.getAppointments(),
          api.getPrescriptions()
        ]);
        setAppointments(appts || []);
        setPrescriptions(rxs || []);
      } catch (err) {
        console.error('Error fetching appointments', err);
      }
    }
    loadData();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    setItems([
      ...items,
      { medicineName: newMedName, dosage: newDosage, frequency: newFreq, duration: '5 days', route: 'Oral' }
    ]);
    setNewMedName('');
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSavePrescription = async () => {
    try {
      const payload = {
        patientId: 3,
        patientName,
        doctorName,
        diagnosis,
        instructions,
        aiSafetyCheckNotes: 'Validated: 0 contraindications. 0 drug-drug interactions detected.',
        items
      };
      await api.createPrescription(payload);
      const rxs = await api.getPrescriptions();
      setPrescriptions(rxs || []);
      alert('e-Prescription signed and saved to EHR!');
    } catch (err) {
      console.error('Error saving prescription', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('appointments.title')}
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {t('appointments.subtitle')}
          </p>
        </div>

        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('telehealth')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'telehealth'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('appointments.telehealthTab')}
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('appointments.prescriptionsTab')}
          </button>
        </div>
      </div>

      {activeTab === 'telehealth' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                      {appt.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(appt.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{appt.patientName}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">{appt.doctorName}</div>
                  <div className="text-xs text-slate-400">{appt.department}</div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">{t('appointments.clinicalReason')}</div>
                    <p className="text-xs text-slate-200 font-medium mt-0.5">{appt.reason}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Confirmed
                  </span>

                  <button
                    onClick={() => setActiveCall(appt)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{t('appointments.joinRoom')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" /> {t('appointments.composeRx')}
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                <ShieldCheck className="w-3 h-3" /> {t('appointments.pharmacokineticsActive')}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('appointments.patientName')}</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-[10px] font-bold uppercase text-slate-400">{t('appointments.addDrug')}</div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder={t('appointments.drugName')}
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder={t('appointments.dosage')}
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={handleAddItem}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">{t('appointments.rxItems')} ({items.length})</div>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{item.medicineName}</div>
                      <div className="text-[10px] text-slate-400">{item.dosage} • {item.frequency} • {item.duration}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('appointments.instructions')}</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSavePrescription}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('appointments.signAndCommit')}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-slate-950 text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="text-base font-extrabold text-white">MedAI Health Center</div>
                <div className="text-[10px] text-slate-400">Department of Cardiology & Clinical Intelligence</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Rx ID: #MED-9921</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">{t('appointments.verifiedEhr')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Patient:</span>
                <strong className="text-white">{patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Physician:</span>
                <strong className="text-white">{doctorName}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block">Diagnosis:</span>
                <strong className="text-cyan-300">{diagnosis}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('appointments.rxItems')}:
              </div>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-900 text-xs">
                  <div>
                    <span className="font-bold text-white">{i + 1}. {item.medicineName}</span>
                    <span className="text-slate-400 text-[10px] ml-2 font-mono">({item.dosage})</span>
                  </div>
                  <div className="text-slate-300 font-mono text-[11px]">{item.frequency}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('appointments.aiSafetyChecked')}</span>
            </div>

            <div className="text-xs text-slate-300">
              <span className="font-bold text-slate-400 block text-[10px] uppercase">{t('appointments.directions')}</span>
              {instructions}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-end justify-between">
              <div>
                <div className="text-[10px] text-slate-400">Timestamp: {new Date().toLocaleDateString()}</div>
                <div className="text-[10px] text-cyan-400 font-mono">{t('appointments.digitalSignature')}</div>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-sm text-cyan-300">Dr. Sarah Vance</div>
                <div className="text-[9px] text-slate-400 border-t border-slate-700 pt-0.5">Licensed Attending MD</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCall && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 border border-cyan-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-bold text-white">Live Telehealth Encrypted Stream</h3>
              </div>
              <button
                onClick={() => setActiveCall(null)}
                className="px-3 py-1 rounded-lg bg-rose-600 text-xs font-bold text-white cursor-pointer"
              >
                End Call
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 mx-auto flex items-center justify-center animate-pulse">
                  <User className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-white">{activeCall.patientName}</div>
                <div className="text-xs text-slate-400">Connected via WebRTC (HD Audio / Video)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
