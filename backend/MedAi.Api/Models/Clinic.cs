namespace MedAi.Api.Models;

public class Clinic
{
    public int Id { get; set; }
    public string NameUz { get; set; } = string.Empty;
    public string NameRu { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string AddressUz { get; set; } = string.Empty;
    public string AddressRu { get; set; } = string.Empty;
    public string AddressEn { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string EmergencyHotline { get; set; } = "103";
    public bool IsEmergency247 { get; set; } = true;
    public double Rating { get; set; } = 4.8;
    public int ReviewCount { get; set; } = 120;
    public string CategoryUz { get; set; } = "Tez tibbiy yordam markazi";
    public string CategoryRu { get; set; } = "Центр экстренной медицинской помощи";
    public string CategoryEn { get; set; } = "Emergency Medical Center";
    public List<string> ServicesUz { get; set; } = new();
    public List<string> ServicesRu { get; set; } = new();
    public List<string> ServicesEn { get; set; } = new();
    public string WorkingHours { get; set; } = "24/7";
    public double DistanceKm { get; set; }
}

public class NearbyClinicRequest
{
    public double Latitude { get; set; } = 41.311081; // Default Tashkent
    public double Longitude { get; set; } = 69.240562;
    public double RadiusKm { get; set; } = 15.0;
    public string? Category { get; set; }
}
