import React, { useState } from 'react';
import { 
  Scan, 
  UploadCloud, 
  Sparkles, 
  Eye, 
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SAMPLE_SCANS = [
  {
    id: 1,
    scanType: 'Chest X-Ray (AP View)',
    patientName: 'Elena Rostova (42y)',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
    severity: 'Moderate',
    confidenceScore: 96.8,
    findings: 'Bilateral lower lobe interstitial infiltrates and consolidation consistent with viral pneumonia.',
    anomalies: [
      { label: 'Consolidation (Left Lower Lobe)', confidencePercent: 97.4, location: 'Left Lower Zone', boxX: 52, boxY: 58, boxWidth: 26, boxHeight: 24 },
      { label: 'Ground-Glass Opacity', confidencePercent: 91.2, location: 'Right Middle Zone', boxX: 22, boxY: 42, boxWidth: 22, boxHeight: 20 }
    ]
  },
  {
    id: 2,
    scanType: 'Brain MRI (DWI / Axial)',
    patientName: 'Madina Yusupova (67y)',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    severity: 'Critical',
    confidenceScore: 99.1,
    findings: 'Hyperintense signal on DWI in right MCA territory with ADC hypointensity. Acute ischemic infarct.',
    anomalies: [
      { label: 'Acute Infarction Core', confidencePercent: 99.1, location: 'Right MCA Cortical Territory', boxX: 34, boxY: 28, boxWidth: 32, boxHeight: 30 }
    ]
  },
  {
    id: 3,
    scanType: 'CT Thorax (High Resolution)',
    patientName: 'Jasur Alimov (58y)',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    severity: 'Mild',
    confidenceScore: 94.5,
    findings: 'Coronary artery calcification (Agatston score > 300). Mild emphysematous changes.',
    anomalies: [
      { label: 'LAD Calcification', confidencePercent: 94.5, location: 'LAD Artery Bed', boxX: 46, boxY: 48, boxWidth: 16, boxHeight: 14 }
    ]
  }
];

export default function RadiologyLab() {
  const { t } = useLanguage();
  const [selectedScan, setSelectedScan] = useState(SAMPLE_SCANS[0]);
  const [scanning, setScanning] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [signedOff, setSignedOff] = useState(false);
  const [activeAnomaly, setActiveAnomaly] = useState(null);

  const handleRunAiAnalysis = () => {
    setScanning(true);
    setSignedOff(false);
    setTimeout(() => {
      setScanning(false);
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Scan className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('radiology.title')}
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {t('radiology.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              showOverlays
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showOverlays ? t('radiology.overlaysActive') : t('radiology.overlaysHidden')}</span>
          </button>

          <button
            onClick={handleRunAiAnalysis}
            disabled={scanning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{scanning ? t('radiology.scanning') : t('radiology.reScan')}</span>
          </button>
        </div>
      </div>

      {/* Main Vision Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scan Selector & Uploads (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('radiology.activeStudies')} ({SAMPLE_SCANS.length})
            </h3>
            <div className="space-y-2.5">
              {SAMPLE_SCANS.map((scan) => {
                const isSelected = selectedScan.id === scan.id;
                return (
                  <div
                    key={scan.id}
                    onClick={() => {
                      setSelectedScan(scan);
                      setSignedOff(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{scan.scanType}</span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        scan.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : scan.severity === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {scan.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-medium">
                      Patient: <span className="text-slate-200">{scan.patientName}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                      <span>Anomalies: {scan.anomalies.length}</span>
                      <span className="text-indigo-400 font-mono font-bold">Conf: {scan.confidenceScore}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-dashed border-slate-700 text-center space-y-3 hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 mx-auto flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{t('radiology.uploadTitle')}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{t('radiology.uploadSubtitle')}</div>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
              {t('radiology.pacsSupport')}
            </span>
          </div>
        </div>

        {/* Right: Interactive Image Viewer & AI Findings (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 relative">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-white font-bold">{selectedScan.scanType}</span>
                <span>• {selectedScan.patientName}</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {t('radiology.lossless')}
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center group select-none">
              <img
                src={selectedScan.imageUrl}
                alt="Radiology Study"
                className="w-full h-full object-cover filter contrast-125 brightness-90 transition-all duration-300"
              />

              {scanning && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce" />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500 text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase">
                      {t('radiology.scanning')}
                    </span>
                  </div>
                </div>
              )}

              {!scanning && showOverlays && selectedScan.anomalies.map((anom, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveAnomaly(anom)}
                  className={`absolute border-2 transition-all cursor-pointer group/box ${
                    activeAnomaly?.label === anom.label
                      ? 'border-rose-400 bg-rose-500/20 ring-4 ring-rose-500/30'
                      : 'border-cyan-400 bg-cyan-500/15 hover:bg-cyan-500/30'
                  }`}
                  style={{
                    left: `${anom.boxX}%`,
                    top: `${anom.boxY}%`,
                    width: `${anom.boxWidth}%`,
                    height: `${anom.boxHeight}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-slate-950/90 border border-cyan-400 text-[10px] font-mono font-bold text-cyan-300 whitespace-nowrap shadow-lg">
                    {anom.label} ({anom.confidencePercent}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {t('radiology.findingsSummary')}
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {t('radiology.findingsAndAnomalies')}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">Inference Confidence</div>
                <div className="text-lg font-extrabold text-cyan-400 font-mono">
                  {selectedScan.confidenceScore}%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {selectedScan.findings}
            </p>

            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('radiology.identifiedRoi')}
              </div>
              {selectedScan.anomalies.map((anom, i) => (
                <div
                  key={i}
                  onClick={() => setActiveAnomaly(anom)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    activeAnomaly?.label === anom.label
                      ? 'bg-slate-800/90 border-cyan-500/50'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center font-mono">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{anom.label}</div>
                      <div className="text-[10px] text-slate-400">Location: {anom.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-cyan-300 font-mono">
                      {anom.confidencePercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{t('radiology.signatureRequired')}</span>
              </div>

              {signedOff ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('radiology.reportSigned')}</span>
                </div>
              ) : (
                <button
                  onClick={() => setSignedOff(true)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span>{t('radiology.signAndApprove')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
