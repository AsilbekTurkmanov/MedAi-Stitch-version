using Microsoft.AspNetCore.Mvc;
using MedAi.Api.Models;

namespace MedAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClinicsController : ControllerBase
{
    private static readonly List<Clinic> _sampleClinics = new()
    {
        new Clinic
        {
            Id = 1,
            NameUz = "Respublika Shoshilinch Tibbiy Yordam Ilmiy Markazi (16-Gorklinika)",
            NameRu = "Республиканский научный центр экстренной медицинской помощи (РНЦЭМП)",
            NameEn = "Republican Research Centre of Emergency Medicine (RRCEM)",
            AddressUz = "Toshkent sh., Chilonzor tumani, Kichik halqa yo'li, 2-uy",
            AddressRu = "г. Ташкент, Чиланзарский район, Малая кольцевая дорога, 2",
            AddressEn = "2 Little Ring Road, Chilanzar District, Tashkent",
            Latitude = 41.2858,
            Longitude = 69.2084,
            PhoneNumber = "+998 71 277 94 40",
            EmergencyHotline = "103",
            IsEmergency247 = true,
            Rating = 4.9,
            ReviewCount = 480,
            CategoryUz = "Shoshilinch tibbiy yordam markazi",
            CategoryRu = "Центр экстренной медицинской помощи",
            CategoryEn = "Emergency & Trauma Center",
            ServicesUz = new List<string> { "24/7 Reanimatsiya", "Kardiologiya", "Neyrojarrohlik", "KT va MRT 24/7", "Travmatologiya" },
            ServicesRu = new List<string> { "24/7 Реанимация", "Кардиология", "Нейрохирургия", "КТ и МРТ 24/7", "Травматология" },
            ServicesEn = new List<string> { "24/7 ICU & Resuscitation", "Cardiology", "Neurosurgery", "24/7 CT & MRI", "Traumatology" },
            WorkingHours = "24/7 Kechayu-kunduz"
        },
        new Clinic
        {
            Id = 2,
            NameUz = "Akfa Medline Xalqaro Tibbiyot Markazi",
            NameRu = "Многопрофильный медицинский центр Akfa Medline",
            NameEn = "Akfa Medline Multidisciplinary Medical Center",
            AddressUz = "Toshkent sh., Olmazor tumani, Kichik halqa yo'li, 5A-uy",
            AddressRu = "г. Ташкент, Алмазарский район, Малая кольцевая дорога, 5А",
            AddressEn = "5A Little Ring Road, Almazar District, Tashkent",
            Latitude = 41.3486,
            Longitude = 69.2139,
            PhoneNumber = "+998 71 203 30 03",
            EmergencyHotline = "1141",
            IsEmergency247 = true,
            Rating = 4.8,
            ReviewCount = 350,
            CategoryUz = "Ko'p tarmoqli xususiy klinika",
            CategoryRu = "Многопрофильная частная клиника",
            CategoryEn = "Multidisciplinary Private Hospital",
            ServicesUz = new List<string> { "Intervension Kardiologiya", "Robotik Jarrohlik", "MRT 3.0 Tesla", "Pediatriya", "Tez yordam" },
            ServicesRu = new List<string> { "Интервенционная кардиология", "Роботическая хирургия", "МРТ 3.0 Тесла", "Педиатрия", "Скорая помощь" },
            ServicesEn = new List<string> { "Interventional Cardiology", "Robotic Surgery", "3.0 Tesla MRI", "Pediatrics", "Ambulance" },
            WorkingHours = "24/7"
        },
        new Clinic
        {
            Id = 3,
            NameUz = "Shox Med Hospital & Diagnostika Markazi",
            NameRu = "Медицинский центр Shox Med Hospital",
            NameEn = "Shox Med Hospital & Diagnostic Center",
            AddressUz = "Toshkent sh., Mirobod tumani, Oybek ko'chasi, 38-uy",
            AddressRu = "г. Ташкент, Мирабадский район, ул. Ойбека, 38",
            AddressEn = "38 Oybek Street, Mirabad District, Tashkent",
            Latitude = 41.2965,
            Longitude = 69.2789,
            PhoneNumber = "+998 71 202 02 03",
            EmergencyHotline = "+998 71 202 02 03",
            IsEmergency247 = true,
            Rating = 4.7,
            ReviewCount = 210,
            CategoryUz = "Diagnostika va davolash markazi",
            CategoryRu = "Диагностический и лечебный центр",
            CategoryEn = "Diagnostic & Surgical Hospital",
            ServicesUz = new List<string> { "EKG va Exokardiografiya", "Laboratoriya (PZR)", "Nevrologiya", "Ginekologiya", "Rentgen" },
            ServicesRu = new List<string> { "ЭКГ и ЭхоКГ", "ПЦР Лаборатория", "Неврология", "Гинекология", "Цифровой рентген" },
            ServicesEn = new List<string> { "ECG & Echo", "PCR Laboratory", "Neurology", "Gynecology", "Digital X-Ray" },
            WorkingHours = "24/7"
        },
        new Clinic
        {
            Id = 4,
            NameUz = "Respublika Ixtisoslashtirilgan Kardiologiya Ilmiy-Amaliy Markazi",
            NameRu = "Республиканский специализированный научно-практический медицинский центр кардиологии",
            NameEn = "Republican Specialized Scientific Center of Cardiology",
            AddressUz = "Toshkent sh., Mirzo Ulug'bek tumani, Osiyo ko'chasi, 4-uy",
            AddressRu = "г. Ташкент, Мирзо-Улугбекский район, ул. Осиё, 4",
            AddressEn = "4 Osiyo Street, Mirzo Ulugbek District, Tashkent",
            Latitude = 41.3325,
            Longitude = 69.2941,
            PhoneNumber = "+998 71 237 32 30",
            EmergencyHotline = "103",
            IsEmergency247 = true,
            Rating = 4.9,
            ReviewCount = 520,
            CategoryUz = "Ixtisoslashtirilgan Kardiologiya Markazi",
            CategoryRu = "Специализированный кардиологический центр",
            CategoryEn = "Specialized Cardiology & Heart Institute",
            ServicesUz = new List<string> { "Yurak jarrohligi", "Koronar angiografiya", "Elektrofiziologiya", "Intensiv kardiologik reanimatsiya" },
            ServicesRu = new List<string> { "Кардиохирургия", "Коронарография", "Электрофизиология", "Интенсивная кардиореанимация" },
            ServicesEn = new List<string> { "Cardiac Surgery", "Coronary Angiography", "Electrophysiology", "Cardiac ICU" },
            WorkingHours = "24/7"
        },
        new Clinic
        {
            Id = 5,
            NameUz = "Medion Family Clinic & Aesthetic Center",
            NameRu = "Семейная клиника Medion",
            NameEn = "Medion Family Clinic",
            AddressUz = "Toshkent sh., Shayxontohur tumani, Zulfiyaxonim ko'chasi, 18-uy",
            AddressRu = "г. Ташкент, Шайхантахурский район, ул. Зульфияханым, 18",
            AddressEn = "18 Zulfiyaxonim Street, Shaykhantakhur District, Tashkent",
            Latitude = 41.3289,
            Longitude = 69.2536,
            PhoneNumber = "+998 78 140 00 10",
            EmergencyHotline = "+998 78 140 00 10",
            IsEmergency247 = false,
            Rating = 4.6,
            ReviewCount = 180,
            CategoryUz = "Oilaviy poliklinika va diagnostika",
            CategoryRu = "Семейная клиника и диагностика",
            CategoryEn = "Family Care & Wellness Clinic",
            ServicesUz = new List<string> { "Terapevt ko'rigi", "UZI / Doppler", "Klinik laboratoriya", "Fizioterapiya" },
            ServicesRu = new List<string> { "Прием терапевта", "УЗИ / Допплер", "Клиническая лаборатория", "Физиотерапия" },
            ServicesEn = new List<string> { "Primary Care Physician", "Ultrasound / Doppler", "Clinical Lab", "Physical Therapy" },
            WorkingHours = "08:00 - 20:00"
        }
    };

