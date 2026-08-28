import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  ShieldAlert, 
  Activity, 
  UserPlus,
  Stethoscope,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenNewPatient, onQuickDiag, criticalCount = 2 }) {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  return (
    <header className="h-20 bg-[#090e1d]/80 border-b border-slate-800/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Actions, Language, Theme, Alerts */}
      <div className="flex items-center gap-3">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            <span>{languages.find(l => l.code === lang)?.flag}</span>
            <span>{languages.find(l => l.code === lang)?.label}</span>
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

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
          title={isDark ? t('header.themeLight') : t('header.themeDark')}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Critical Alerts Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>{criticalCount} {t('header.criticalAlerts')}</span>
        </div>

        {/* Quick Diagnostic Action */}
        <button
          onClick={onQuickDiag}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 transition-all active:scale-95 cursor-pointer"
        >
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">{t('header.launchTriage')}</span>
        </button>

        {/* Add Patient Button */}
        <button
          onClick={onOpenNewPatient}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">{t('header.addPatient')}</span>
        </button>

        {/* Clinician Profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-cyan-400 text-xs font-mono">
              {user?.avatar || 'MD'}
            </div>
          </div>
          <div className="text-left hidden xl:block">
            <div className="text-xs font-bold text-slate-200">{user?.name || 'Dr. Sarah Vance, MD'}</div>
            <div className="text-[10px] text-cyan-400 font-medium">
              {lang === 'uz' ? (user?.role || t('header.doctorRole')) : lang === 'ru' ? (user?.roleRu || user?.role) : (user?.roleEn || user?.role)}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700/50 text-slate-400 hover:text-rose-300 transition-all cursor-pointer ml-1"
            title={lang === 'uz' ? 'Tizimdan chiqish' : lang === 'ru' ? 'Выйти из системы' : 'Log out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
