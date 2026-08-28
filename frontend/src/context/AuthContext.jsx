import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'medai_auth_user';

export const DEMO_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Vance, MD',
    role: 'Bosh Shifokor / Kardiolog',
    roleRu: 'Главный Врач / Кардиолог',
    roleEn: 'Chief Medical Officer / Cardiologist',
    department: 'Kardiologiya & Telemetriya',
    email: 'sarah.vance@medai.uz',
    avatar: 'SV',
    licenseNumber: 'MD-UZ-99218',
    specialty: 'Interventional Cardiology'
  },
  {
    id: 'doc-2',
    name: 'Dr. Akbar Rahimov, MD',
    role: 'Pulmonolog / Reanimatolog',
    roleRu: 'Пульмонолог / Реаниматолог',
    roleEn: 'Pulmonologist / Critical Care',
    department: 'Pulmonologiya & ICU',
    email: 'akbar.rahimov@medai.uz',
    avatar: 'AR',
    licenseNumber: 'MD-UZ-84112',
    specialty: 'Pulmonology & Critical Care'
  },
  {
    id: 'doc-3',
    name: 'Dr. Madina Karimova, MD',
    role: 'Nevrolog / Neyroradiolog',
    roleRu: 'Невролог / Нейрорадиолог',
    roleEn: 'Neurologist / Neuro-radiologist',
    department: 'Nevrologiya & MRT Lab',
    email: 'madina.karimova@medai.uz',
    avatar: 'MK',
    licenseNumber: 'MD-UZ-71304',
    specialty: 'Neurology & Stroke Center'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if matched one of demo doctors or generate custom doctor profile
    const matchedDoctor = DEMO_DOCTORS.find(d => d.email.toLowerCase() === email.toLowerCase().trim());
    
    const loggedUser = matchedDoctor || {
      id: `doc-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()) || 'Dr. Navbatchi Shifokor',
      role: 'Klinik Shifokor',
      roleRu: 'Клинический Врач',
      roleEn: 'Clinical Physician',
      department: 'Umumiy Terapiya & Qabul',
      email: email,
      avatar: (email[0] || 'D').toUpperCase(),
      licenseNumber: `MD-UZ-${Math.floor(10000 + Math.random() * 90000)}`,
      specialty: 'General Medicine & Triage'
    };

    setUser(loggedUser);
    setLoading(false);
    return loggedUser;
  };

  const loginAsDemo = async (doctorIndex = 0) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    const doctor = DEMO_DOCTORS[doctorIndex] || DEMO_DOCTORS[0];
    setUser(doctor);
    setLoading(false);
    return doctor;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      loginAsDemo,
      logout,
      demoDoctors: DEMO_DOCTORS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
