using MedAi.Api.Models;

namespace MedAi.Api.Data;

public static class DbInitializer
{
    public static void Initialize(MedAiDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Patients.Any())
        {
            return; // DB has been seeded
        }

        var patients = new List<Patient>
        {
            new Patient
            {
                FullName = "Jasur Alimov",
                Age = 58,
                Gender = "Male",
                BloodGroup = "A+",
                PhoneNumber = "+998 90 123 4567",
                Email = "jasur.alimov@medmail.uz",
                Condition = "Critical",
                PrimaryDiagnosis = "Acute Myocardial Infarction / Unstable Angina",
                TriageLevel = "Emergency",
                RoomNumber = "ICU-03",
                AdmittedDate = DateTime.UtcNow.AddHours(-14),
                Allergies = "Penicillin, Aspirin",
                CurrentMedications = "Heparin 5000 IU, Atorvastatin 40mg, Nitroglycerin IV",
                Notes = "Continuous ECG & SpO2 monitoring required. ST-segment elevation noted in anterior leads.",
                VitalSigns = new List<VitalSign>
                {
                    new VitalSign { HeartRateBpm = 118, BloodPressure = "165/105", TemperatureC = 37.4, SpO2Percent = 91, RespirationRate = 24, BloodSugarMgDl = 142, RecordedAt = DateTime.UtcNow.AddMinutes(-30) },
                    new VitalSign { HeartRateBpm = 124, BloodPressure = "170/110", TemperatureC = 37.5, SpO2Percent = 89, RespirationRate = 26, BloodSugarMgDl = 148, RecordedAt = DateTime.UtcNow.AddMinutes(-10) }
                }
            },
            new Patient
            {
                FullName = "Elena Rostova",
                Age = 42,
                Gender = "Female",
                BloodGroup = "O-",
                PhoneNumber = "+998 93 456 7890",
                Email = "elena.rostova@medmail.uz",
                Condition = "Monitoring",
                PrimaryDiagnosis = "Bilateral Viral Pneumonia / Severe Dyspnea",
                TriageLevel = "Urgent",
                RoomNumber = "Pneumo-204",
                AdmittedDate = DateTime.UtcNow.AddDays(-1),
                Allergies = "Sulfa drugs",
                CurrentMedications = "Dexamethasone 6mg, Azithromycin 500mg, Supplemental O2 (4L/min)",
                Notes = "Patient shows ground-glass opacities in CT Thorax. AI recommends adjusting oxygen flow.",
                VitalSigns = new List<VitalSign>
                {
                    new VitalSign { HeartRateBpm = 88, BloodPressure = "125/82", TemperatureC = 38.3, SpO2Percent = 94, RespirationRate = 20, BloodSugarMgDl = 105, RecordedAt = DateTime.UtcNow.AddHours(-2) },
                    new VitalSign { HeartRateBpm = 84, BloodPressure = "120/80", TemperatureC = 37.8, SpO2Percent = 96, RespirationRate = 18, BloodSugarMgDl = 98, RecordedAt = DateTime.UtcNow.AddMinutes(-20) }
                }
            },
            new Patient
            {
                FullName = "Bobur Karimov",
                Age = 29,
                Gender = "Male",
                BloodGroup = "B+",
                PhoneNumber = "+998 97 789 0123",
                Email = "bobur.karimov@medmail.uz",
                Condition = "Stable",
                PrimaryDiagnosis = "Acute Bronchitis & Rhinosinusitis",
                TriageLevel = "Standard",
                RoomNumber = "OPD-108",
                AdmittedDate = DateTime.UtcNow.AddHours(-5),
                Allergies = "None known",
                CurrentMedications = "Amoxicillin-Clavulanate 875mg, Ibuprofen 400mg",
                Notes = "Productive cough and low-grade fever for 4 days. Responding well to oral antibiotherapy.",
                VitalSigns = new List<VitalSign>
                {
                    new VitalSign { HeartRateBpm = 74, BloodPressure = "118/76", TemperatureC = 36.9, SpO2Percent = 99, RespirationRate = 15, BloodSugarMgDl = 92, RecordedAt = DateTime.UtcNow.AddHours(-1) }
                }
            },
            new Patient
            {
                FullName = "Madina Yusupova",
                Age = 67,
                Gender = "Female",
                BloodGroup = "AB+",
                PhoneNumber = "+998 94 333 2211",
                Email = "madina.yusupova@medmail.uz",
                Condition = "Critical",
                PrimaryDiagnosis = "Ischemic Stroke / Right Middle Cerebral Artery Infarct",
                TriageLevel = "Emergency",
                RoomNumber = "Stroke-01",
                AdmittedDate = DateTime.UtcNow.AddHours(-3),
                Allergies = "Contrast dye (moderate)",
                CurrentMedications = "tPA (Alteplase) administered, Mannitol 20%",
                Notes = "Left-sided hemiplegia and dysarthria. Emergency MRI Brain showed acute perfusion deficit.",
                VitalSigns = new List<VitalSign>
                {
                    new VitalSign { HeartRateBpm = 95, BloodPressure = "175/98", TemperatureC = 37.1, SpO2Percent = 95, RespirationRate = 19, BloodSugarMgDl = 160, RecordedAt = DateTime.UtcNow.AddMinutes(-45) }
                }
            },
            new Patient
            {
                FullName = "Dmitriy Kim",
                Age = 35,
                Gender = "Male",
                BloodGroup = "O+",
                PhoneNumber = "+998 91 888 7766",
                Email = "dmitriy.kim@medmail.uz",
                Condition = "Stable",
                PrimaryDiagnosis = "Lumbar Disc Herniation (L4-L5) with Radiculopathy",
                TriageLevel = "Low",
                RoomNumber = "Ortho-312",
                AdmittedDate = DateTime.UtcNow.AddDays(-2),
                Allergies = "NSAIDs (mild gastric upset)",
                CurrentMedications = "Pregabalin 75mg, Paracetamol 1000mg, Physical Therapy",
                Notes = "Pain score decreased from 8/10 to 3/10 following epidural steroid injection.",
                VitalSigns = new List<VitalSign>
                {
                    new VitalSign { HeartRateBpm = 70, BloodPressure = "115/75", TemperatureC = 36.6, SpO2Percent = 99, RespirationRate = 14, BloodSugarMgDl = 88, RecordedAt = DateTime.UtcNow.AddHours(-4) }
                }
            }
        };

