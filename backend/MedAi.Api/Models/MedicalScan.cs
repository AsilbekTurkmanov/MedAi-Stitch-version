namespace MedAi.Api.Models;

public class MedicalScan
{
    public int Id { get; set; }
    public int? PatientId { get; set; }
    public string ScanType { get; set; } = "Chest X-Ray"; // Chest X-Ray, Brain MRI, CT Thorax, Knee MRI, Abdominal Ultrasound
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Completed"; // Processing, Completed, NeedsReview
    public string DetectedFindings { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; } = 94.2;
    public string Severity { get; set; } = "Mild"; // Normal, Mild, Moderate, Severe, Critical
    public string HeatmapOverlayUrl { get; set; } = string.Empty;
    public string RadiologistNotes { get; set; } = string.Empty;
    public List<ScanAnomaly> Anomalies { get; set; } = new();
}

public class ScanAnomaly
{
    public int Id { get; set; }
    public int MedicalScanId { get; set; }
    public string Label { get; set; } = string.Empty;
    public double ConfidencePercent { get; set; }
    public string Location { get; set; } = string.Empty;
    // Bounding box coordinates (percentages 0-100)
    public double BoxX { get; set; }
    public double BoxY { get; set; }
    public double BoxWidth { get; set; }
    public double BoxHeight { get; set; }
    public string ClinicalSignificance { get; set; } = string.Empty;
}

public class ScanAnalysisRequest
{
    public int? PatientId { get; set; }
    public string ScanType { get; set; } = "Chest X-Ray";
    public string? ImageBase64 { get; set; }
    public string? ImageUrl { get; set; }
    public string ClinicalIndication { get; set; } = string.Empty;
}
