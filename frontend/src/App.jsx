import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Diagnostics from './pages/Diagnostics';
import RadiologyLab from './pages/RadiologyLab';
import Copilot from './pages/Copilot';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import NearbyClinics from './pages/NearbyClinics';
import Login from './pages/Login';
import { api } from './services/api';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { X, UserPlus } from 'lucide-react';

function AppContent() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientForDiag, setSelectedPatientForDiag] = useState(null);

  // New Patient Modal state
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newAge, setNewAge] = useState(45);
  const [newGender, setNewGender] = useState('Male');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');
  const [newCondition, setNewCondition] = useState('Monitoring');
  const [newTriage, setNewTriage] = useState('Urgent');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newRoom, setNewRoom] = useState('OPD-202');

  const handleLaunchDiagForPatient = (patient) => {
    setSelectedPatientForDiag(patient);
    setActiveTab('diagnostics');
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    try {
      const payload = {
        fullName: newFullName,
        age: Number(newAge),
        gender: newGender,
        bloodGroup: newBloodGroup,
        condition: newCondition,
        triageLevel: newTriage,
        primaryDiagnosis: newDiagnosis || 'Clinical Assessment Pending',
        roomNumber: newRoom,
        vitalSigns: [
          { heartRateBpm: 80, bloodPressure: '120/80', spO2Percent: 98, temperatureC: 36.6 }
        ]
      };

      await api.createPatient(payload);
      setShowNewPatientModal(false);
      setNewFullName('');
      setNewDiagnosis('');
      setActiveTab('patients');
    } catch (err) {
      console.error('Error creating patient', err);
    }
  };

  // If user is not authenticated, show the Login page
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f0f4f9] text-slate-900'} antialiased selection:bg-cyan-500 selection:text-white`}>
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenNewPatient={() => setShowNewPatientModal(true)}
          onQuickDiag={() => setActiveTab('diagnostics')}
          criticalCount={2}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={setActiveTab}
              onSelectPatient={handleLaunchDiagForPatient}
            />
          )}

          {activeTab === 'diagnostics' && (
            <Diagnostics preselectedPatient={selectedPatientForDiag} />
          )}

          {activeTab === 'radiology' && <RadiologyLab />}

          {activeTab === 'copilot' && <Copilot />}

          {activeTab === 'clinics' && <NearbyClinics />}

          {activeTab === 'patients' && (
            <Patients onLaunchDiagForPatient={handleLaunchDiagForPatient} />
          )}

          {activeTab === 'appointments' && <Appointments />}
        </main>
      </div>

      {/* Add New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-cyan-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{t('header.addPatient')}</h3>
              </div>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anvar Saidov"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Condition Status</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Stable">Stable</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Triage Priority</label>
                  <select
                    value={newTriage}
                    onChange={(e) => setNewTriage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Emergency">Emergency (Level 1)</option>
                    <option value="Urgent">Urgent (Level 2)</option>
                    <option value="Standard">Standard (Level 3)</option>
                    <option value="Low">Low / Routine (Level 4)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Acute Appendicitis"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Room / Bed</label>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 text-xs font-bold text-white shadow-lg shadow-cyan-950 cursor-pointer"
                >
                  Save & Admit Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
