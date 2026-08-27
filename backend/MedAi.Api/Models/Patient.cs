namespace MedAi.Api.Models;

public class Patient
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = "Other"; // Male, Female, Other
    public string BloodGroup { get; set; } = "O+";
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Condition { get; set; } = "Stable"; // Stable, Critical, Monitoring, Discharged
    public string PrimaryDiagnosis { get; set; } = string.Empty;
    public string TriageLevel { get; set; } = "Standard"; // Emergency, Urgent, Standard, Low
    public string RoomNumber { get; set; } = "OPD-101";
    public DateTime AdmittedDate { get; set; } = DateTime.UtcNow;
    public string Allergies { get; set; } = string.Empty;
    public string CurrentMedications { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;

    public List<VitalSign> VitalSigns { get; set; } = new();
    public List<MedicalScan> MedicalScans { get; set; } = new();
    public List<DiagnosticRecord> DiagnosticHistory { get; set; } = new();
}

public class VitalSign
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int HeartRateBpm { get; set; }
    public string BloodPressure { get; set; } = "120/80";
    public double TemperatureC { get; set; } = 36.6;
    public int SpO2Percent { get; set; } = 98;
    public int RespirationRate { get; set; } = 16;
    public double BloodSugarMgDl { get; set; } = 95.0;
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}
