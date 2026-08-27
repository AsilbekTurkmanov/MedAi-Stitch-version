namespace MedAi.Api.Models;

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = "Dr. Sarah Vance, MD (Cardiology)";
    public string Department { get; set; } = "Cardiology";
    public DateTime ScheduledTime { get; set; } = DateTime.UtcNow.AddHours(2);
    public string Type { get; set; } = "Telehealth"; // In-Person, Telehealth, AI Follow-up
    public string Status { get; set; } = "Scheduled"; // Scheduled, In-Progress, Completed, Cancelled
    public string Reason { get; set; } = "Regular follow-up and vital review";
    public string TelehealthMeetingLink { get; set; } = "https://medai.health/meet/tele-9831";
    public string ClinicalNotes { get; set; } = string.Empty;
}

public class Prescription
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = "Dr. Michael Chen, MD";
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public string Diagnosis { get; set; } = string.Empty;
    public List<PrescriptionItem> Items { get; set; } = new();
    public string Instructions { get; set; } = string.Empty;
    public string AiSafetyCheckNotes { get; set; } = "No adverse contraindications or allergy conflicts found with patient profile.";
}

public class PrescriptionItem
{
    public int Id { get; set; }
    public int PrescriptionId { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public string Dosage { get; set; } = "500mg";
    public string Frequency { get; set; } = "Twice daily after meals";
    public string Duration { get; set; } = "7 days";
    public string Route { get; set; } = "Oral";
}