        context.Patients.AddRange(patients);
        context.SaveChanges();

        // Seed Medical Scans
        var scans = new List<MedicalScan>
        {
            new MedicalScan
            {
                PatientId = patients[1].Id,
                ScanType = "Chest X-Ray (AP)",
                ImageUrl = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
                UploadedAt = DateTime.UtcNow.AddHours(-6),
                Status = "Completed",
                DetectedFindings = "Bilateral lower lobe interstitial infiltrates and consolidation consistent with viral pneumonia.",
                ConfidenceScore = 96.8,
                Severity = "Moderate",
                HeatmapOverlayUrl = "",
                RadiologistNotes = "AI segment flagged 2 regions of consolidation in the left retrocardiac space.",
                Anomalies = new List<ScanAnomaly>
                {
                    new ScanAnomaly
                    {
                        Label = "Consolidation (Left Lower Lobe)",
                        ConfidencePercent = 97.4,
                        Location = "Left Lower Zone",
                        BoxX = 52.5,
                        BoxY = 58.0,
                        BoxWidth = 28.0,
                        BoxHeight = 24.0,
                        ClinicalSignificance = "High probability of active bacterial/viral alveolar infiltration."
                    },
                    new ScanAnomaly
                    {
                        Label = "Ground-Glass Opacity",
                        ConfidencePercent = 91.2,
                        Location = "Right Middle Zone",
                        BoxX = 22.0,
                        BoxY = 42.0,
                        BoxWidth = 22.0,
                        BoxHeight = 20.0,
                        ClinicalSignificance = "Typical peripheral distribution of inflammatory exudate."
                    }
                }
            },
            new MedicalScan
            {
                PatientId = patients[3].Id,
                ScanType = "Brain MRI (DWI / FLAIR)",
                ImageUrl = "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
                UploadedAt = DateTime.UtcNow.AddHours(-2),
                Status = "Completed",
                DetectedFindings = "Hyperintense signal on DWI in the right MCA territory with corresponding ADC hypointensity.",
                ConfidenceScore = 99.1,
                Severity = "Critical",
                RadiologistNotes = "Immediate vascular neurology review triggered. AI ASPECT score: 6/10.",
                Anomalies = new List<ScanAnomaly>
                {
                    new ScanAnomaly
                    {
                        Label = "Acute Infarction Core",
                        ConfidencePercent = 99.1,
                        Location = "Right MCA Cortical Territory",
                        BoxX = 35.0,
                        BoxY = 28.0,
                        BoxWidth = 34.0,
                        BoxHeight = 32.0,
                        ClinicalSignificance = "Cytotoxic edema and acute ischemic injury; urgent reperfusion candidate."
                    }
                }
            }
        };

        context.MedicalScans.AddRange(scans);

