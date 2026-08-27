using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedAi.Api.Data;
using MedAi.Api.Models;
using MedAi.Api.Services;

namespace MedAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScansController : ControllerBase
{
    private readonly IScanAnalysisService _scanService;
    private readonly MedAiDbContext _context;

    public ScansController(IScanAnalysisService scanService, MedAiDbContext context)
    {
        _scanService = scanService;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicalScan>>> GetAllScans([FromQuery] string? scanType, [FromQuery] string? severity)
    {
        var query = _context.MedicalScans
            .Include(s => s.Anomalies)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(scanType) && scanType != "All")
        {
            query = query.Where(s => s.ScanType.Contains(scanType));
        }

        if (!string.IsNullOrWhiteSpace(severity) && severity != "All")
        {
            query = query.Where(s => s.Severity == severity);
        }

        return await query.OrderByDescending(s => s.UploadedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalScan>> GetScan(int id)
    {
        var scan = await _context.MedicalScans
            .Include(s => s.Anomalies)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (scan == null)
        {
            return NotFound();
        }

        return scan;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<MedicalScan>> AnalyzeScan([FromBody] ScanAnalysisRequest request)
    {
        var scanResult = await _scanService.AnalyzeScanAsync(request);

        _context.MedicalScans.Add(scanResult);
        await _context.SaveChangesAsync();

        return Ok(scanResult);
    }
}
