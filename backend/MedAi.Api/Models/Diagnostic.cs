namespace MedAi.Api.Models;

public class DiagnosticRequest
{
    public int? PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public int Age { get; set; } = 35;
    public string Gender { get; set; } = "Male";
    public List<string> Symptoms { get; set; } = new();
    public string MedicalHistory { get; set; } = string.Empty;
    public string Duration { get; set; } = "2 days";
    public string Severity { get; set; } = "Moderate"; // Mild, Moderate, Severe, Critical
    public Dictionary<string, double>? Vitals { get; set; }
    public string AdditionalNotes { get; set; } = string.Empty;
}

public class DiagnosticResult
{
    public string AssessmentId { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string OverallRiskLevel { get; set; } = "Medium"; // Low, Medium, High, Critical
    public double ConfidenceScore { get; set; } = 89.5;
    public string Summary { get; set; } = string.Empty;
    public List<DiseaseMatch> DifferentialDiagnoses { get; set; } = new();
    public List<string> RecommendedLabTests { get; set; } = new();
    public List<string> RecommendedActions { get; set; } = new();
    public List<string> RedFlagSymptoms { get; set; } = new();
    public List<string> DrugSuggestions { get; set; } = new();
}

public class DiseaseMatch
{
    public string DiseaseName { get; set; } = string.Empty;
    public string Icd10Code { get; set; } = string.Empty;
    public double ProbabilityPercent { get; set; }
    public string Severity { get; set; } = "Moderate";
    public string Description { get; set; } = string.Empty;
    public List<string> MatchingSymptoms { get; set; } = new();
    public string ClinicalRationale { get; set; } = string.Empty;
}

public class DiagnosticRecord
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
    public string SymptomsJoined { get; set; } = string.Empty;
    public string PrimaryDiagnosis { get; set; } = string.Empty;
    public string Icd10Code { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public string RiskLevel { get; set; } = "Medium";
    public string Summary { get; set; } = string.Empty;
}
