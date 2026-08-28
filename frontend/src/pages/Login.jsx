import React, { useState } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Stethoscope, 
  Activity, 
  Fingerprint, 
  CheckCircle2, 
  Bot, 
  MapPin, 
  Scan, 
  Globe, 
  Sun, 
  Moon,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useAuth, DEMO_DOCTORS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Login({ onLoginSuccess }) {
  const { login, loginAsDemo, loading } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('sarah.vance@medai.uz');
  const [password, setPassword] = useState('••••••••••••');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [scanningFingerprint, setScanningFingerprint] = useState(false);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await login(email, password);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleBiometricLogin = async () => {
    setScanningFingerprint(true);
    setTimeout(async () => {
      await loginAsDemo(selectedDemoIndex);
      setScanningFingerprint(false);
      if (onLoginSuccess) onLoginSuccess();
    }, 1200);
  };

  const handleQuickDemo = async (index) => {
    setSelectedDemoIndex(index);
    await loginAsDemo(index);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isDark ? 'bg-[#060b14] text-slate-100' : 'bg-[#eef4fb] text-slate-900'} relative overflow-hidden selection:bg-cyan-500 selection:text-white transition-colors duration-300`}>
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-sky-400/10 blur-[100px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-slate-800/40 backdrop-blur-md">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/40">
            <HeartPulse className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                MedAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-700/50">
                v2026 Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Clinical Intelligence Platform
            </p>
          </div>
        </div>

        {/* Right Controls: Language & Theme */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
            >
              <span>{languages.find(l => l.code === lang)?.flag}</span>
              <span className="hidden sm:inline">{languages.find(l => l.code === lang)?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 space-y-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      lang === l.code
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Highlights & Medical Capabilities (5 cols) */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'uz' ? 'Tibbiy Klinik Sun\'iy Intellekt' : lang === 'ru' ? 'Медицинский Клинический ИИ' : 'Medical Clinical AI Platform'}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              {lang === 'uz' ? (
                <>Shifokorlar va Kasalxonalar uchun <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Intellektual Boshqaruv</span></>
              ) : lang === 'ru' ? (
                <>Интеллектуальная система для <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Врачей и Клиник</span></>
              ) : (
                <>Next-Gen Intelligence for <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Clinicians & Hospitals</span></>
              )}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {lang === 'uz' 
                ? 'EKG telemetriyasi, AI differensial diagnostika (MKX-10), ovozli konsilium, rentgen/MRT neyron tahlili va yaqin shifoxonalar xaritasi — barchasi yagona xavfsiz tizimda.'
                : lang === 'ru'
                ? 'Телеметрия ЭКГ, ИИ-дифференциальная диагностика (МКБ-10), голосовой консилиум, анализ рентген/МРТ и карта клиник.'
                : '12-lead ECG telemetry, ICD-10 differential diagnosis, Voice Copilot consultation, PACS radiology vision, and nearest hospital GPS locator.'}
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Activity className="w-4 h-4" />
                  <span>12-Lead ECG Live</span>
                </div>
                <p className="text-[11px] text-slate-400">Real-vaqt telemetriya & aritmiya aniqlash</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>Voice AI Doctor</span>
                </div>
                <p className="text-[11px] text-slate-400">Ovozli tibbiy konsilium (TTS / STT)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Scan className="w-4 h-4" />
                  <span>Radiology Vision</span>
                </div>
                <p className="text-[11px] text-slate-400">Rentgen & MRT anomaliya segmentatsiyasi</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>GPS Hospital Map</span>
                </div>
                <p className="text-[11px] text-slate-400">Toshkent shifoxonalar masofasi va 103</p>
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="flex items-center gap-4 pt-3 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> HIPAA & HL7 FHIR
              </span>
              <span>•</span>
              <span className="text-cyan-400 font-mono">AES-256 Bit Encrypted</span>
            </div>
          </div>

          {/* Right Column: Authentication Card (6 cols) */}
          <div className="lg:col-span-6 w-full">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="mb-6 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    <Stethoscope className="w-4 h-4" />
                    <span>{lang === 'uz' ? 'Shifokor Identifikatsiyasi' : lang === 'ru' ? 'Авторизация Врача' : 'Clinician Authorization'}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {lang === 'uz' ? 'Tizimga Kirish' : lang === 'ru' ? 'Вход в Систему' : 'Doctor Portal Sign In'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'uz' 
                    ? 'Bemorlar bazasi va AI diagnostikaga kirish uchun akkountingizni tasdiqlang' 
                    : lang === 'ru' 
                    ? 'Подтвердите учетную запись для доступа к историям болезни и ИИ'
                    : 'Authenticate credentials to access electronic health records'}
                </p>
              </div>

              {/* 1-Click Quick Demo Login Section */}
              <div className="mb-6 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <span>{lang === 'uz' ? 'Tezkor Kirish (Demo Shifokorlar):' : lang === 'ru' ? 'Быстрый вход (Врачи-демо):' : 'Quick 1-Click Demo Profiles:'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_DOCTORS.map((doc, idx) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleQuickDemo(idx)}
                      disabled={loading}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedDemoIndex === idx
                          ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200 shadow-md ring-1 ring-cyan-500/30'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center font-mono">
                          {doc.avatar}
                        </div>
                        <div className="text-[11px] font-bold truncate text-white">{doc.name.split(',')[0]}</div>
                      </div>
                      <div className="text-[9px] text-slate-400 truncate mt-1">
                        {lang === 'uz' ? doc.role.split('/')[1] || doc.role : lang === 'ru' ? doc.roleRu.split('/')[1] || doc.roleRu : doc.roleEn.split('/')[1] || doc.roleEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {lang === 'uz' ? 'yoki elektron pochta bilan' : lang === 'ru' ? 'или через email' : 'or with clinical email'}
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    {lang === 'uz' ? 'Shifokor Elektron Pochtasi' : lang === 'ru' ? 'Email Врача' : 'Clinician Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@medai.uz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {lang === 'uz' ? 'Klinik Parol' : lang === 'ru' ? 'Пароль' : 'Password'}
                    </label>
                    <span className="text-[10px] text-cyan-400 hover:underline cursor-pointer">
                      {lang === 'uz' ? 'Parolni tiklash' : lang === 'ru' ? 'Забыли пароль?' : 'Forgot password?'}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>{lang === 'uz' ? 'Tekshirilmoqda...' : lang === 'ru' ? 'Авторизация...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === 'uz' ? 'Tizimga Kirish' : lang === 'ru' ? 'Войти в Систему' : 'Authenticate & Enter Portal'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Biometric Touch ID Simulation Button */}
                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={scanningFingerprint || loading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Fingerprint className={`w-4 h-4 ${scanningFingerprint ? 'text-rose-400 animate-ping' : 'text-cyan-400'}`} />
                  <span>
                    {scanningFingerprint 
                      ? (lang === 'uz' ? 'Barmoq izi skanerlanmoqda...' : lang === 'ru' ? 'Сканирование отпечатка...' : 'Scanning Biometrics...') 
                      : (lang === 'uz' ? 'Biometrik Barmoq Izi bilan kirish' : lang === 'ru' ? 'Вход по биометрии' : 'Touch ID / Biometric Sign-In')}
                  </span>
                </button>
              </form>

              {/* License Status Banner */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'uz' ? 'SSL 256-bit Shifrlangan' : lang === 'ru' ? 'SSL 256-бит Защита' : 'SSL Encrypted'}
                </span>
                <span className="font-mono text-cyan-400">MedAI Core 2026.4</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 py-4 px-6 sm:px-12 border-t border-slate-800/40 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 MedAI Technologies Inc. Barcha huquqlar himoyalangan.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400 hover:text-cyan-300 cursor-pointer">Maxfiylik Siyosati</span>
          <span>•</span>
          <span className="text-slate-400 hover:text-cyan-300 cursor-pointer">Klinik Protokollar</span>
          <span>•</span>
          <span className="text-slate-400 hover:text-cyan-300 cursor-pointer">Yordam Markazi</span>
        </div>
      </footer>
    </div>
  );
}
