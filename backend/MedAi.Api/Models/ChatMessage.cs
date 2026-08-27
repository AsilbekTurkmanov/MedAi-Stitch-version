namespace MedAi.Api.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string Sender { get; set; } = "user"; // "user", "ai", "system"
    public string Text { get; set; } = string.Empty;
    public string Language { get; set; } = "uz"; // "uz", "ru", "en"
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<string>? SuggestedActions { get; set; }
    public string? ClinicalCitation { get; set; }
}

public class ChatRequest
{
    public string SessionId { get; set; } = "default-session";
    public string Message { get; set; } = string.Empty;
    public int? PatientId { get; set; }
    public string Role { get; set; } = "doctor"; // doctor, patient, nurse
    public string Language { get; set; } = "uz"; // "uz", "ru", "en"
}

public class ChatResponse
{
    public string Reply { get; set; } = string.Empty;
    public string Language { get; set; } = "uz";
    public List<string> SuggestedFollowUps { get; set; } = new();
    public List<string> MedicalReferences { get; set; } = new();
    public string SafetyDisclaimer { get; set; } = "AI tavsiyalari maslahat xarakteriga ega bo‘lib, shifokor tomonidan tasdiqlanishi shart.";
}
