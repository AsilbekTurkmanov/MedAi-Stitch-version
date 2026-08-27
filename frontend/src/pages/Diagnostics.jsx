import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Pill, 
  FlaskConical, 
  Layers, 
  ArrowRight,
  User,
  Heart,
  Thermometer,
  Wind
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Diagnostics({ preselectedPatient = null }) {
  const { lang, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('chest');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Ko‘krak qafasida og‘riq', 'Nafas qisilishi']);
  const [customSymptom, setCustomSymptom] = useState('');
  
  // Patient parameters
  const [patientName, setPatientName] = useState(preselectedPatient?.fullName || 'Jasur Alimov');
  const [patientAge, setPatientAge] = useState(preselectedPatient?.age || 58);
  const [patientGender, setPatientGender] = useState(preselectedPatient?.gender || 'Male');
  const [duration, setDuration] = useState('4 hours');
  const [severity, setSeverity] = useState('Severe');

  // Vitals
  const [hr, setHr] = useState(118);
  const [bp, setBp] = useState('165/105');
  const [spo2, setSpo2] = useState(91);
  const [temp, setTemp] = useState(37.4);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getBodyRegions = () => {
    if (lang === 'uz') {
      return [
        { id: 'chest', label: 'Yurak va Ko‘krak Qafasi', symptoms: ['Ko‘krak qafasida og‘riq', 'Yurak tez urishi (aritmiya)', 'Nafas qisilishi', 'Chap qo‘lga beruvchi og‘riq', 'Muzdek yopishqoq ter'] },
        { id: 'respiratory', label: 'O‘pka va Nafas Yo‘llari', symptoms: ['Balghamli yo‘tal', 'Yuqori tana harorati', 'Hansirash', 'Xirillashli nafas', 'Ko‘krak sanchishi'] },
        { id: 'neuro', label: 'Bosh va Nevrologiya', symptoms: ['Kuchli bosh og‘rig‘i', 'Bosh aylanishi', 'Ko‘z oldi xiralashishi', 'Nutq buzilishi', 'Bir tomonlama holsizlik'] },
        { id: 'gi', label: 'Oshqozon-Ichak Tizimi', symptoms: ['Epigastral sohada og‘riq', 'Ko‘ngil aynishi / Qayt qilish', 'Jig‘ildon qaynashi', 'Qorin dam bo‘lishi', 'Diareyali buzilish'] },
        { id: 'general', label: 'Umumiy Belgilar', symptoms: ['Kuchli isitma (>38.5°C)', 'Holsizlik va lanjlik', 'Mushaklarda qaqshash', 'Sovqotish / Titroq', 'Ishtahasizlik'] }
      ];
    } else if (lang === 'ru') {
      return [
        { id: 'chest', label: 'Сердечно-сосудистая система', symptoms: ['Боль за грудиной', 'Учащенное сердцебиение', 'Одышка при нагрузке', 'Иррадиация в левую руку', 'Холодный липкий пот'] },
        { id: 'respiratory', label: 'Дыхательная система', symptoms: ['Продуктивный кашель', 'Высокая температура', 'Затрудненное дыхание', 'Свистящие хрипы', 'Боль в груди при вдохе'] },
        { id: 'neuro', label: 'Неврология и Голова', symptoms: ['Острая головная боль', 'Головокружение', 'Зрительные нарушения', 'Смазанная речь', 'Слабость в конечностях'] },
        { id: 'gi', label: 'Желудочно-кишечный тракт', symptoms: ['Боль в эпигастрии', 'Тошнота и рвота', 'Изжога / Рефлюкс', 'Вздутие живота', 'Диарея'] },
        { id: 'general', label: 'Общие симптомы', symptoms: ['Лихорадка (>38.5°C)', 'Выраженная слабость', 'Ломота в мышцах', 'Озноб', 'Потеря аппетита'] }
      ];
    } else {
      return [
        { id: 'chest', label: 'Chest & Cardiovascular', symptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Left arm radiation', 'Cold diaphoresis'] },
        { id: 'respiratory', label: 'Pulmonary & Airways', symptoms: ['Productive cough', 'High fever', 'Dyspnea', 'Wheezing', 'Pleuritic chest discomfort'] },
        { id: 'neuro', label: 'Head & Neurological', symptoms: ['Severe headache', 'Dizziness', 'Visual aura', 'Slurred speech', 'Unilateral weakness'] },
        { id: 'gi', label: 'Abdomen & GI Tract', symptoms: ['Epigastric pain', 'Nausea / Vomiting', 'Acid reflux / Pyrosis', 'Abdominal bloating', 'Diarrhea'] },
        { id: 'general', label: 'Constitutional Symptoms', symptoms: ['High fever (>38.5°C)', 'Extreme fatigue', 'Myalgia / Body aches', 'Chills', 'Loss of appetite'] }
      ];
    }
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const addCustomSymptom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRunDiagnosis = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        patientId: preselectedPatient?.id || 1,
        patientName,
        age: Number(patientAge),
        gender: patientGender,
        symptoms: selectedSymptoms,
        duration,
        severity,
        vitals: {
          heartRate: Number(hr),
          spO2: Number(spo2),
          temperature: Number(temp)
        },
        additionalNotes: `BP: ${bp}`
      };

      const res = await api.analyzeSymptoms(payload);
      setResult(res);
    } catch (err) {
      console.error('Diagnostic run failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('diagnostics.title')}
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {t('diagnostics.subtitle')}
          </p>
        </div>

        <button
          onClick={handleRunDiagnosis}
          disabled={loading || selectedSymptoms.length === 0}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span>{t('diagnostics.analyzing')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{t('diagnostics.execInference')}</span>
            </>
          )}
        </button>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient & Vitals (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Context Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <User className="w-4 h-4" /> {t('diagnostics.demographics')}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('diagnostics.fullName')}</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('diagnostics.age')}</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('diagnostics.gender')}</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Male">{t('diagnostics.male')}</option>
                    <option value="Female">{t('diagnostics.female')}</option>
                    <option value="Other">{t('diagnostics.other')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('diagnostics.duration')}</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('diagnostics.severity')}</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Mild">{t('diagnostics.mild')}</option>
                    <option value="Moderate">{t('diagnostics.moderate')}</option>
                    <option value="Severe">{t('diagnostics.severe')}</option>
                    <option value="Critical">{t('diagnostics.critical')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Input Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> {t('diagnostics.vitals')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  ЧСС / BPM
                </label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-rose-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">АД / BP</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-amber-400" /> SpO2 (%)
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-emerald-400" /> Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Symptom Picker & Body Systems (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Anatomical Regions Selector */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('diagnostics.selectSystem')}
            </h3>

            {/* Region Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {getBodyRegions().map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedRegion === region.id
                      ? 'bg-gradient-to-br from-cyan-600/30 to-indigo-600/20 border-cyan-500/50 text-cyan-300 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{region.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{region.symptoms.length} symptoms</div>
                </button>
              ))}
            </div>

            {/* Symptom Cloud for Selected Region */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-slate-400 block mb-2">
                {t('diagnostics.clickToAddRemove')}
              </label>
              <div className="flex flex-wrap gap-2">
                {getBodyRegions().find(r => r.id === selectedRegion)?.symptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>{symptom}</span>
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> : <span className="text-slate-400">+</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Symptom Input */}
            <form onSubmit={addCustomSymptom} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder={t('diagnostics.customPlaceholder')}
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700 transition-all cursor-pointer"
              >
                {t('diagnostics.addBtn')}
              </button>
            </form>

            {/* Active Selected Symptoms Badges */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                {t('diagnostics.activeSymptoms')} ({selectedSymptoms.length}):
              </div>
              {selectedSymptoms.length === 0 ? (
                <span className="text-xs text-slate-400 italic">{t('diagnostics.noSymptoms')}</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSymptoms.map((sym) => (
                    <span
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-rose-950 hover:border-rose-700 hover:text-rose-300 transition-all"
                    >
                      {sym} <span className="text-[10px] opacity-70">✕</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Diagnostic Results Presentation */}
          {result && (
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 space-y-6 animate-fadeIn">
              {/* Result Overview Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                    ID: {result.assessmentId}
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {t('diagnostics.inferenceResult')}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-semibold">{t('diagnostics.confidence')}</div>
                    <div className="text-lg font-extrabold text-emerald-400 font-mono">
                      {result.confidenceScore}%
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider border ${
                    result.overallRiskLevel === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 glow-rose'
                      : result.overallRiskLevel === 'High'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {result.overallRiskLevel} {t('diagnostics.riskTriage')}
                  </div>
                </div>
              </div>

              {/* Summary Text */}
              <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                {result.summary}
              </p>

              {/* Red Flags Alert if present */}
              {result.redFlagSymptoms?.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    <span>{t('diagnostics.redFlags')}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                    {result.redFlagSymptoms.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Differential Diagnosis Matches */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" /> {t('diagnostics.diffRanking')}
                </h3>
                <div className="space-y-3">
                  {result.differentialDiagnoses?.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-sm text-white">{item.diseaseName}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                            MKX-10: {item.icd10Code}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-cyan-300 font-mono">
                            {item.probabilityPercent}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">{t('diagnostics.probability')}</span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400"
                          style={{ width: `${item.probabilityPercent}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-400 mb-2">{item.description}</p>
                      <div className="text-[11px] text-slate-300 font-medium bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                        <strong className="text-cyan-400">{t('diagnostics.rationale')} </strong>
                        {item.clinicalRationale}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations & Lab Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Lab tests */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase">
                    <FlaskConical className="w-4 h-4" /> {t('diagnostics.labOrders')}
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {result.recommendedLabTests?.map((test, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase">
                    <FileText className="w-4 h-4" /> {t('diagnostics.triageSteps')}
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {result.recommendedActions?.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Drug Suggestions */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                    <Pill className="w-4 h-4" /> {t('diagnostics.pharmacotherapy')}
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {result.drugSuggestions?.map((drug, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{drug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
