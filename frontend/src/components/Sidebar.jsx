import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Scan, 
  Bot, 
  Users, 
  CalendarCheck, 
  ShieldCheck, 
  HeartPulse,
  Sparkles,
  MapPin,
  Building2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, badge: 'Live' },
    { id: 'diagnostics', label: t('nav.diagnostics'), icon: Activity, badge: 'AI' },
    { id: 'radiology', label: t('nav.radiology'), icon: Scan, badge: 'Vision' },
    { id: 'copilot', label: t('nav.copilot'), icon: Bot, badge: 'Voice' },
    { id: 'clinics', label: t('nav.clinics'), icon: MapPin, badge: 'GPS' },
    { id: 'patients', label: t('nav.patients'), icon: Users, count: '5' },
    { id: 'appointments', label: t('nav.appointments'), icon: CalendarCheck },
    { id: 'admin', label: t('nav.admin') || 'Admin Paneli', icon: Building2, badge: 'Admin' },
    { id: 'login', label: t('nav.login') || 'Login / Kirish', icon: ShieldCheck, badge: 'Auth' },
  ];

  return (
    <aside className="w-72 bg-[#0b1329]/95 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-xl select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/30">
            <HeartPulse className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                MedAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-700/50">
                .NET 10
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Clinical Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t('nav.clinicalModules')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/20 to-indigo-600/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/60 m-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/80 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-emerald-400">{t('nav.coreOnline')}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">v2.4.1</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          ASP.NET Core 10.0 + EF Core + AI Voice Engine.
        </p>
        <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> {t('nav.hipaa')}
          </span>
          <span className="text-cyan-400 font-mono">99.98% SLA</span>
        </div>
      </div>
    </aside>
  );
}
