using Microsoft.AspNetCore.Mvc;
using MedAi.Api.Data;
using MedAi.Api.Models;
using MedAi.Api.Services;

namespace MedAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiagnosticsController : ControllerBase
{
    private readonly IAiDiagnosticService _diagnosticService;
    private readonly MedAiDbContext _context;

    public DiagnosticsController(IAiDiagnosticService diagnosticService, MedAiDbContext context)
    {
        _diagnosticService = diagnosticService;
        _context = context;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<DiagnosticResult>> AnalyzeSymptoms([FromBody] DiagnosticRequest request)
    {
        if (request.Symptoms == null || !request.Symptoms.Any())
        {
            return BadRequest(new { message = "At least one symptom must be provided." });
        }

        var result = await _diagnosticService.AnalyzeSymptomsAsync(request);

        // If patient ID provided, save record to history
        if (request.PatientId.HasValue && request.PatientId.Value > 0)
        {
            var topMatch = result.DifferentialDiagnoses.FirstOrDefault();
            var record = new DiagnosticRecord
            {
                PatientId = request.PatientId.Value,
                AnalyzedAt = DateTime.UtcNow,
                SymptomsJoined = string.Join(", ", request.Symptoms),
                PrimaryDiagnosis = topMatch?.DiseaseName ?? "Under Evaluation",
                Icd10Code = topMatch?.Icd10Code ?? "R69",
                ConfidenceScore = result.ConfidenceScore,
                RiskLevel = result.OverallRiskLevel,
                Summary = result.Summary
            };

            _context.DiagnosticRecords.Add(record);
            await _context.SaveChangesAsync();
        }

        return Ok(result);
    }

    [HttpGet("history/{patientId}")]
    public async Task<ActionResult<IEnumerable<DiagnosticRecord>>> GetPatientHistory(int patientId)
    {
        var records = _context.DiagnosticRecords
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.AnalyzedAt)
            .ToList();

        return Ok(records);
    }
}