    [HttpGet("nearby")]
    public ActionResult<IEnumerable<Clinic>> GetNearbyClinics([FromQuery] double lat = 41.311081, [FromQuery] double lng = 69.240562, [FromQuery] string? category = null)
    {
        var result = _sampleClinics.Select(c =>
        {
            var distance = CalculateDistanceKm(lat, lng, c.Latitude, c.Longitude);
            return new Clinic
            {
                Id = c.Id,
                NameUz = c.NameUz,
                NameRu = c.NameRu,
                NameEn = c.NameEn,
                AddressUz = c.AddressUz,
                AddressRu = c.AddressRu,
                AddressEn = c.AddressEn,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                PhoneNumber = c.PhoneNumber,
                EmergencyHotline = c.EmergencyHotline,
                IsEmergency247 = c.IsEmergency247,
                Rating = c.Rating,
                ReviewCount = c.ReviewCount,
                CategoryUz = c.CategoryUz,
                CategoryRu = c.CategoryRu,
                CategoryEn = c.CategoryEn,
                ServicesUz = c.ServicesUz,
                ServicesRu = c.ServicesRu,
                ServicesEn = c.ServicesEn,
                WorkingHours = c.WorkingHours,
                DistanceKm = Math.Round(distance, 2)
            };
        }).OrderBy(c => c.DistanceKm).ToList();

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            result = result.Where(c => c.CategoryUz.Contains(category) || c.CategoryRu.Contains(category) || c.CategoryEn.Contains(category)).ToList();
        }

        return Ok(result);
    }

    private static double CalculateDistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371.0; // Earth radius in KM
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}