        // Seed Appointments
        var appointments = new List<Appointment>
        {
            new Appointment
            {
                PatientId = patients[0].Id,
                PatientName = patients[0].FullName,
                DoctorName = "Dr. Mansur Sharipov, MD",
                Department = "Cardiology & Interventional Care",
                ScheduledTime = DateTime.UtcNow.AddHours(1),
                Type = "In-Person ICU Round",
                Status = "In-Progress",
                Reason = "Coronary Angiography Pre-op Briefing",
                ClinicalNotes = "Check troponin levels and cardiac ultrasound parameters."
            },
            new Appointment
            {
                PatientId = patients[1].Id,
                PatientName = patients[1].FullName,
                DoctorName = "Dr. Ziyoda Karimova, MD",
                Department = "Pulmonology & Critical Care",
                ScheduledTime = DateTime.UtcNow.AddHours(3),
                Type = "Telehealth",
                Status = "Scheduled",
                Reason = "Post-scan consultation & O2 titration review",
                ClinicalNotes = "Review follow-up chest CT resolution."
            },
            new Appointment
            {
                PatientId = patients[2].Id,
                PatientName = patients[2].FullName,
                DoctorName = "Dr. Dilnoza Rahimova, MD",
                Department = "General Medicine / OPD",
                ScheduledTime = DateTime.UtcNow.AddHours(5),
                Type = "Telehealth",
                Status = "Scheduled",
                Reason = "72h antibiotic response checkup",
                ClinicalNotes = "Evaluate fever chart and auscultation findings."
            }
        };

        context.Appointments.AddRange(appointments);

        // Seed Prescriptions
        var prescription = new Prescription
        {
            PatientId = patients[2].Id,
            PatientName = patients[2].FullName,
            DoctorName = "Dr. Dilnoza Rahimova, MD",
            Diagnosis = "Acute Bronchitis (J20.9)",
            IssuedAt = DateTime.UtcNow.AddHours(-4),
            Instructions = "Take medications with plenty of water. Complete full antibiotic course even if symptoms improve.",
            AiSafetyCheckNotes = "Validated: 0 contraindications. 0 drug-drug interactions detected for Amoxicillin + Ibuprofen.",
            Items = new List<PrescriptionItem>
            {
                new PrescriptionItem { MedicineName = "Amoxicillin / Clavulanic Acid", Dosage = "875/125 mg", Frequency = "1 tablet every 12 hours", Duration = "7 days", Route = "Oral" },
                new PrescriptionItem { MedicineName = "Ibuprofen", Dosage = "400 mg", Frequency = "1 tablet every 8 hours as needed for fever/pain", Duration = "3 days", Route = "Oral" },
                new PrescriptionItem { MedicineName = "Ambroxol Syrup", Dosage = "30 mg / 5ml", Frequency = "10 ml three times daily", Duration = "5 days", Route = "Oral" }
            }
        };

        context.Prescriptions.Add(prescription);

        // Seed Initial Chat Messages
        var initialChats = new List<ChatMessage>
        {
            new ChatMessage
            {
                SessionId = "default-session",
                Sender = "system",
                Text = "MedAI Clinical Intelligence System online. Protocol Version 2026.4 initialized with ICD-10 & UpToDate medical knowledge base.",
                Timestamp = DateTime.UtcNow.AddMinutes(-30)
            },
            new ChatMessage
            {
                SessionId = "default-session",
                Sender = "user",
                Text = "Can you evaluate potential drug interactions between Clopidogrel 75mg and Omeprazole 20mg in a 62yo cardiac patient?",
                Timestamp = DateTime.UtcNow.AddMinutes(-25)
            },
            new ChatMessage
            {
                SessionId = "default-session",
                Sender = "ai",
                Text = "⚠️ **Moderate Interaction Alert (CYP2C19 Inhibition):**\n\nOmeprazole is a competitive inhibitor of CYP2C19, which converts Clopidogrel into its active antiplatelet metabolite. Co-administration can reduce Clopidogrel's antiplatelet efficacy by approximately 40%.\n\n**Clinical Recommendations:**\n1. Consider switching PPI to **Pantoprazole** (significantly weaker CYP2C19 inhibition).\n2. Alternatively, use an H2-receptor antagonist like **Famotidine** if gastroprotection is required.\n3. Monitor platelet aggregation if therapy cannot be modified.",
                Timestamp = DateTime.UtcNow.AddMinutes(-24),
                SuggestedActions = new List<string> { "View Alternative PPIs", "Check Platelet Guidelines", "Generate Clinical Memo" },
                ClinicalCitation = "AHA/ACC 2025 Focused Update on Dual Antiplatelet Therapy Guidelines."
            }
        };

        context.ChatMessages.AddRange(initialChats);
        context.SaveChanges();
    }
}
