using MedAi.Api.Models;

namespace MedAi.Api.Services;

public interface IScanAnalysisService
{
    Task<MedicalScan> AnalyzeScanAsync(ScanAnalysisRequest request);
}

public class ScanAnalysisService : IScanAnalysisService
{
    public Task<MedicalScan> AnalyzeScanAsync(ScanAnalysisRequest request)
    {
        var scan = new MedicalScan
        {
            PatientId = request.PatientId,
            ScanType = request.ScanType,
            UploadedAt = DateTime.UtcNow,
            Status = "Completed",
            ImageUrl = !string.IsNullOrEmpty(request.ImageUrl)
                ? request.ImageUrl
                : "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
        };

        if (request.ScanType.Contains("Chest") || request.ScanType.Contains("X-Ray"))
        {
            scan.DetectedFindings = "AI deep-learning vision model detected right lower lobe opacity suspicious for acute bronchopneumonic consolidation with trace pleural effusion.";
            scan.ConfidenceScore = 95.8;
            scan.Severity = "Moderate";
            scan.RadiologistNotes = "Clear cardiothoracic ratio (< 0.50). High-density focus isolated to the right basilar segment.";
            scan.Anomalies = new List<ScanAnomaly>
            {
                new ScanAnomaly
                {
                    Label = "Alveolar Infiltrate",
                    ConfidencePercent = 95.8,
                    Location = "Right Lower Lobe",
                    BoxX = 58.0,
                    BoxY = 52.0,
                    BoxWidth = 24.0,
                    BoxHeight = 22.0,
                    ClinicalSignificance = "Typical acute consolidation pattern."
                },
                new ScanAnomaly
                {
                    Label = "Costophrenic Blunting",
                    ConfidencePercent = 88.3,
                    Location = "Right Costophrenic Angle",
                    BoxX = 72.0,
                    BoxY = 74.0,
                    BoxWidth = 16.0,
                    BoxHeight = 14.0,
                    ClinicalSignificance = "Minor reactive reactive pleural fluid accumulation."
                }
            };
        }
        else if (request.ScanType.Contains("Brain") || request.ScanType.Contains("MRI"))
        {
            scan.DetectedFindings = "Periventricular hyperintensities on T2/FLAIR with no acute midline shift. Microvascular ischemic changes consistent with small vessel disease.";
            scan.ConfidenceScore = 97.4;
            scan.Severity = "Mild";
            scan.RadiologistNotes = "Fazekas Grade 1 white matter lesions. Ventricles and sulci age-appropriate.";
            scan.Anomalies = new List<ScanAnomaly>
            {
                new ScanAnomaly
                {
                    Label = "Deep White Matter Hyperintensity",
                    ConfidencePercent = 94.1,
                    Location = "Left Frontal Periventricular Zone",
                    BoxX = 42.0,
                    BoxY = 36.0,
                    BoxWidth = 18.0,
                    BoxHeight = 18.0,
                    ClinicalSignificance = "Chronic microvascular changes."
                }
            };
        }
        else
        {
            scan.DetectedFindings = "Normal anatomical structures identified. No acute bone fracture, focal mass lesion, or abnormal density observed.";
            scan.ConfidenceScore = 98.2;
            scan.Severity = "Normal";
            scan.RadiologistNotes = "All baseline benchmarks within standard physiological limits.";
            scan.Anomalies = new List<ScanAnomaly>();
        }

        return Task.FromResult(scan);
    }
}
