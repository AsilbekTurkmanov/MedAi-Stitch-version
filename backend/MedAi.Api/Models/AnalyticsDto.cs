namespace MedAi.Api.Models;

public class DashboardSummaryDto
{
    public int TotalPatients { get; set; }
    public int CriticalAlerts { get; set; }
    public int ScansAnalyzedToday { get; set; }
    public double AiAccuracyRate { get; set; } = 97.4;
    public int ActiveConsultations { get; set; }
    public int PendingTriage { get; set; }
    public List<TriageLevelCount> TriageDistribution { get; set; } = new();
    public List<WeeklyMetricPoint> WeeklyTriageTrend { get; set; } = new();
    public List<RecentAlertDto> RecentCriticalAlerts { get; set; } = new();
}

public class TriageLevelCount
{
    public string Level { get; set; } = string.Empty;
    public int Count { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class WeeklyMetricPoint
{
    public string Day { get; set; } = string.Empty;
    public int Diagnoses { get; set; }
    public int Scans { get; set; }
    public int Critical { get; set; }
}

public class RecentAlertDto
{
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string Issue { get; set; } = string.Empty;
    public string Severity { get; set; } = "Critical"; // High, Critical
    public DateTime TriggeredAt { get; set; } = DateTime.UtcNow;
    public string RoomNumber { get; set; } = string.Empty;
}
