using MedAi.Api.Models;

namespace MedAi.Api.Services;

public interface IAiDiagnosticService
{
    Task<DiagnosticResult> AnalyzeSymptomsAsync(DiagnosticRequest request);
}

public class AiDiagnosticService : IAiDiagnosticService
{
    public Task<DiagnosticResult> AnalyzeSymptomsAsync(DiagnosticRequest request)
    {
        var symptoms = request.Symptoms.Select(s => s.ToLowerInvariant()).ToList();
        var result = new DiagnosticResult
        {
            AssessmentId = $"MED-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
            CreatedAt = DateTime.UtcNow
        };

        var matches = new List<DiseaseMatch>();
        var redFlags = new List<string>();
        var labTests = new List<string>();
        var actions = new List<string>();
        var drugs = new List<string>();

        // Cardiac checks
        if (symptoms.Any(s => s.Contains("chest pain") || s.Contains("angina") || s.Contains("left arm pain") || s.Contains("palpitation")))
        {
            redFlags.Add("Potential acute coronary syndrome (ACS) / Ischemia alert");
            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Acute Coronary Syndrome (Unstable Angina / NSTEMI)",
                Icd10Code = "I20.0",
                ProbabilityPercent = 92.4,
                Severity = "Critical",
                Description = "Critical reduction of myocardial blood flow. Immediate 12-lead ECG and serial cardiac troponins required.",
                MatchingSymptoms = symptoms.Where(s => s.Contains("chest") || s.Contains("arm") || s.Contains("palpitation") || s.Contains("sweat") || s.Contains("breath")).ToList(),
                ClinicalRationale = "High pre-test probability based on acute onset thoracic symptoms and cardiovascular risk profile."
            });
            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Gastroesophageal Reflux Disease (GERD) with Esophageal Spasm",
                Icd10Code = "K21.9",
                ProbabilityPercent = 48.0,
                Severity = "Moderate",
                Description = "Atypical retrosternal burning discomfort often mimicking angina pectoris.",
                MatchingSymptoms = symptoms.Where(s => s.Contains("chest") || s.Contains("burn") || s.Contains("acid")).ToList(),
                ClinicalRationale = "Differential diagnosis for non-cardiac chest discomfort."
            });

            labTests.AddRange(new[] { "High-sensitivity Cardiac Troponin I/T", "12-Lead Electrocardiogram (ECG)", "Echocardiography (TTE)", "Serum Electrolytes & Lipid Panel" });
            actions.AddRange(new[] { "Immediate cardiology consult & bed rest", "Continuous cardiac telemetry monitoring", "Establish IV access, prepare emergency heparin protocol" });
            drugs.AddRange(new[] { "Aspirin 300mg chewable", "Sublingual Nitroglycerin 0.4mg", "Ticagrelor 180mg loading dose" });
            result.OverallRiskLevel = "Critical";
            result.ConfidenceScore = 95.2;
            result.Summary = "Critical cardiovascular symptoms detected. Immediate emergency triage, ECG, and biomarker assessment strongly indicated.";
        }
        // Respiratory checks
        else if (symptoms.Any(s => s.Contains("cough") || s.Contains("fever") || s.Contains("shortness of breath") || s.Contains("dyspnea") || s.Contains("wheezing")))
        {
            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Community-Acquired Pneumonia / Viral Pneumonitis",
                Icd10Code = "J18.9",
                ProbabilityPercent = 88.7,
                Severity = "High",
                Description = "Lower respiratory tract infection with alveolar consolidation and exudate.",
                MatchingSymptoms = symptoms.Where(s => s.Contains("cough") || s.Contains("fever") || s.Contains("breath") || s.Contains("phlegm")).ToList(),
                ClinicalRationale = "Combination of febrile response with respiratory distress points to pulmonary parenchymal involvement."
            });
            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Acute Bronchospastic Bronchitis / Asthma Flare",
                Icd10Code = "J20.8",
                ProbabilityPercent = 64.2,
                Severity = "Moderate",
                Description = "Inflammation of bronchial airways leading to bronchoconstriction and excessive mucus.",
                MatchingSymptoms = symptoms.Where(s => s.Contains("cough") || s.Contains("wheez")).ToList(),
                ClinicalRationale = "Airway reactivity and spasmodic coughing fits."
            });

            if (symptoms.Any(s => s.Contains("shortness of breath") || s.Contains("dyspnea")))
            {
                redFlags.Add("Hypoxemia risk / Respiratory distress");
            }

            labTests.AddRange(new[] { "Chest X-Ray (PA & Lateral views)", "Complete Blood Count (CBC) with differential", "C-Reactive Protein (CRP) & Procalcitonin", "Pulse Oximetry continuous tracking" });
            actions.AddRange(new[] { "Auscultate bilateral lung fields for crackles/rhonchi", "Administer supplemental O2 if SpO2 < 94%", "Check sputum cytology and bacterial culture" });
            drugs.AddRange(new[] { "Azithromycin 500mg daily", "Salbutamol Inhaler (2 puffs PRN)", "Oral Prednisolone 40mg taper (if wheezing)" });
            result.OverallRiskLevel = "High";
            result.ConfidenceScore = 91.0;
            result.Summary = "Significant pulmonary tract involvement with elevated inflammatory risk markers.";
        }
        // Neurological checks
        else if (symptoms.Any(s => s.Contains("headache") || s.Contains("dizziness") || s.Contains("numbness") || s.Contains("weakness") || s.Contains("vision")))
        {
            if (symptoms.Any(s => s.Contains("weakness") || s.Contains("slurred speech") || s.Contains("facial drop")))
            {
                redFlags.Add("FAST protocol stroke alert - Immediate CT/MRI neurovascular imaging required");
                result.OverallRiskLevel = "Critical";
            }
            else
            {
                result.OverallRiskLevel = "Medium";
            }

            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Migraine with Neurovascular Aura / Tension Cephalea",
                Icd10Code = "G43.9",
                ProbabilityPercent = 78.5,
                Severity = "Moderate",
                Description = "Primary headache disorder characterized by recurrent throbbing attacks and autonomic sensitivity.",
                MatchingSymptoms = symptoms.Where(s => s.Contains("headache") || s.Contains("dizziness") || s.Contains("nausea")).ToList(),
                ClinicalRationale = "Characteristic episodic cephalic pain with photophobia/phonophobia."
            });
            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Vestibular Neuritis / Benign Paroxysmal Positional Vertigo (BPPV)",
                Icd10Code = "H81.10",
                ProbabilityPercent = 56.0,
                Severity = "Low",
                Description = "Peripheral vestibular disorder with positional illusion of motion.",
                MatchingSymptoms = symptoms.Where(s => s.Contains("dizziness") || s.Contains("vertigo")).ToList(),
                ClinicalRationale = "Transient rotational vertigo triggered by head position changes."
            });

            labTests.AddRange(new[] { "Non-contrast Brain MRI / Head CT", "Carotid Doppler Ultrasound", "Neurological Fundoscopy" });
            actions.AddRange(new[] { "Perform Dix-Hallpike maneuver & cerebellar tests", "Check blood pressure and orthostatic vitals", "Evaluate cranial nerve symmetry" });
            drugs.AddRange(new[] { "Sumatriptan 50mg (at onset)", "Betahistine 24mg twice daily", "Magnesium Glycinate 400mg" });
            result.ConfidenceScore = 87.8;
            result.Summary = "Neurological manifestation evaluated. Check red flag focal symptoms.";
        }
        // General / Metabolic
        else
        {
            matches.Add(new DiseaseMatch
            {
                DiseaseName = "Acute Metabolic / Viral Syndrome",
                Icd10Code = "B34.9",
                ProbabilityPercent = 75.0,
                Severity = "Mild",
                Description = "Systemic viral or reactive constitutional syndrome.",
                MatchingSymptoms = symptoms,
                ClinicalRationale = "Non-specific constitutional symptoms responsive to hydration and supportive therapy."
            });
            labTests.AddRange(new[] { "Comprehensive Metabolic Panel (CMP)", "Complete Blood Count (CBC)", "Urinalysis" });
            actions.AddRange(new[] { "Maintain adequate oral hydration (2-3 L/day)", "Track temperature and vital signs morning & evening", "Re-evaluate if symptoms persist beyond 72 hours" });
            drugs.AddRange(new[] { "Paracetamol 500mg-1000mg PRN", "Electrolyte oral rehydration solution" });
            result.OverallRiskLevel = "Low";
            result.ConfidenceScore = 84.0;
            result.Summary = "General constitutional symptoms. Supportive therapy and outpatient monitoring recommended.";
        }

        result.DifferentialDiagnoses = matches;
        result.RedFlagSymptoms = redFlags;
        result.RecommendedLabTests = labTests;
        result.RecommendedActions = actions;
        result.DrugSuggestions = drugs;

        return Task.FromResult(result);
    }
}
