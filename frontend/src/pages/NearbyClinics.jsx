import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star, 
  Search, 
  ShieldAlert, 
  ExternalLink, 
  LocateFixed, 
  Sparkles, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const PRESET_CITIES = [
  { name: 'Toshkent Markaz', lat: 41.311081, lng: 69.240562 },
  { name: 'Chilonzor', lat: 41.2858, lng: 69.2084 },
  { name: 'Yunusobod', lat: 41.3655, lng: 69.2882 },
  { name: 'Samarqand', lat: 39.6542, lng: 66.9597 },
  { name: 'Buxoro', lat: 39.7747, lng: 64.4286 }
];

export default function NearbyClinics() {
  const { lang, t } = useLanguage();
  const [userLocation, setUserLocation] = useState({ lat: 41.311081, lng: 69.240562, name: 'Toshkent shahar (GPS)' });
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeClinic, setActiveClinic] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    fetchClinics(userLocation.lat, userLocation.lng);
  }, [userLocation, selectedCategory]);

  const fetchClinics = async (lat, lng) => {
    setLoading(true);
    try {
      const data = await api.getNearbyClinics(lat, lng, selectedCategory);
      setClinics(data);
      if (data.length > 0) {
        setActiveClinic(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch clinics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Brauzeringizda geolokatsiya qo‘llab-quvvatlanmaydi.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        };
        setUserLocation(coords);
        setGpsLoading(false);
      },
      (error) => {
        console.warn('GPS error, using default', error);
        setGpsLoading(false);
        alert('GPS koordinatasini olishda xatolik yuz berdi. Standart Toshkent lokatsiyasi ishlatilmoqda.');
      },
      { timeout: 10000 }
    );
  };

  const filteredClinics = clinics.filter(c => {
    const name = (lang === 'uz' ? c.nameUz : lang === 'ru' ? c.nameRu : c.nameEn) || '';
    const address = (lang === 'uz' ? c.addressUz : lang === 'ru' ? c.addressRu : c.addressEn) || '';
    return name.toLowerCase().includes(search.toLowerCase()) || address.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('clinics.title')}
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {t('clinics.subtitle')}
          </p>
        </div>

        {/* Emergency Call 103 */}
        <a
          href="tel:103"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950 flex items-center gap-2 transition-all active:scale-95 cursor-pointer self-start md:self-auto animate-pulse"
        >
          <Phone className="w-4 h-4" />
          <span>{t('clinics.callEmergency')}</span>
        </a>
      </div>

      {/* GPS & Location Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <LocateFixed className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">{t('clinics.myLocation')}</div>
            <div className="text-xs font-bold text-white font-mono">{userLocation.name} ({userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)})</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleGetLiveGps}
            disabled={gpsLoading}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Compass className="w-4 h-4" />
            <span>{gpsLoading ? 'GPS...' : t('clinics.detectGps')}</span>
          </button>

          {/* City selector */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <span className="text-[11px] text-slate-400">{t('clinics.selectCity')}</span>
            <select
              onChange={(e) => {
                const city = PRESET_CITIES.find(c => c.name === e.target.value);
                if (city) setUserLocation(city);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
            >
              {PRESET_CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace: Clinics List (5 cols) & Interactive Map Simulator (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clinics Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('clinics.searchClinicPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredClinics.map((clinic) => {
              const isSelected = activeClinic?.id === clinic.id;
              const name = lang === 'uz' ? clinic.nameUz : lang === 'ru' ? clinic.nameRu : clinic.nameEn;
              const address = lang === 'uz' ? clinic.addressUz : lang === 'ru' ? clinic.addressRu : clinic.addressEn;
              const category = lang === 'uz' ? clinic.categoryUz : lang === 'ru' ? clinic.categoryRu : clinic.categoryEn;

              return (
                <div
                  key={clinic.id}
                  onClick={() => setActiveClinic(clinic)}
                  className={`glass-panel glass-panel-hover rounded-2xl p-4 border transition-all cursor-pointer ${
                    isSelected ? 'border-cyan-500/60 bg-slate-800/90 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-white leading-snug">{name}</h3>
                      <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">{category}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-emerald-400 font-mono">
                        {clinic.distanceKm} km
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase">{t('clinics.distance')}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 font-medium">
                    {address}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {clinic.rating}
                      </span>
                      {clinic.isEmergency247 && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          24/7 ER
                        </span>
                      )}
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Map & Detail Preview Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Simulated Google Map Viewport */}
          <div className="relative h-72 rounded-2xl overflow-hidden bg-[#0a111e] border border-slate-800 flex items-center justify-center select-none shadow-2xl">
            {/* Grid & Map graphics simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
            
            {/* Radar wave around patient */}
            <div className="absolute w-44 h-44 rounded-full border border-cyan-500/30 animate-ping pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            {/* Patient Marker Label */}
            <div className="absolute top-1/2 -mt-10 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-[10px] font-bold font-mono shadow-lg">
              📍 {t('clinics.myLocation')}
            </div>

            {/* Active Clinic Pins */}
            {filteredClinics.slice(0, 5).map((c, i) => {
              const offsets = [
                { top: '25%', left: '30%' },
                { top: '35%', right: '25%' },
                { bottom: '25%', left: '40%' },
                { top: '65%', right: '35%' },
                { bottom: '35%', right: '15%' }
              ];
              const pos = offsets[i % offsets.length];
              const isActive = activeClinic?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveClinic(c)}
                  style={pos}
                  className={`absolute p-2 rounded-xl border transition-all cursor-pointer shadow-lg flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-600 border-rose-300 text-white scale-110 z-20 animate-bounce'
                      : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:scale-105 z-10'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold whitespace-nowrap">{c.distanceKm} km</span>
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 font-mono">
              Live GIS Projection: WGS84 • Radius 15km
            </div>
          </div>

          {/* Active Clinic Detail Dossier */}
          {activeClinic && (
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 space-y-4">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {lang === 'uz' ? activeClinic.nameUz : lang === 'ru' ? activeClinic.nameRu : activeClinic.nameEn}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'uz' ? activeClinic.addressUz : lang === 'ru' ? activeClinic.addressRu : activeClinic.addressEn}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-400 font-mono">
                    {activeClinic.distanceKm} km
                  </div>
                  <div className="text-[10px] text-slate-400">{t('clinics.distance')}</div>
                </div>
              </div>

              {/* Services & Specialties */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t('clinics.servicesTitle')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'uz' ? activeClinic.servicesUz : lang === 'ru' ? activeClinic.servicesRu : activeClinic.servicesEn).map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-[11px] font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>{srv}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>{activeClinic.workingHours}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{activeClinic.phoneNumber}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeClinic.phoneNumber}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t('clinics.directPhone')}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeClinic.latitude},${activeClinic.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 text-xs font-bold text-white shadow-lg shadow-cyan-950 transition-all flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t('clinics.openGoogleMaps')}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
