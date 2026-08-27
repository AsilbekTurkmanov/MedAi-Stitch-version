# 🏥 MedAI - Next-Gen Clinical Intelligence & Telehealth Platform

> **MedAI** is an enterprise-grade medical platform featuring a modern **React.js Frontend** (with full multilingual support, Dark/Light mode, live ECG telemetry, and voice-assisted AI consultation) and a high-performance **C# .NET 10 Web API Backend**.

---

## 🌟 Key Features

1. **🌐 3 Full Languages**:
   - **O'zbekcha 🇺🇿** (100% toza o'zbek tili)
   - **Русский 🇷🇺**
   - **English 🇬🇧**

2. **🌙 Dark Mode & ☀️ Light Mode**:
   - Dynamic theme switcher with custom hospital clinic and cyberpunk neon aesthetics.

3. **🎙️ Voice AI Doctor (Ovozli AI Shifokor)**:
   - **Text-to-Speech (TTS)** in Uzbek, Russian, and English.
   - **Voice Dictation (STT)** microphone input for hands-free clinical consultations.
   - Pharmacotherapy & Drug-Drug interaction evaluator (e.g., Clopidogrel vs. Omeprazole).

4. **📍 GPS Geolocation & Google Maps Nearest Clinics**:
   - Live GPS patient location tracking.
   - Distance computation (km) to emergency trauma centers and hospitals (RRCEM 16-Gorklinika, Akfa Medline, Shox Med, Cardiology Center).
   - One-click Google Maps route navigation and 103 Emergency Calling.

5. **🔬 AI Radiology & Computer Vision Lab**:
   - Chest X-Ray, Brain MRI (DWI), and CT Thorax studies.
   - Neural segmentation with bounding box overlays for lesion detection.

6. **📋 Patient Electronic Health Records (EHR)**:
   - Live 12-lead ECG telemetry stream simulation.
   - Vitals logger (BPM, BP, SpO2, Temp).
   - Digital e-Prescriptions generator with SHA-256 validation.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Web Speech API (TTS/STT), Geolocation API.
- **Backend**: C# 10, ASP.NET Core 10.0 Web API, Entity Framework Core (In-Memory / SQLite), Swagger/OpenAPI.

---

## 🚀 Getting Started

### Backend (.NET 10 API)
```bash
cd backend/MedAi.Api
dotnet run --urls "http://localhost:5000"
```
*API Swagger Docs: `http://localhost:5000/swagger`*

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Web App: `http://localhost:5173`*

---

## 📦 Deploy to Vercel (Frontend)
Click below to deploy the frontend directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AsilbekTurkmanov/MedAi-Stitch-version&root-directory=frontend)
